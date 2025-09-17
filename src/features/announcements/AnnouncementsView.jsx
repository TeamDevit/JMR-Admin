import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Send } from 'lucide-react';

const AnnouncementsView = ({ announcements = [], handleAddAnnouncement, userRole, courses = [] }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and content are required.');
      return;
    }
    handleAddAnnouncement({ title, content, courseCode: selectedCourse });
    setTitle('');
    setContent('');
    setSelectedCourse('all');
  };

  const getCourseName = (courseCode) => {
    if (courseCode === 'all') {
      return 'All Courses';
    }
    const course = courses.find(c => c.code === courseCode);
    return course ? course.name : 'Unknown Course';
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (selectedCourse === 'all') return true;
    return announcement.courseCode === selectedCourse;
  });

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Announcements</h2>

        {userRole === 'admin' && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Create New Announcement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  placeholder="e.g., Important Update for All Students"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  placeholder="Write your announcement here..."
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="course-select" className="block text-sm font-medium text-gray-700">Send to Course</label>
                <select
                  id="course-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.code}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Send size={16} />
                  <span>Send Announcement</span>
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">All Announcements</h3>
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map(announcement => (
              <div key={announcement.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{announcement.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{announcement.date}</span>
                    <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      {getCourseName(announcement.courseCode)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600">{announcement.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No announcements have been made yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsView;
