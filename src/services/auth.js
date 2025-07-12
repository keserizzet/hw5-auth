const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createHttpError = require('create-http-error');
const User = require('../models/User');
const Session = require('../models/Session');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

const register = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  // Return user without password
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

const login = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  // Delete existing sessions for this user
  await Session.deleteMany({ userId: user._id });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Calculate token expiration times
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Create session
  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil
  });

  await session.save();

  return { accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find session
    const session = await Session.findOne({ 
      userId: decoded.userId,
      refreshToken: refreshToken
    });

    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    // Check if refresh token is expired
    if (new Date() > session.refreshTokenValidUntil) {
      await Session.deleteOne({ _id: session._id });
      throw createHttpError(401, 'Refresh token expired');
    }

    // Delete existing session
    await Session.deleteOne({ _id: session._id });

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    // Calculate new token expiration times
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create new session
    const newSession = new Session({
      userId: decoded.userId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil
    });

    await newSession.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Invalid refresh token');
    }
    throw error;
  }
};

const logout = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Delete session
    await Session.deleteOne({ 
      userId: decoded.userId,
      refreshToken: refreshToken
    });
  } catch (error) {
    // If token is invalid, we still want to return success
    // as the user is effectively logged out
  }
};

const verifyAccessToken = async (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    
    // Find session
    const session = await Session.findOne({ 
      userId: decoded.userId,
      accessToken: accessToken
    });

    if (!session) {
      throw createHttpError(401, 'Access token expired');
    }

    // Check if access token is expired
    if (new Date() > session.accessTokenValidUntil) {
      await Session.deleteOne({ _id: session._id });
      throw createHttpError(401, 'Access token expired');
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    return user;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Access token expired');
    }
    throw error;
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyAccessToken
}; 