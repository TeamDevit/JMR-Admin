import React, { useState, useEffect } from 'react';
import { Search, FileDown, DollarSign, BarChart } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const TransactionsView = ({ transactions = [], handleExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Mock data for transactions. Replace this with an API call later.
  const mockTransactions = [
    { id: 'txn-1', studentID: 'student-1', studentName: 'Alice Johnson', courseName: 'English Language Mastery', amount: 12999, date: '2023-10-26', status: 'Completed', method: 'Razorpay' },
    { id: 'txn-2', studentID: 'student-2', studentName: 'Bob Williams', courseName: 'Conversational Spanish', amount: 9999, date: '2023-10-20', status: 'Completed', method: 'Razorpay' },
    { id: 'txn-3', studentID: 'student-3', studentName: 'Charlie Brown', courseName: 'Data Science Fundamentals', amount: 19999, date: '2023-10-15', status: 'Completed', method: 'Stripe' },
    { id: 'txn-4', studentID: 'student-1', studentName: 'Alice Johnson', courseName: 'Data Science Fundamentals', amount: 19999, date: '2023-10-10', status: 'Completed', method: 'Razorpay' },
    { id: 'txn-5', studentID: 'student-4', studentName: 'David Lee', courseName: 'English Language Mastery', amount: 12999, date: '2023-10-05', status: 'Pending', method: 'Razorpay' },
    { id: 'txn-6', studentID: 'student-5', studentName: 'Eva Green', courseName: 'Conversational Spanish', amount: 9999, date: '2023-09-28', status: 'Completed', method: 'PayPal' },
    { id: 'txn-7', studentID: 'student-6', studentName: 'Frank White', courseName: 'Data Science Fundamentals', amount: 19999, date: '2023-09-22', status: 'Failed', method: 'Razorpay' },
  ];
  
  const [localTransactions, setLocalTransactions] = useState(mockTransactions);

  useEffect(() => {
    const revenue = localTransactions.reduce((acc, curr) => {
      // Only count completed transactions for revenue
      return curr.status === 'Completed' ? acc + curr.amount : acc;
    }, 0);
    setTotalRevenue(revenue);
  }, [localTransactions]);

  const filteredTransactions = localTransactions.filter(t =>
    (t.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.studentID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleExportData = () => {
    if (localTransactions.length === 0) {
      toast.error("No data to export.");
      return;
    }
    const headers = ["Transaction ID", "Student ID", "Student Name", "Course", "Amount", "Date", "Status", "Method"];
    const csvContent = headers.join(',') + '\n' +
      localTransactions.map(t => 
        `${t.id},${t.studentID},"${t.studentName}","${t.courseName}",${t.amount},${t.date},${t.status},${t.method}`
      ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "transactions_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Transaction report exported successfully!");
  };

  return (
    <div className="flex-1 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-7xl flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Payment Transactions</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by student or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors duration-200"
          >
            <FileDown size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <BarChart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-xl font-bold text-gray-900">{(localTransactions || []).length}</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t, index) => (
                  <tr key={t.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.studentID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{t.amount?.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.method}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default TransactionsView;
