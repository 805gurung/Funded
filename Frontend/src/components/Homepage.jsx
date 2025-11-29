import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import { fetchCampaigns } from '../api/CampaignAPI';
import { Target, Search, MapPin } from 'lucide-react';

const HomePage = () => {
  const [current, setCurrent] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search/filter/sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const calculateProgress = (raised, goal) => (raised / goal) * 100;

  // Filter + sort
  const filteredCampaigns = campaigns
    .filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.creatorName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(c =>
      filterLocation === '' || c.location?.toLowerCase().includes(filterLocation.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'funding':
          return (b.raised / b.goal) - (a.raised / a.goal);
        case 'goal':
          return b.goal - a.goal;
        default:
          return 0;
      }
    })
    .slice(0, 4); 

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Carousel Section */}
        <div className="relative w-full overflow-hidden h-[1000px]">
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {['/hero-image.jpg', '/donation1.jpg', '/change.jpg'].map((img, index) => (
              <div key={index} className="relative w-full h-[1000px] flex-shrink-0">
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Overlay and Content */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white px-4">
                  <h2 className="text-5xl md:text-6xl font-bold mb-6">
                    {index === 0 && "Support Rural Communities"}
                    {index === 1 && "Start Your Campaign Today"}
                    {index === 2 && "Be the Change"}
                  </h2>
                  <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                    {index === 0 && "Join hands to uplift and empower the Himalayan regions."}
                    {index === 1 && "Launch fundraising campaigns for causes you care about."}
                    {index === 2 && "Make a lasting difference by contributing to local projects."}
                  </p>
                  <Link to="/campaign">
                    <button className="text-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 hover:translate-x-4">
                      Donate Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search/Filter/Sort */}
        <div className="bg-white rounded-md shadow-md p-6 max-w-6xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800"
                />
              </div>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="funding">Most Funded</option>
                <option value="goal">Highest Goal</option>
              </select>
            </div>
          </div>
        </div>
    {/* Featured Campaigns */}
        <section className="max-w-6xl mx-auto px-4 py-10 flex-1">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Featured Campaigns
          </h2>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center">No campaigns found</div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {campaign.image ? (
                    <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-40 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">{campaign.title}</h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">{campaign.shortDescription}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>${campaign.raised.toLocaleString()} raised</span>
                        <span>{Math.round(calculateProgress(campaign.raised, campaign.goal))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(calculateProgress(campaign.raised, campaign.goal), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <Link to={`/view/${campaign._id}`}>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        View Campaign
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* Footer */}
        <footer className="bg-gradient-to-l from-gray-900 via-gray-900 to-gray-900 shadow-md p-10">
          <div className="max-w-6xl mx-1 pl-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <p className="text-xl mt-2 text-white">&copy; {new Date().getFullYear()} Himalaya Fund. All rights reserved.</p>
                <p className="text-xl mt-4 text-white">Empowering Himalayan communities through your support.</p>
              </div>
              <div className="flex space-x-6">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-400 transition-colors duration-300 transform hover:scale-110"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;