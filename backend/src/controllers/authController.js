const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ email, passwordHash });

    return res.status(201).json({
      message: '회원가입이 완료되었습니다. 인증 메일을 확인해 주세요.',
      userId: user._id,
    });
  } catch (error) {
    console.error('[register]', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
