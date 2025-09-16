import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  TrendingUp,
  Search,
  ChevronDown,
} from 'lucide-react';

const usersData = [
  { id: 1, name: 'Alice Johnson', progress: 85, active: true },
  { id: 2, name: 'Bob Smith', progress: 62, active: true },
  { id: 3, name: 'Charlie Brown', progress: 45, active: false },
  { id: 4, name: 'Diana Prince', progress: 95, active: true },
  { id: 5, name: 'Eve Adams', progress: 20, active: false },
  { id: 6, name: 'Frank Miller', progress: 78, active: true },
];

const StudentPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...usersData];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [usersData, sortConfig]);

  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getOverallAnalytics = () => {
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter((u) => u.active).length;
    const averageProgress =
      usersData.reduce((sum, u) => sum + u.progress, 0) / totalUsers;
    return {
      totalUsers,
      activeUsers,
      averageProgress: Math.round(averageProgress),
    };
  };

  const analytics = getOverallAnalytics();

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          User Analytics Dashboard
        </h1>

        {/* Overall Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105">
            <div className="flex-grow">
              <div className="text-sm text-gray-500 font-medium">Total Users</div>
              <div className="text-3xl font-bold text-gray-800">{analytics.totalUsers}</div>
            </div>
            <Users size={48} className="text-blue-500 opacity-70" />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105">
            <div className="flex-grow">
              <div className="text-sm text-gray-500 font-medium">Active Now</div>
              <div className="text-3xl font-bold text-gray-800">{analytics.activeUsers}</div>
            </div>
            <CheckCircle size={48} className="text-green-500 opacity-70" />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105">
            <div className="flex-grow">
              <div className="text-sm text-gray-500 font-medium">Avg. Progress</div>
              <div className="text-3xl font-bold text-gray-800">{analytics.averageProgress}%</div>
            </div>
            <TrendingUp size={48} className="text-purple-500 opacity-70" />
          </div>
        </div>

        {/* User Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">User Details</h2>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('progress')}
                  >
                    Progress {getSortIcon('progress')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('active')}
                  >
                    Status {getSortIcon('active')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="w-40 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${user.progress}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-600">
                          {user.progress}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;