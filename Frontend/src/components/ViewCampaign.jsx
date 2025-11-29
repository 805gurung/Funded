// src/pages/ViewCampaign.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Target, MapPin, User, Calendar, CheckCircle, AlertCircle } from "lucide-react";

// Mock data for fallback
const mockCampaignData = {
  _id: '1',
  title: 'Clean Water Initiative',
  description: 'This comprehensive project aims to provide clean and safe drinking water to remote Himalayan villages. We will install water filtration systems, build protected water sources, and educate communities about water safety and hygiene practices. The initiative will benefit over 500 families in the region.',
  shortDescription: 'Providing clean drinking water to remote Himalayan villages',
  image: null,
  raised: 15000,
  goal: 25000,
  location: 'Kathmandu',
  creatorName: 'Green Earth Foundation',
  createdAt: new Date().toISOString(),
};

const ViewCampaign = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donating, setDonating] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationError, setDonationError] = useState(null);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/campaigns/${id}`);
        
        if (!res.ok) {
          // If API fails, use mock data
          console.warn('API failed, using mock data');
          setCampaign(mockCampaignData);
          setError('Unable to connect to server. Showing sample data.');
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        setCampaign(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching campaign:', err);
        // Fallback to mock data
        setCampaign(mockCampaignData);
        setError('Unable to connect to server. Showing sample data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaignDetails();
  }, [id]);

  const calculateProgress = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const isGoalReached = () => {
    return campaign && campaign.raised >= campaign.goal;
  };

  const getRemainingAmount = () => {
    if (!campaign) return 0;
    return Math.max(campaign.goal - campaign.raised, 0);
  };

  const handleDonate = async () => {
    // Validation
    if (!donationAmount || donationAmount <= 0) {
      setDonationError('Please enter a valid donation amount');
      return;
    }

    const amount = parseFloat(donationAmount);

    // Check if goal is already reached
    if (isGoalReached()) {
      setDonationError('This campaign has already reached its goal!');
      return;
    }

    // Check if donation exceeds remaining amount
    const remaining = getRemainingAmount();
    if (amount > remaining) {
      setDonationError(`This campaign only needs $${remaining.toLocaleString()} more to reach its goal. Please adjust your donation amount.`);
      return;
    }

    try {
      setDonating(true);
      setDonationError(null);

      // Make API call to donate
      const response = await fetch(`http://localhost:5000/api/campaigns/${id}/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process donation');
      }

      const updatedCampaign = await response.json();

      // Update campaign state with new raised amount
      setCampaign(updatedCampaign);
      setDonationSuccess(true);
      setDonationAmount('');

      // Clear success message after 5 seconds
      setTimeout(() => {
        setDonationSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('Donation error:', err);
      setDonationError(err.message || 'Failed to process donation. Please try again.');
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-700 mb-4">Campaign not found.</p>
          <Link to="/">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(campaign.raised, campaign.goal);
  const goalReached = isGoalReached();
  const remainingAmount = getRemainingAmount();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <Link to="/campaign" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Campaigns
        </Link>

        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {donationSuccess && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Thank you for your donation! Your contribution has been recorded successfully.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Goal Reached Banner */}
        {goalReached && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-blue-400 mr-3" />
              <div>
                <p className="text-lg font-semibold text-blue-800">
                  🎉 Campaign Goal Reached!
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  This campaign has successfully reached its funding goal. Thank you to all supporters!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Campaign Image */}
              {campaign.image ? (
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-96 flex items-center justify-center">
                  <Target className="w-24 h-24 text-white opacity-50" />
                </div>
              )}

              {/* Campaign Details */}
              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {campaign.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                  {campaign.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{campaign.location}</span>
                    </div>
                  )}
                  {campaign.creatorName && (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>by {campaign.creatorName}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-3xl font-bold text-blue-600">
                      ${campaign.raised?.toLocaleString() || 0}
                    </span>
                    <span className="text-lg text-gray-600">
                      raised of ${campaign.goal?.toLocaleString()} goal
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        goalReached ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {Math.round(progress)}% funded
                    </p>
                    {!goalReached && (
                      <p className="text-sm font-medium text-blue-600">
                        ${remainingAmount.toLocaleString()} remaining
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    About This Campaign
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {campaign.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Donation Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-lg p-6 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {goalReached ? 'Goal Reached!' : 'Support This Campaign'}
              </h3>
              
              {!goalReached ? (
                <>
                  {/* Donation Error */}
                  {donationError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{donationError}</p>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donation Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="1"
                        max={remainingAmount}
                        value={donationAmount}
                        onChange={(e) => {
                          setDonationAmount(e.target.value);
                          setDonationError(null);
                        }}
                        placeholder="Enter amount"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={donating}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: ${remainingAmount.toLocaleString()}
                    </p>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[10, 25, 50, 100, 250, 500]
                      .filter(amount => amount <= remainingAmount)
                      .map((amount) => (
                        <button
                          key={amount}
                          onClick={() => {
                            setDonationAmount(amount.toString());
                            setDonationError(null);
                          }}
                          className="py-2 px-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={donating}
                        >
                          ${amount}
                        </button>
                      ))}
                  </div>

                  <button
                    onClick={handleDonate}
                    disabled={donating || !donationAmount}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {donating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Donate Now'
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Your donation is secure and will go directly to this campaign
                  </p>
                </>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    This campaign has reached its goal!
                  </p>
                  <p className="text-sm text-gray-600">
                    Thank you to all supporters who made this possible.
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal</span>
                    <span className="font-semibold">${campaign.goal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Raised</span>
                    <span className={`font-semibold ${goalReached ? 'text-green-600' : 'text-blue-600'}`}>
                      ${campaign.raised?.toLocaleString() || 0}
                    </span>
                  </div>
                  {!goalReached && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining</span>
                      <span className="font-semibold">
                        ${remainingAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCampaign;