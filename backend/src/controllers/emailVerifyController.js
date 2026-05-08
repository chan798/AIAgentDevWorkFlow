const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const EmailToken = require('../models/EmailToken');
const { sendVerificationEmail } = require('../services/emailService');

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24시간

/**
 * 회원가입 직후 인증 메일 발송
 */
exports.sendVerification = async (userId, email) => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await EmailToken.create({ userId, token, expiresAt });
  await sendVerificationEmail(email, token);
};

/**
 * GET /api/auth/verify-email?token=<uuid>
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: '토큰이 누락되었습니다.' });
    }

    const emailToken = await EmailToken.findOne({ token, used: false });

    if (!emailToken) {
      return res.status(400).json({ message: '유효하지 않거나 만료된 토큰입니다.' });
    }

    if (emailToken.expiresAt < new Date()) {
      return res.status(400).json({ message: '만료된 인증 링크입니다.' });
    }

    await Promise.all([
      User.findByIdAndUpdate(emailToken.userId, { status: 'verified' }),
      EmailToken.findByIdAndUpdate(emailToken._id, { used: true }),
    ]);

    return res.status(200).json({
      message: '이메일 인증이 완료되었습니다.',
      userId: emailToken.userId,
    });
  } catch (error) {
    console.error('[verifyEmail]', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
