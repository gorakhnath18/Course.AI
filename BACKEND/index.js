 import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  getRoadmapPrompt, 
  getModuleDetailPrompt, 
  getDeepDivePrompt, 
  getQuizPrompt, 
  getSearchAnswerPrompt 
} from './prompt.js';
import Course from './models/Course.js';
import { findBestYouTubeVideos } from './services/youtubeService.js';

// --- Initialize & DB Connection ---
const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

// --- Middleware ---
// Specific CORS configuration to prevent connection errors from the frontend
app.use(cors({
  origin: 'http://localhost:5173', // Must match your frontend's address
  methods: ['GET', 'POST', 'DELETE'], // Allowed HTTP methods
  credentials: true
}));

app.use(express.json());


// --- Helper Function for Robust JSON Parsing ---
function cleanAndParseJson(text) {
  let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.warn('Initial JSON.parse failed. Attempting to fix string by escaping backslashes...');
    const fixedText = cleanedText.replace(/\\(?!["\\/bfnrt])/g, '\\\\');
    try {
        return JSON.parse(fixedText);
    } catch (finalError) {
        console.error("Fatal Error: Could not parse JSON even after attempting to fix.", finalError);
        console.error("Problematic Text Content:", cleanedText);
        throw new Error("Invalid JSON response from AI model");
    }
  }
}


// --- API Routes ---

// 1. POST /api/generate-roadmap
app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required.' });
    
    const prompt = getRoadmapPrompt(topic);
    const result = await model.generateContent(prompt);
    const roadmapData = cleanAndParseJson(result.response.text());

    const newCourse = new Course({
      title: roadmapData.title,
      originalPrompt: topic,
      roadmap: roadmapData.roadmap,
      lessons: roadmapData.roadmap.map(item => ({ title: item.title, isGenerated: false })),
    });
    await newCourse.save();
    console.log(`Roadmap for "${topic}" created and saved with ID: ${newCourse._id}`);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error in /generate-roadmap:', error.message);
    res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
});

// 2. POST /api/courses/:courseId/generate-module
app.post('/api/courses/:courseId/generate-module', async (req, res) => {
  try {
    const { moduleTitle, moduleDescription } = req.body;
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const existingLesson = course.lessons.find(lesson => lesson.title === moduleTitle);
    if (existingLesson && existingLesson.isGenerated) {
        return res.json(existingLesson);
    }
    
    const prompt = getModuleDetailPrompt(moduleTitle, moduleDescription);
    const result = await model.generateContent(prompt);
    const moduleDetailData = cleanAndParseJson(result.response.text());
    
    if (!Array.isArray(moduleDetailData.flashcards) || !moduleDetailData.flashcards.every(f => typeof f === 'object' && f.front && f.back)) {
        console.warn("Received malformed flashcards data from AI. Substituting with an empty array.");
        moduleDetailData.flashcards = [];
    }

    const newLessonData = {
      title: moduleDetailData.title,
      notes: moduleDetailData.detailedNotes,
      deepDiveTopics: moduleDetailData.deepDiveTopics,
      flashcards: moduleDetailData.flashcards,
      youtubeVideos: [],
      isGenerated: true,
    };

    const lessonIndex = course.lessons.findIndex(l => l.title === moduleTitle);
    if (lessonIndex > -1) { course.lessons[lessonIndex] = newLessonData; } 
    else { course.lessons.push(newLessonData); }
    
    await course.save();
    console.log(`Module "${moduleTitle}" generated and saved to course ${courseId}.`);
    
    res.json(newLessonData);
  } catch (error) {
    console.error('Error in /generate-module:', error.message);
    res.status(500).json({ error: 'Failed to generate module detail.' });
  }
});

// 3. POST /api/deep-dive
app.post('/api/deep-dive', async (req, res) => {
  try {
    const { originalText, subTopic } = req.body;
    if (!originalText || !subTopic) return res.status(400).json({ error: 'Original text and sub-topic are required.' });
    
    const prompt = getDeepDivePrompt(originalText, subTopic);
    const result = await model.generateContent(prompt);
    const deepDiveData = cleanAndParseJson(result.response.text());
    res.json(deepDiveData);
  } catch (error) {
    console.error('Error in /deep-dive:', error.message);
    res.status(500).json({ error: 'Failed to generate deep dive content.' });
  }
});

// 4. POST /api/search-module
app.post('/api/search-module', async (req, res) => {
  try {
    const { contextNotes, userQuestion } = req.body;
    if (!contextNotes || !userQuestion) return res.status(400).json({ error: 'Context and question are required.' });

    const prompt = getSearchAnswerPrompt(contextNotes, userQuestion);
    const result = await model.generateContent(prompt);
    const answerData = cleanAndParseJson(result.response.text());
    
    res.json(answerData);
  } catch (error) {
    console.error('Error in /search-module:', error.message);
    res.status(500).json({ error: 'Failed to answer question.' });
  }
});

// 5. POST /api/fetch-videos
app.post('/api/fetch-videos', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'A search query is required.' });

    const videos = await findBestYouTubeVideos(query, 2);
    res.json(videos);
  } catch (error) {
    console.error('Error in /fetch-videos endpoint:', error.message);
    res.status(500).json({ error: 'Failed to fetch videos.' });
  }
});

// 6. GET /api/courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error in /api/courses:', error.message);
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
});

// 7. GET /api/courses/:id
app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found.' });
        res.json(course);
    } catch (error) {
        console.error(`Error in /api/courses/${req.params.id}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch course.' });
    }
});

// 8. DELETE /api/courses/:id
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ error: 'Course not found.' });
    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting course ${req.params.id}:`, error.message);
    res.status(500).json({ error: 'Failed to delete course.' });
  }
});

// 9. POST /api/generate-quiz
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { lessonTopic, questionCount } = req.body;
    if (!lessonTopic || !questionCount) return res.status(400).json({ error: 'Lesson topic and question count are required.' });
    
    const prompt = getQuizPrompt(lessonTopic, questionCount);
    const result = await model.generateContent(prompt);
    const quizData = cleanAndParseJson(result.response.text());
    
    res.json(quizData);
  } catch (error) {
    console.error('Error generating quiz:', error.message);
    res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});


// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});