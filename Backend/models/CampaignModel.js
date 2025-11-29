const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: 
  {
     type: String, required: true, trim: true },
  goal: { type: Number, required: true, min: 1 },
  duration: { type: Number, required: true, min: 1, max: 90 },
  location: { type: String, trim: true },
  shortDescription: { type: String, required: true, trim: true, maxlength: 150 },
  fullDescription: { type: String, required: true, trim: true },
  creatorName: { type: String, required: true, trim: true },
  organizationType: {
    type: String,
    required: true,
    enum: ['individual', 'nonprofit', 'business', 'community'],
    default: 'individual',
  },
  image: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  raised: { type: Number, default: 0 },
  backers: { type: Number, default: 0 },
  daysLeft: { type: Number },
}, {
  timestamps: true,
});

campaignSchema.pre('save', function (next) {
  if (this.duration) {
    const endDate = new Date(this.createdAt || Date.now());
    endDate.setDate(endDate.getDate() + this.duration);
    this.daysLeft = Math.max(0, Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)));
  }
  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);