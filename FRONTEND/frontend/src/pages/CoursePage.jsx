 import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import RoadmapSidebar from '../components/RoadmapSidebar';
import ModuleView from '../components/ModuleView';
import { CgSpinner } from 'react-icons/cg';

function CoursePage() {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [loadingModuleTitle, setLoadingModuleTitle] = useState(null);

  const location = useLocation();
  const { courseId } = useParams();

  // Effect to load the main course structure (the roadmap)
  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      setActiveModule(null); // Clear active module when course ID changes
      try {
        // Case 1: A new course was just generated and passed via navigation state
        if (location.state?.course) {
          setCourse(location.state.course);
        } 
        // Case 2: We are viewing an old course, so fetch it by its ID from the URL
        else if (courseId) {
          const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
          setCourse(response.data);
          // For old courses, find the first generated lesson to display, if any
          const firstGeneratedLesson = response.data.lessons.find(l => l.isGenerated);
          if (firstGeneratedLesson) {
            setActiveModule(firstGeneratedLesson);
          }
        }
      } catch (error) { 
        console.error("Failed to fetch course:", error);
      } finally { 
        setIsLoading(false); 
      }
    };
    loadCourse();
  }, [courseId, location.state]);

  // Effect to automatically generate the first module for a NEW course
  useEffect(() => {
    // Check if `course` is loaded and if it was passed via state (meaning it's new)
    if (course && location.state?.course && !activeModule && !loadingModuleTitle) {
      const firstModuleInRoadmap = course.roadmap[0];
      if (firstModuleInRoadmap) {
        // Automatically "click" the first module to trigger its generation
        handleModuleClick(firstModuleInRoadmap);
      }
    }
  }, [course, location.state, activeModule, loadingModuleTitle]); // Dependencies ensure this runs at the right time


  const handleModuleClick = async (module) => {
    if (loadingModuleTitle === module.title) return; // Don't re-click while loading
    
    // Check if we have already generated and stored this lesson in our state
    const existingLesson = course.lessons.find(l => l.title === module.title && l.isGenerated);
    if (existingLesson) {
      setActiveModule(existingLesson);
      return; // No need to fetch from API
    }

    setLoadingModuleTitle(module.title);
    
    try {
      const response = await axios.post(`http://localhost:5000/api/courses/${course._id}/generate-module`, {
        moduleTitle: module.title,
        moduleDescription: module.description
      });
      const newLesson = response.data;
      setActiveModule(newLesson);

      // Update the main course state so we don't have to re-fetch this lesson if clicked again
      setCourse(prevCourse => ({
          ...prevCourse,
          lessons: prevCourse.lessons.map(l => l.title === newLesson.title ? newLesson : l)
      }));

    } catch (error) {
      alert("Could not generate module content. Please try again.");
    } finally {
      setLoadingModuleTitle(null);
    }
  };

  if (isLoading) {
    return <div className="text-center text-xl p-10">Loading Course...</div>;
  }
  if (!course) {
    return <div className="text-center text-xl text-red-500 p-10">Could not load course data.</div>;
  }
  
  return (
    <div>
      <h1 className="text-4xl font-display font-bold text-white mb-2">{course.title}</h1>
      <p className="text-lg text-gray-400 mb-8">Prompt: "{course.originalPrompt}"</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <RoadmapSidebar 
            roadmap={course.roadmap}
            onModuleClick={handleModuleClick}
            activeModuleTitle={activeModule?.title}
            loadingModuleTitle={loadingModuleTitle}
          />
        </div>
        <div className="lg:col-span-3">
          {/* Show a main spinner only when the very first module is auto-loading */}
          {loadingModuleTitle && !activeModule ? (
            <div className="flex items-center justify-center h-full bg-gray-900 border border-gray-700 rounded-lg p-8 min-h-[500px]">
              <div className="text-center">
                <CgSpinner className="animate-spin text-blue-500 mx-auto" size={40} />
                <p className="mt-4 text-lg text-gray-400">Generating module: {loadingModuleTitle}...</p>
              </div>
            </div>
          ) : (
            <ModuleView moduleData={activeModule} />
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;