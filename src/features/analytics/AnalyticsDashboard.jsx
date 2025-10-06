import { useState, useEffect } from 'react';
import { FaFileExcel, FaChartLine, FaUsers, FaDollarSign, FaBook, FaCalendar, FaSync } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import api from '../../utils/api';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [progressStats, setProgressStats] = useState(null);
  const [contentSummary, setContentSummary] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [error, setError] = useState(null);

  const fetchAllAnalytics = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (dateRange.start) queryParams.append('startDate', dateRange.start);
      if (dateRange.end) queryParams.append('endDate', dateRange.end);
      const queryString = queryParams.toString();

      const [dashboard, overview, usage, progress, content] = await Promise.allSettled([
        api.get(`/admin/dashboard/stats${queryString ? '?' + queryString : ''}`),
        api.get(`/admin/analytics/overview${queryString ? '?' + queryString : ''}`),
        api.get(`/admin/analytics/usage${queryString ? '?' + queryString : ''}`),
        api.get(`/admin/analytics/progress${queryString ? '?' + queryString : ''}`),
        api.get(`/admin/content/summary`)
      ]);

      if (dashboard.status === 'fulfilled') setDashboardStats(dashboard.value.data.data || dashboard.value.data);
      if (overview.status === 'fulfilled') setAnalyticsOverview(overview.value.data.data || overview.value.data);
      if (usage.status === 'fulfilled') setUsageStats(usage.value.data.data || usage.value.data);
      if (progress.status === 'fulfilled') setProgressStats(progress.value.data.data || progress.value.data);
      if (content.status === 'fulfilled') setContentSummary(content.value.data.data || content.value.data);

      const hasAnyError = [dashboard, overview, usage, progress, content].some(r => r.status === 'rejected');
      if (hasAnyError) {
        console.warn('Some analytics endpoints failed, showing partial data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllAnalytics();
  }, [dateRange]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    if (dashboardStats) {
      const dashData = [
        ['Dashboard Statistics', ''],
        ['Metric', 'Value'],
        ['Total Revenue', `₹${dashboardStats.totalRevenue?.toFixed(2) || 0}`],
        ['Total Students', dashboardStats.totalStudents || 0],
        ['Active Courses', dashboardStats.courses?.length || 0],
        [''],
      ];
      
      if (dashboardStats.courses?.length > 0) {
        dashData.push(['Course Performance', '']);
        dashData.push(['Course Name', 'Students', 'Revenue', 'Avg Progress']);
        dashboardStats.courses.forEach(course => {
          dashData.push([
            course.title,
            course.totalStudents || 0,
            `₹${course.totalRevenue?.toFixed(2) || 0}`,
            `${course.averageProgress?.toFixed(1) || 0}%`
          ]);
        });
      }
      
      const ws1 = XLSX.utils.aoa_to_sheet(dashData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Dashboard');
    }

    if (analyticsOverview) {
      const overviewData = [
        ['Analytics Overview', ''],
        ['Metric', 'Value'],
        ['Total Users', analyticsOverview.totalUsers || 0],
        ['Active Users', analyticsOverview.activeUsers || 0],
        ['New Users', analyticsOverview.newUsers || 0],
        ['Avg Completion Rate', `${analyticsOverview.averageCompletionRate?.toFixed(1) || 0}%`]
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Overview');
    }

    if (usageStats?.loginActivity?.length > 0) {
      const usageData = [['Login Activity', ''], ['Date', 'Logins']];
      usageStats.loginActivity.forEach(day => {
        usageData.push([day.date, day.count || 0]);
      });
      const ws3 = XLSX.utils.aoa_to_sheet(usageData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Usage Stats');
    }

    if (progressStats) {
      const progressData = [['Progress Statistics', ''], ['Category', 'Metric', 'Value']];
      
      if (progressStats.usersByDay) {
        progressData.push(['', 'Users by Day', '']);
        Object.entries(progressStats.usersByDay).forEach(([day, count]) => {
          progressData.push(['', `Day ${day}`, count]);
        });
      }
      
      if (progressStats.moduleCompletion) {
        progressData.push(['', 'Module Completion', '']);
        Object.entries(progressStats.moduleCompletion).forEach(([module, avg]) => {
          progressData.push(['', module, `${avg?.toFixed(1) || 0}%`]);
        });
      }
      
      const ws4 = XLSX.utils.aoa_to_sheet(progressData);
      XLSX.utils.book_append_sheet(wb, ws4, 'Progress');
    }

    if (contentSummary) {
      const contentData = [
        ['Content Summary', ''],
        ['Metric', 'Value'],
        ['Total Days', contentSummary.totalDays || 0],
        ['Published Days', contentSummary.publishedDays || 0],
        ['Total Vocabulary', contentSummary.totalVocabulary || 0],
        ['Total Quiz Items', contentSummary.totalQuizItems || 0]
      ];
      const ws5 = XLSX.utils.aoa_to_sheet(contentData);
      XLSX.utils.book_append_sheet(wb, ws5, 'Content');
    }

    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `erus-analytics-${timestamp}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-red-50 border border-red-200 text-red-800 px-8 py-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Error Loading Analytics</h3>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => fetchAllAnalytics()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive platform insights and reporting</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => fetchAllAnalytics(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <FaSync className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold"
            >
              <FaFileExcel className="text-xl" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-4">
          <FaCalendar className="text-indigo-600 text-xl" />
          <div className="flex gap-4 flex-1">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => setDateRange({ start: '', end: '' })}
            className="mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={<FaDollarSign className="text-3xl" />}
          title="Total Revenue"
          value={`₹${dashboardStats?.totalRevenue?.toFixed(2) || 0}`}
          color="bg-green-500"
        />
        <MetricCard
          icon={<FaUsers className="text-3xl" />}
          title="Total Students"
          value={dashboardStats?.totalStudents || 0}
          color="bg-blue-500"
        />
        <MetricCard
          icon={<FaChartLine className="text-3xl" />}
          title="Avg Completion"
          value={`${analyticsOverview?.averageCompletionRate?.toFixed(1) || 0}%`}
          color="bg-purple-500"
        />
        <MetricCard
          icon={<FaBook className="text-3xl" />}
          title="Published Days"
          value={`${contentSummary?.publishedDays || 0}/${contentSummary?.totalDays || 0}`}
          color="bg-orange-500"
        />
      </div>

      {/* Course Performance */}
      {dashboardStats?.courses?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaBook className="text-indigo-600" />
            Course Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-left text-gray-600">
                  <th className="pb-3 font-semibold">Course</th>
                  <th className="pb-3 font-semibold">Students</th>
                  <th className="pb-3 font-semibold">Revenue</th>
                  <th className="pb-3 font-semibold">Avg Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboardStats.courses.map((course, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="py-4 font-medium text-gray-900">{course.title}</td>
                    <td className="py-4 text-gray-700">{course.totalStudents || 0}</td>
                    <td className="py-4 text-green-600 font-semibold">₹{course.totalRevenue?.toFixed(2) || 0}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.averageProgress || 0}%` }}
                          />
                        </div>
                        <span className="text-gray-700 font-medium">{course.averageProgress?.toFixed(1) || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User & Content Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">User Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Users</span>
              <span className="text-2xl font-bold text-gray-900">{analyticsOverview?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-600">Active Users</span>
              <span className="text-2xl font-bold text-green-600">{analyticsOverview?.activeUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">New Users</span>
              <span className="text-2xl font-bold text-blue-600">{analyticsOverview?.newUsers || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Content Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Vocabulary</span>
              <span className="text-2xl font-bold text-gray-900">{contentSummary?.totalVocabulary || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-600">Total Quiz Items</span>
              <span className="text-2xl font-bold text-purple-600">{contentSummary?.totalQuizItems || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-600">Published Days</span>
              <span className="text-2xl font-bold text-orange-600">
                {contentSummary?.publishedDays || 0}/{contentSummary?.totalDays || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Trends */}
      {usageStats?.loginActivity?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaChartLine className="text-indigo-600" />
            Login Activity (Last 7 Days)
          </h2>
          <div className="flex items-end gap-3 h-64 px-4">
            {usageStats.loginActivity.slice(-7).map((day, idx) => {
              const maxCount = Math.max(...usageStats.loginActivity.map(d => d.count || 0));
              const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-300 hover:from-indigo-500 hover:to-indigo-300"
                      style={{ height: `${height}%` }}
                      title={`${day.count || 0} logins`}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{day.count || 0}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ icon, title, value, color }) => (
  <div className={`${color} text-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between mb-2">
      {icon}
    </div>
    <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default AnalyticsDashboard;