const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * 이메일 인증 링크 발송
 * @param {string} toEmail - 수신자 이메일
 * @param {string} token - 인증 UUID 토큰
 */
exports.sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"서비스 팀" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: '이메일 인증을 완료해 주세요',
    html: `
      <h2>이메일 인증</h2>
      <p>아래 버튼을 클릭하여 이메일 인증을 완료해 주세요.</p>
      <p>링크는 <strong>24시간</strong> 동안 유효합니다.</p>
      <a
        href="${verifyUrl}"
        style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;border-radius:6px;text-decoration:none;"
      >
        이메일 인증하기
      </a>
      <p>버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요.</p>
      <p>${verifyUrl}</p>
    `,
  });
};
