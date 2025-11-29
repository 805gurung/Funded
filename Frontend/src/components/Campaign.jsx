import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Target, Users, Heart, Share2, Clock, DollarSign, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { fetchCampaigns, deleteCampaign } from '../api/CampaignAPI';

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterLocation, setFilterLocation] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(null); // Track which campaign is being deleted
  const [deleteError, setDeleteError] = useState(null); // Track deletion errors
  const [deleteSuccess, setDeleteSuccess] = useState(null); // Track successful deletions

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const data = await fetchCampaigns();
        setCampaigns(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load campaigns');
        setLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  // Handle campaign deletion
  const handleDeleteCampaign = async (campaignId) => {
    // Validate campaignId
    if (!campaignId) {
      console.error('Campaign ID is undefined');
      setDeleteError('Invalid campaign ID');
      return;
    }

    // Confirm deletion
    const confirmed = window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.');

    if (!confirmed) return;

    try {
      setDeletingCampaign(campaignId); // Set loading state for this specific campaign
      setDeleteError(null);

      const result = await deleteCampaign(campaignId);
      console.log(result.message); // "Campaign deleted successfully"

      // Update the campaigns list by removing the deleted campaign
      setCampaigns(prevCampaigns =>
        prevCampaigns.filter(campaign => campaign._id !== campaignId)
      );

      // Show success message
      setDeleteSuccess('Campaign deleted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);

    } catch (error) {
      console.error('Failed to delete campaign:', error);
      setDeleteError(error.message || 'Failed to delete campaign. Please try again.');

      // Clear error message after 5 seconds
      setTimeout(() => {
        setDeleteError(null);
      }, 5000);
    } finally {
      setDeletingCampaign(null); // Clear loading state
    }
  };

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter(campaign =>
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(campaign =>
      filterLocation === '' || campaign.location.toLowerCase().includes(filterLocation.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'funding':
          return (b.raised / b.goal) - (a.raised / a.goal);
        case 'ending':
          return a.daysLeft - b.daysLeft;
        case 'goal':
          return b.goal - a.goal;
        default:
          return 0;
      }
    });

  const calculateProgress = (raised, goal) => (raised / goal) * 100;

  const getOrganizationIcon = (type) => {
    switch (type) {
      case 'nonprofit':
        return '🏛️';
      case 'business':
        return '🏢';
      case 'community':
        return '👥';
      default:
        return '👤';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          {deleteSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-green-800 font-medium">{deleteSuccess}</p>
              </div>
              <button onClick={() => setDeleteSuccess(null)} className="text-green-600 hover:text-green-800">
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}

          {/* Error Message */}
          {deleteError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <p className="text-red-800 font-medium">{deleteError}</p>
              </div>
              <button onClick={() => setDeleteError(null)} className="text-red-600 hover:text-red-800">
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">
              Discover Campaigns
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Support meaningful projects across Nepal and make a difference
            </p>
            <Link
              to="/createcampaign"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start a Campaign
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search campaigns, creators, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="funding">Most Funded</option>
                  <option value="ending">Ending Soon</option>
                  <option value="goal">Highest Goal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCampaigns.length} of {campaigns.length} campaigns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div>
                  {campaign.image ? (
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-48 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Target className="w-8 h-8" />
                        </div>
                        <p className="text-sm">Campaign Image</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">{getOrganizationIcon(campaign.organizationType)}</span>
                      <span>{campaign.creatorName}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
                    {campaign.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{campaign.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {campaign.shortDescription}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>${campaign.raised.toLocaleString()} raised</span>
                      <span>{Math.round(calculateProgress(campaign.raised, campaign.goal))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(calculateProgress(campaign.raised, campaign.goal), 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Goal: ${campaign.goal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      to={`/view/${campaign._id}`}
                      className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                    >
                      View Campaign
                    </Link>
                    <button
                      onClick={() => handleDeleteCampaign(campaign._id)}
                      disabled={deletingCampaign === campaign._id}
                      className="py-2 px-4 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      title="Delete Campaign"
                    >
                      {deletingCampaign === campaign._id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No campaigns found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find more campaigns.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterLocation('');
                  setSortBy('recent');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}