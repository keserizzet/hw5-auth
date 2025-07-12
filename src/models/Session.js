const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  accessToken: {
    type: String,
    required: [true, 'Access token is required']
  },
  refreshToken: {
    type: String,
    required: [true, 'Refresh token is required']
  },
  accessTokenValidUntil: {
    type: Date,
    required: [true, 'Access token valid until is required']
  },
  refreshTokenValidUntil: {
    type: Date,
    required: [true, 'Refresh token valid until is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema); 