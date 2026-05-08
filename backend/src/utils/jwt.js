const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '30d';

/**
 * Access Token 발급
 * @param {{ userId: string, email: string, role: string }} payload
 */
exports.signAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });

/**
 * Refresh Token 발급
 * @param {{ userId: string }} payload
 */
exports.signRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

exports.verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);

exports.verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);
