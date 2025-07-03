 // backend/models/Course.js
import mongoose from 'mongoose';

const roadmapItemSchema = new mongoose.Schema({
    title: String,
    description: String,
});

const lessonSchema = new mongoose.Schema({
    title: String,
    // THE FIX IS HERE: 'notes' is now an array of strings
    notes: [String], 
    deepDiveTopics: [String], // Good to explicitly add this too
    flashcards: [{ 
        front: String, 
        back: String 
    }],
    youtubeVideos: [{ 
        videoId: String, 
        title: String 
    }],
    isGenerated: { type: Boolean, default: false }
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    originalPrompt: { type: String, required: true },
    roadmap: [roadmapItemSchema],
    lessons: [lessonSchema],
    createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', courseSchema);
export default Course;