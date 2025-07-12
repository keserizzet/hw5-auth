const createHttpError = require('create-http-error');
const authService = require('../services/auth');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Access token required');
    }

    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const user = await authService.verifyAccessToken(accessToken);
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate; 