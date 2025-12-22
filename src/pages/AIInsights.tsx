import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Brain, TrendingUp, TriangleAlert as AlertTriangle, Lightbulb, Target, Clock, CircleCheck as CheckCircle, Eye, ChartBar as BarChart3, Users, Building, Car, Zap } from 'lucide-react';

export default function AIInsights() {
  const { user } = useAuth();
  const { aiInsights, analytics } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const categories = ['all', 'security', 'maintenance', 'amenity', 'parking', 'visitor'];
  const priorities = ['all', 'low', 'medium', 'high'];

  const filteredInsights = aiInsights.filter(insight => {
    const matchesCategory = selectedCategory === 'all' || insight.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || insight.priority === selectedPriority;
    return matchesCategory && matchesPriority;
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'suggestion': return Lightbulb;
      case 'prediction': return TrendingUp;
      case 'optimization': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-red-200 bg-red-50';
    if (priority === 'medium') return 'border-yellow-200 bg-yellow-50';
    
    switch (type) {
      case 'alert': return 'border-red-200 bg-red-50';
      case 'suggestion': return 'border-blue-200 bg-blue-50';
      case 'prediction': return 'border-purple-200 bg-purple-50';
      case 'optimization': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return AlertTriangle;
      case 'maintenance': return Target;
      case 'amenity': return Building;
      case 'parking': return Car;
      case 'visitor': return Users;
      default: return Brain;
    }
  };

  const predictiveAnalytics = [
    {
      title: 'Peak Visitor Hours',
      prediction: 'Expected 40% increase in visitors between 6-8 PM today',
      confidence: 87,
      impact: 'High',
      recommendation: 'Deploy additional security staff during peak hours'
    },
    {
      title: 'Amenity Demand Forecast',
      prediction: 'Gym usage will peak at 85% capacity tomorrow morning',
      confidence: 92,
      impact: 'Medium',
      recommendation: 'Implement time slot booking system'
    },
    {
      title: 'Maintenance Schedule',
      prediction: 'Pool filter requires maintenance within 5 days',
      confidence: 78,
      impact: 'Medium',
      recommendation: 'Schedule preventive maintenance to avoid downtime'
    },
    {
      title: 'Parking Optimization',
      prediction: 'Visitor parking will be 95% full during weekend events',
      confidence: 85,
      impact: 'High',
      recommendation: 'Reserve additional spaces or implement valet service'
    }
  ];

  const performanceMetrics = [
    { label: 'Visitor Processing Time', value: '2.3 min', trend: 'down', improvement: '15%' },
    { label: 'Amenity Utilization', value: '78%', trend: 'up', improvement: '8%' },
    { label: 'Security Response Time', value: '1.8 min', trend: 'down', improvement: '22%' },
    { label: 'Maintenance Efficiency', value: '94%', trend: 'up', improvement: '12%' }
  ];

  const smartRecommendations = [
    {
      title: 'Optimize Gym Schedule',
      description: 'Based on usage patterns, consider extending morning hours by 1 hour',
      impact: 'Increase satisfaction by 15%',
      effort: 'Low',
      category: 'amenity'
    },
    {
      title: 'Implement Dynamic Pricing',
      description: 'Use demand-based pricing for premium amenities during peak hours',
      impact: 'Increase revenue by 25%',
      effort: 'Medium',
      category: 'amenity'
    },
    {
      title: 'Predictive Maintenance',
      description: 'Schedule equipment maintenance based on usage patterns and sensor data',
      impact: 'Reduce downtime by 30%',
      effort: 'High',
      category: 'maintenance'
    },
    {
      title: 'Smart Parking Allocation',
      description: 'Automatically assign parking spots based on visitor duration and preferences',
      impact: 'Improve efficiency by 20%',
      effort: 'Medium',
      category: 'parking'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">AI Insights & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Intelligent insights and predictions to optimize residential management.
        </p>
      </div>

      {/* AI Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">AI Insights Generated</div>
              <div className="text-2xl font-bold">{aiInsights.length}</div>
              <div className="text-sm opacity-90">This week</div>
            </div>
            <Brain className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Predictions Accuracy</div>
              <div className="text-2xl font-bold">87%</div>
              <div className="text-sm opacity-90">Average confidence</div>
            </div>
            <Target className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Optimization Potential</div>
              <div className="text-2xl font-bold">23%</div>
              <div className="text-sm opacity-90">Efficiency gain</div>
            </div>
            <TrendingUp className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Actions Required</div>
              <div className="text-2xl font-bold">{aiInsights.filter(i => i.actionRequired).length}</div>
              <div className="text-sm opacity-90">High priority</div>
            </div>
            <AlertTriangle className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current AI Insights</h3>
        <div className="space-y-4">
          {filteredInsights.map((insight) => {
            const InsightIcon = getInsightIcon(insight.type);
            const CategoryIcon = getCategoryIcon(insight.category);
            
            return (
              <div
                key={insight.id}
                className={`border-2 rounded-lg p-4 ${getInsightColor(insight.type, insight.priority)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <InsightIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <CategoryIcon className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500 capitalize">{insight.category}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 capitalize">{insight.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                    {insight.actionRequired && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{insight.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(insight.timestamp).toLocaleString()}</span>
                  {insight.actionRequired && (
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Predictive Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictiveAnalytics.map((prediction, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{prediction.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  prediction.impact === 'High' ? 'bg-red-100 text-red-800' :
                  prediction.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {prediction.impact} Impact
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{prediction.prediction}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Confidence</span>
                <span className="text-xs font-medium text-gray-900">{prediction.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                />
              </div>
              <div className="bg-blue-50 p-3 rounded text-sm">
                <span className="font-medium text-blue-900">Recommendation: </span>
                <span className="text-blue-800">{prediction.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          AI-Driven Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
              <div className={`flex items-center justify-center text-xs ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-3 w-3 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                {metric.improvement} improvement
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Smart Recommendations
        </h3>
        <div className="space-y-4">
          {smartRecommendations.map((recommendation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    recommendation.effort === 'Low' ? 'bg-green-100 text-green-800' :
                    recommendation.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recommendation.effort} Effort
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium text-green-600">Impact: </span>
                  <span className="text-green-700">{recommendation.impact}</span>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                  Implement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Learning Status */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Learning Status</h3>
            <p className="text-sm text-gray-600 mb-4">
              The AI system is continuously learning from your residential complex data to provide better insights.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Data Processing</span>
                <span className="font-medium">98% Complete</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <Brain className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="text-sm font-medium text-indigo-900">AI Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}