import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Bell, MessageSquare, Calendar, Users, Plus, Search, ListFilter as Filter, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Clock, Eye, ThumbsUp, MessageCircle } from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const { notices, complaints, addNotice, addComplaint, updateComplaint } = useApp();
  const [activeTab, setActiveTab] = useState('notices');
  const [showNewNotice, setShowNewNotice] = useState(false);
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const tabs = [
    { id: 'notices', name: 'Notice Board', icon: Bell, count: notices.filter(n => n.isActive).length },
    { id: 'complaints', name: 'Complaints', icon: MessageSquare, count: complaints.filter(c => c.status !== 'closed').length },
    { id: 'events', name: 'Events', icon: Calendar, count: 3 },
    { id: 'polls', name: 'Polls & Surveys', icon: Users, count: 2 }
  ];

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && notice.isActive) ||
                         (filterStatus === 'expired' && !notice.isActive);
    return matchesSearch && matchesFilter;
  });

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    addNotice({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      type: formData.get('type') as any,
      priority: formData.get('priority') as any,
      publishedBy: user?.name || '',
      publishedAt: new Date().toISOString(),
      targetAudience: formData.get('audience') as any,
      isActive: true
    });

    setShowNewNotice(false);
  };

  const handleNewComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    addComplaint({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as any,
      priority: formData.get('priority') as any,
      status: 'open',
      reportedBy: user?.name || '',
      reporterApartment: user?.apartmentNo || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setShowNewComplaint(false);
  };

  const renderNotices = () => (
    <div className="space-y-4">
      {filteredNotices.map((notice) => (
        <div key={notice.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-medium text-gray-900">{notice.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  notice.type === 'emergency' ? 'bg-red-100 text-red-800' :
                  notice.type === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  notice.type === 'event' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {notice.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  notice.priority === 'high' ? 'bg-red-100 text-red-800' :
                  notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {notice.priority} priority
                </span>
              </div>
              <p className="text-gray-600 mb-3">{notice.content}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {notice.publishedBy}</span>
                <span>{new Date(notice.publishedAt).toLocaleDateString()}</span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {notice.readBy?.length || 0} views
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
          {notice.expiresAt && (
            <div className="text-sm text-gray-500 border-t pt-2">
              Expires: {new Date(notice.expiresAt).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-4">
      {filteredComplaints.map((complaint) => (
        <div key={complaint.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                  {complaint.status.replace('-', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{complaint.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {complaint.reportedBy} ({complaint.reporterApartment})</span>
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                <span className="capitalize">{complaint.category}</span>
                {complaint.assignedTo && <span>Assigned to {complaint.assignedTo}</span>}
              </div>
            </div>
            {(user?.role === 'admin' || user?.role === 'facility-manager') && complaint.status === 'open' && (
              <button
                onClick={() => updateComplaint(complaint.id, { status: 'in-progress', assignedTo: user.name })}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Assign to Me
              </button>
            )}
          </div>
          
          {complaint.comments && complaint.comments.length > 0 && (
            <div className="border-t pt-3 mt-3">
              <div className="space-y-2">
                {complaint.comments.slice(-2).map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-4">
      {[
        {
          id: '1',
          title: 'Community Holi Celebration',
          date: '2025-03-15',
          time: '16:00',
          location: 'Social Hall',
          description: 'Join us for the annual Holi celebration with colors, music, and traditional food.',
          attendees: 45,
          maxAttendees: 100
        },
        {
          id: '2',
          title: 'Yoga Session',
          date: '2025-01-25',
          time: '07:00',
          location: 'Rooftop Garden',
          description: 'Weekly yoga session for all residents. Bring your own mat.',
          attendees: 12,
          maxAttendees: 20
        },
        {
          id: '3',
          title: 'Building Maintenance Meeting',
          date: '2025-01-30',
          time: '19:00',
          location: 'Social Hall',
          description: 'Monthly meeting to discuss building maintenance and upcoming projects.',
          attendees: 28,
          maxAttendees: 50
        }
      ].map((event) => (
        <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-3">{event.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </span>
                <span>{event.location}</span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {event.attendees}/{event.maxAttendees} attending
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
              Join Event
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPolls = () => (
    <div className="space-y-4">
      {[
        {
          id: '1',
          title: 'Preferred timing for gym maintenance',
          description: 'When would be the best time to schedule monthly gym equipment maintenance?',
          options: [
            { text: 'Early morning (6-8 AM)', votes: 15 },
            { text: 'Afternoon (2-4 PM)', votes: 8 },
            { text: 'Evening (8-10 PM)', votes: 22 },
            { text: 'Weekend mornings', votes: 12 }
          ],
          totalVotes: 57,
          endsAt: '2025-01-25',
          hasVoted: false
        },
        {
          id: '2',
          title: 'New amenity preference',
          description: 'Which new amenity would you like to see added to our community?',
          options: [
            { text: 'Spa & Wellness Center', votes: 28 },
            { text: 'Co-working Space', votes: 19 },
            { text: 'Pet Park', votes: 24 },
            { text: 'Mini Golf Course', votes: 11 }
          ],
          totalVotes: 82,
          endsAt: '2025-02-01',
          hasVoted: true
        }
      ].map((poll) => (
        <div key={poll.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{poll.title}</h3>
            <p className="text-gray-600 mb-3">{poll.description}</p>
            <div className="text-sm text-gray-500">
              {poll.totalVotes} votes • Ends {new Date(poll.endsAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="space-y-3">
            {poll.options.map((option, index) => {
              const percentage = Math.round((option.votes / poll.totalVotes) * 100);
              return (
                <div key={index} className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{option.text}</span>
                    <span className="text-sm text-gray-500">{option.votes} votes ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {!poll.hasVoted && (
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
              Vote Now
            </button>
          )}
          
          {poll.hasVoted && (
            <div className="mt-4 flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              You have voted in this poll
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Community Hub</h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay connected with your community through notices, events, and discussions.
          </p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'notices' && (user?.role === 'admin' || user?.role === 'facility-manager') && (
            <button
              onClick={() => setShowNewNotice(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Notice
            </button>
          )}
          {activeTab === 'complaints' && (
            <button
              onClick={() => setShowNewComplaint(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Complaint
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {activeTab === 'notices' && (
                <>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </>
              )}
              {activeTab === 'complaints' && (
                <>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'notices' && renderNotices()}
        {activeTab === 'complaints' && renderComplaints()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'polls' && renderPolls()}
      </div>

      {/* New Notice Modal */}
      {showNewNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Notice</h3>
            <form onSubmit={handleNewNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select
                  name="audience"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Residents</option>
                  <option value="residents">Residents Only</option>
                  <option value="staff">Staff Only</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewNotice(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {showNewComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submit New Complaint</h3>
            <form onSubmit={handleNewComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                    <option value="noise">Noise</option>
                    <option value="cleanliness">Cleanliness</option>
                    <option value="amenity">Amenity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewComplaint(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}