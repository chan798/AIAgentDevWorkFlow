const ms = require('ms');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const RefreshToken = require('../models/RefreshToken');

const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '30d';

/**
 * 이메일 인증 완료 후 토큰 쌍 발급
 * @param {{ _id: string, email: string, role: string }} user
 * @returns {{ accessToken: string, refreshToken: string }}
 */
exports.issueTokens = async (user) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role || 'user',
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ userId: payload.userId });

  const expiresAt = new Date(Date.now() + ms(REFRESH_EXPIRES));
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
};

/**
 * Refresh Token 폐기 (로그아웃)
 * @param {string} token
 */
exports.revokeRefreshToken = async (token) => {
  await RefreshToken.findOneAndUpdate({ token }, { revoked: true });
};
