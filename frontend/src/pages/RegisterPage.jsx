import { useState } from 'react';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>인증 메일을 확인하세요</h2>
        <p>입력하신 이메일로 인증 링크를 발송했습니다.</p>
        <p>메일함을 확인하여 인증을 완료해 주세요.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
      <RegisterForm onSuccess={() => setDone(true)} />
    </div>
  );
}
