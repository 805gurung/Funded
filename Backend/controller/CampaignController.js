const multer = require('multer');
const path = require('path');
const Campaign = require('../models/CampaignModel');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

exports.createCampaign = [
  upload.single('image'),
  async (req, res) => {
    try {
      const {
        title,
        goal,
        duration,
        location,
        shortDescription,
        fullDescription,
        creatorName,
        organizationType,
      } = req.body;

      if (!title || !goal || !duration || !shortDescription || !fullDescription || !creatorName) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      const newCampaign = new Campaign({
        title,
        goal: parseFloat(goal),
        duration: parseInt(duration),
        location,
        shortDescription,
        fullDescription,
        creatorName,
        organizationType,
        image: req.file ? `/uploads/${req.file.filename}` : null,
      });

      await newCampaign.save();

      res.status(201).json({
        message: 'Campaign created successfully',
        campaign: newCampaign,
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
];

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isActive: true }).select(
      'title creatorName location shortDescription goal raised backers daysLeft organizationType createdAt image'
    );
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    console.log('Fetching campaign with ID:', campaignId);
    
    if (!campaignId) {
      return res.status(400).json({ message: 'Campaign ID is required' });
    }
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ message: 'Invalid campaign ID format' });
    }
    
    const campaign = await Campaign.findById(campaignId);
    
    if (!campaign) {
      console.log('Campaign not found:', campaignId);
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    console.log('Campaign found:', campaign.title);
    res.status(200).json(campaign);
    
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//donate in campaign

exports.donateToCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { amount } = req.body;
    
    console.log('Donation request:', { campaignId, amount });
    
    if (!campaignId || !amount) {
      return res.status(400).json({ message: 'Campaign ID and amount are required' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ message: 'Donation amount must be greater than 0' });
    }
    
    const campaign = await Campaign.findById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Update campaign
    campaign.raised += parseFloat(amount);
    campaign.backers += 1;
    
    await campaign.save();
    
    console.log('Donation successful:', { raised: campaign.raised, backers: campaign.backers });
    
    res.status(200).json({
      message: 'Donation successful',
      raised: campaign.raised,
      backers: campaign.backers
    });
    
  } catch (error) {
    console.error('Error processing donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//delete campaigns

exports.deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    // Validate campaignId
    if (!campaignId) {
      return res.status(400).json({
        message: 'Campaign ID is required'
      });
    }

    // Find and delete the campaign
    const campaign = await Campaign.findByIdAndDelete(campaignId);

    // Check if campaign exists
    if (!campaign) {
      return res.status(404).json({
        message: 'Campaign not found'
      });
    }

    // Optional: Delete related data if needed
    // await CampaignAnalytics.deleteMany({ campaignId });

    res.status(200).json({
      message: 'Campaign deleted successfully',
      campaignId: campaignId
    });

  } catch (error) {
    console.error('Error deleting campaign:', error);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid campaign ID format'
      });
    }

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const mongoose = require('mongoose')
