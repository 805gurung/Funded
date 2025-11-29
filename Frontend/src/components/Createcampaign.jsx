import React, { useState } from 'react';
import { Upload, DollarSign, Calendar, MapPin, Target, FileText, Tag, Heart, Share2, Users, Clock, ArrowRight, CheckCircle, X } from 'lucide-react';
import Navbar from './Navbar/Navbar';
import { createCampaign } from '../api/CampaignAPI'; 

export default function Createcampaign() {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPreview, setShowPreview] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        goal: '',
        duration: '',
        location: '',
        shortDescription: '',
        fullDescription: '',
        creatorName: '',
        organizationType: 'individual',
        image: null
    });

    const categories = [];

    // Supported image formats
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    const maxFileSize = 5 * 1024 * 1024; 

    const validateImageFile = (file) => {
        if (!file) return { valid: false, error: 'No file selected' };
        
        // Check file type
        if (!supportedFormats.includes(file.type)) {
            return { 
                valid: false, 
                error: 'Invalid file format. Please upload PNG, JPG, JPEG, GIF, WebP, or BMP files only.' 
            };
        }
        
        // Check file size
        if (file.size > maxFileSize) {
            return { 
                valid: false, 
                error: 'File size too large. Please upload an image smaller than 5MB.' 
            };
        }
        
        return { valid: true };
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            if (file) {
                const validation = validateImageFile(file);
                if (validation.valid) {
                    setFormData(prev => ({
                        ...prev,
                        image: file
                    }));
                    
                    // Create preview URL
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setImagePreview(e.target.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Show error and clear the input
                    showErrorAlert(validation.error);
                    e.target.value = '';
                    setFormData(prev => ({
                        ...prev,
                        image: null
                    }));
                    setImagePreview(null);
                }
            } else {
                setFormData(prev => ({
                    ...prev,
                    image: null
                }));
                setImagePreview(null);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
        // Clear the file input
        const fileInput = document.querySelector('input[name="image"]');
        if (fileInput) fileInput.value = '';
    };

    const handleRewardChange = (index, field, value) => {
        const newRewards = [...formData.rewards];
        newRewards[index][field] = value;
        setFormData(prev => ({
            ...prev,
            rewards: newRewards
        }));
    };

    const addReward = () => {
        setFormData(prev => ({
            ...prev,
            rewards: [...prev.rewards, { amount: '', title: '', description: '' }]
        }));
    };

    const removeReward = (index) => {
        const newRewards = formData.rewards.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            rewards: newRewards
        }));
    };

    const showSweetAlert = () => {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl';
        modal.innerHTML = `
            <div class="mb-4">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
                <p class="text-gray-600 mb-6">Your campaign has been created successfully and is now live!</p>
                <button id="sweetalert-ok" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    OK
                </button>
            </div>
        `;
        
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        const okButton = document.getElementById('sweetalert-ok');
        okButton.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
            window.location.href = '/';
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
                window.location.href = '/';
            }
        });
    };

    const showErrorAlert = (message) => {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl';
        modal.innerHTML = `
            <div class="mb-4">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Error!</h2>
                <p class="text-gray-600 mb-6">${message}</p>
                <button id="error-ok" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    OK
                </button>
            </div>
        `;
        
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        const okButton = document.getElementById('error-ok');
        okButton.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.title || !formData.goal || !formData.duration || !formData.shortDescription || !formData.fullDescription || !formData.creatorName) {
            showErrorAlert('Please fill in all required fields before submitting.');
            return;
        }

        try {
            // Prepare data for submission
            const campaignData = {
                title: formData.title,
                goal: formData.goal,
                duration: formData.duration,
                location: formData.location,
                shortDescription: formData.shortDescription,
                fullDescription: formData.fullDescription,
                creatorName: formData.creatorName,
                organizationType: formData.organizationType,
            };

            // Call API to create campaign
            await createCampaign(campaignData, formData.image);

            // Show success modal
            showSweetAlert();
        } catch (error) {
            showErrorAlert(error.message || 'Failed to create campaign. Please try again.');
        }
    };

    const calculateEndDate = () => {
        if (formData.duration) {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + parseInt(formData.duration));
            return endDate.toLocaleDateString();
        }
        return '';
    };

    const renderBasicInfo = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Basic Information</h2>

            <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Campaign Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Give your campaign a compelling title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="City, District, Nepal"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Funding Goal (USD) *</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="number"
                            name="goal"
                            value={formData.goal}
                            onChange={handleInputChange}
                            min={1}
                            placeholder="10000"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Campaign Duration (days) *</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            placeholder="30"
                            min={1}
                            max="90"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Maximum 90 days</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Short Description *</label>
                <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description of your campaign (max 150 characters)"
                    maxLength="150"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <p className="text-sm text-gray-500 mt-1">{formData.shortDescription.length}/150 characters</p>
            </div>
        </div>
    );

    const renderDetailedInfo = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Campaign Details</h2>

            <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Campaign Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                    {imagePreview ? (
                        <div className="relative">
                            <img 
                                src={imagePreview} 
                                alt="Campaign preview" 
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                {formData.image?.name}
                            </div>
                        </div>                    ) : (
                        <div className="p-8 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <div className="text-sm text-gray-600">
                                <label className="cursor-pointer">
                                    <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                                        Upload campaign image
                                    </span>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleInputChange}
                                        className="sr-only"
                                        accept=".png,.jpg,.jpeg,.gif,.webp,.bmp,image/png,image/jpeg,image/jpg,image/gif,image/webp,image/bmp"
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG, GIF, WebP, BMP up to 5MB</p>
                        </div>
                    )}
                </div>
                {formData.image && (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>File: {formData.image.name}</p>
                        <p>Size: {(formData.image.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p>Type: {formData.image.type}</p>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Full Description *</label>
                <textarea
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleInputChange}
                    placeholder="Tell your story in detail. Explain what you're raising money for, why it's important, and how the funds will be used."
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Creator Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Creator Name *</label>
                        <input
                            type="text"
                            name="creatorName"
                            value={formData.creatorName}
                            onChange={handleInputChange}
                            placeholder="Your name or organization name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Organization Type</label>
                        <select
                            name="organizationType"
                            value={formData.organizationType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="individual">Individual</option>
                            <option value="nonprofit">Non-profit Organization</option>
                            <option value="business">Business</option>
                            <option value="community">Community Group</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRewards = () => null;

    const renderPreview = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-800 text-white p-4">
                    <h2 className="text-xl font-bold">Campaign Preview</h2>
                    <p className="text-blue-200">This is how your campaign will appear to supporters</p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg h-64 flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Campaign" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-white">
                                        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Target className="w-12 h-12" />
                                        </div>
                                        <p className="text-lg">Campaign Image</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-blue-800 mb-4">{formData.title || 'Campaign Title'}</h1>

                                <div className="flex items-center text-gray-600 mb-6 space-x-4">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        <span>by {formData.creatorName || 'Creator Name'}</span>
                                    </div>
                                    {formData.location && (
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span>{formData.location}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="prose max-w-none text-gray-700">
                                    <h3 className="text-xl font-semibold text-blue-800 mb-3">About This Campaign</h3>
                                    <p>{formData.shortDescription || 'Campaign short description will appear here...'}</p>
                                    <div className="mt-4">
                                        <p>{formData.fullDescription || 'Full campaign description will appear here...'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="mb-4">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-3xl font-bold text-blue-800">$0</span>
                                        <span className="text-gray-600">of ${formData.goal || '0'}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                        <div className="bg-blue-600 h-3 rounded-full w-0"></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                                        <span>0% funded</span>
                                    </div>
                                </div>

                                <div className="flex justify-center mb-6">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                                            <span className="text-2xl font-bold text-blue-800">{formData.duration || '0'}</span>
                                        </div>
                                        <span className="text-sm text-gray-600">days left</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Back This Campaign
                                </button>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-blue-800 mb-4">Campaign Creator</h3>
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">{formData.creatorName || 'Creator Name'}</h4>
                                        <p className="text-sm text-gray-600 capitalize">{formData.organizationType.replace('_', ' ')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (showPreview) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            ← Back to Edit
                        </button>
                    </div>
                    {renderPreview()}
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            {[1, 2].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-300 text-gray-600'
                                        }`}>
                                        {step}
                                    </div>
                                    {step < 2 && (
                                        <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-blue-800 mb-2">
                                {currentStep === 1 && 'Basic Information'}
                                {currentStep === 2 && 'Campaign Details & Launch'}
                            </h1>
                            <p className="text-gray-600">Step {currentStep} of 2</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        {currentStep === 1 && renderBasicInfo()}
                        {currentStep === 2 && renderDetailedInfo()}
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                            disabled={currentStep === 1}
                            className={`px-6 py-3 rounded-lg transition-colors ${currentStep === 1
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-600 text-white hover:bg-gray-700'
                                }`}
                        >
                            Previous
                        </button>

                        <div className="flex space-x-4">
                            {currentStep < 2 ? (
                                <button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Launch Campaign
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}