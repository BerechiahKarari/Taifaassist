import { useState, useEffect } from 'react';
import { Users, MessageSquare, Star, Calendar, TrendingUp, Activity } from 'lucide-react';

export function AdminDashboard({ language }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        {language === 'sw' ? 'Imeshindwa kupakia takwimu' : 'Failed to load analytics'}
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      label: language === 'sw' ? 'Watumiaji' : 'Total Users',
      value: analytics.totalUsers,
      color: 'blue'
    },
    {
      icon: MessageSquare,
      label: language === 'sw' ? 'Mazungumzo' : 'Total Chats',
      value: analytics.totalChats,
      color: 'green'
    },
    {
      icon: Star,
      label: language === 'sw' ? 'Wastani wa Ukadiriaji' : 'Avg Rating',
      value: analytics.avgRating.toFixed(1),
      color: 'yellow'
    },
    {
      icon: Calendar,
      label: language === 'sw' ? 'Miadi' : 'Appointments',
      value: analytics.totalAppointments,
      color: 'purple'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {language === 'sw' ? 'Dashibodi ya Msimamizi' : 'Admin Dashboard'}
        </h2>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          {language === 'sw' ? 'Sasisha' : 'Refresh'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Popular Services */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {language === 'sw' ? 'Huduma Maarufu' : 'Popular Services'}
        </h3>
        <div className="space-y-3">
          {Object.entries(analytics.popularServices || {})
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([service, count]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{service}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(count / Math.max(...Object.values(analytics.popularServices))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {language === 'sw' ? 'Shughuli za Hivi Karibuni' : 'Recent Activity'}
        </h3>
        <div className="space-y-3">
          {analytics.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'chat' ? 'bg-blue-100 dark:bg-blue-900/20' :
                activity.type === 'rating' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                'bg-green-100 dark:bg-green-900/20'
              }`}>
                {activity.type === 'chat' ? <MessageSquare className="w-4 h-4" /> :
                 activity.type === 'rating' ? <Star className="w-4 h-4" /> :
                 <Activity className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {activity.type === 'chat' && (language === 'sw' ? 'Ujumbe mpya' : 'New message')}
                  {activity.type === 'rating' && (language === 'sw' ? 'Ukadiriaji mpya' : 'New rating')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
