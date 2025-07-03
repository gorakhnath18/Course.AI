 import { NavLink } from 'react-router-dom';

function Navbar() {
  const baseLinkClass = "px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 transform hover:scale-105";
  const inactiveLinkClass = "bg-gray-900 border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-white";
  const activeLinkClass = "bg-blue-600 text-white shadow-lg shadow-blue-500/30";

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-2xl font-display font-bold text-white hover:text-blue-500 transition-colors">
            Course.ai
          </NavLink>
          <div className="hidden sm:block">
            <div className="flex items-baseline space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                Generate Course
              </NavLink>
              <NavLink
                to="/my-courses"
                className={({ isActive }) =>
                  `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                My Courses
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;