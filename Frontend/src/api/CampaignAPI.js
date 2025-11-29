const BACKEND_URL = 'http://localhost:5000/api'; // Fixed to include /api

// Function to create a new campaign
export const createCampaign = async (campaignData, imageFile) => {
  try {
    const formData = new FormData();
    Object.keys(campaignData).forEach((key) => {
      formData.append(key, campaignData[key]);
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${BACKEND_URL}/campaigns`, {
      method: 'POST',
      body: formData,
    });

    console.log('Create campaign response status:', response.status);
    if (!response.ok) {
      const text = await response.text();
      console.log('Create campaign response text:', text);
      throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in createCampaign API:', error);
    throw error;
  }
};

// Function to fetch all campaigns
export const fetchCampaigns = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/campaigns`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Fetch campaigns response status:', response.status);
    if (!response.ok) {
      const text = await response.text();
      console.log('Fetch campaigns response text:', text);
      throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchCampaigns API:', error);
    throw error;
  }
};

//delete campaign
export const deleteCampaign = async (campaignId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/campaigns/${campaignId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Delete campaign response status:', response.status);
    if (!response.ok) {
      const text = await response.text();
      console.log('Delete campaign response text:', text);
      throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in deleteCampaign API:', error);
    throw error;
  }
};