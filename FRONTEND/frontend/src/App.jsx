 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MyCoursesPage from './pages/MyCoursesPage';
import CoursePage from './pages/CoursePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-800 text-gray-300">
      <Router>
        <Navbar />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;