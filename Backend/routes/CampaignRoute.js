const express = require('express');
const router = express.Router();
const { createCampaign, getAllCampaigns, deleteCampaign, getCampaignById, donateToCampaign } = require('../controller/CampaignController');

router.post('/campaigns', createCampaign);
router.get('/campaigns', getAllCampaigns);
router.get('/campaigns/:campaignId', getCampaignById )
router.get('/campaigns/:campaignId/donate', donateToCampaign)
router.delete('/campaigns/:campaignId', deleteCampaign)


module.exports = router;