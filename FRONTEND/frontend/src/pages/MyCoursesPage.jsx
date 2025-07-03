 import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch all saved courses from our API
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      // Optionally, set an error state to show a message on the UI
    } finally {
      setIsLoading(false);
    }
  };

  // This effect runs once when the component mounts to load the course list
  useEffect(() => {
    fetchCourses();
  }, []);

  // Function to handle the deletion of a course
  const handleDelete = async (courseId, event) => {
    // Prevent the <Link> from navigating when we click the delete button
    event.preventDefault();
    event.stopPropagation();

    // Ask for user confirmation before deleting
    if (window.confirm('Are you sure you want to permanently delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
        // For a fast UI update, filter the deleted course out of the local state
        // This removes it from the view instantly without needing to re-fetch.
        setCourses(currentCourses => currentCourses.filter(course => course._id !== courseId));
      } catch (error) {
        console.error('Failed to delete course:', error);
        alert('Could not delete the course. Please try again.');
      }
    }
  };

  // Display a loading message while fetching data
  if (isLoading) {
    return <div className="text-center text-xl text-gray-400">Loading your saved courses...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-display font-bold text-white mb-8">
        My Saved Courses
      </h1>
      
      {/* Display a message if no courses have been saved yet */}
      {courses.length === 0 ? (
        <div className="text-center bg-gray-900 border border-gray-700 rounded-lg p-12">
          <h3 className="text-2xl font-bold text-white">No Courses Found</h3>
          <p className="text-gray-400 mt-2">You haven't generated and saved any courses yet. Go create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            // The Link now points to the specific course URL using its database _id
            <Link to={`/course/${course._id}`} key={course._id} className="relative block group">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-full flex flex-col justify-between transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-blue-500 group-hover:shadow-xl group-hover:shadow-blue-500/10">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 italic truncate">
                    Prompt: "{course.originalPrompt}"
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Created on: {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* The delete button appears on hover */}
              <button 
                onClick={(e) => handleDelete(course._id, e)}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 focus:opacity-100"
                title="Delete Course"
              >
                {/* A simple 'X' or a trash can emoji works well */}
                ✕ 
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCoursesPage;