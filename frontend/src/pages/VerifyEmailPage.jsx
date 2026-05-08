import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const STATUS = { LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [status, setStatus] = useState(STATUS.LOADING);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      setStatus(STATUS.ERROR);
      setErrorMsg('인증 토큰이 누락되었습니다.');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/verify-email?token=${token}`);
        const json = await res.json();

        if (!res.ok) {
          setStatus(STATUS.ERROR);
          setErrorMsg(json.message || '인증에 실패했습니다.');
          return;
        }

        login({
          accessToken: json.accessToken,
          userId: json.userId,
          email: json.email,
        });

        setStatus(STATUS.SUCCESS);
        setTimeout(() => navigate('/'), 1500);
      } catch {
        setStatus(STATUS.ERROR);
        setErrorMsg('서버와 통신 중 오류가 발생했습니다.');
      }
    })();
  }, [login, navigate]);

  if (status === STATUS.LOADING) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p>이메일 인증 처리 중...</p>
      </div>
    );
  }

  if (status === STATUS.SUCCESS) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h2>인증 완료!</h2>
        <p>자동 로그인 처리 중입니다. 잠시만 기다려 주세요.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <h2>인증 실패</h2>
      <p style={{ color: '#ef4444' }}>{errorMsg}</p>
      <p>인증 링크가 만료되었거나 유효하지 않습니다.</p>
      <button
        onClick={() => navigate('/register')}
        style={{ marginTop: '16px', padding: '10px 20px', cursor: 'pointer' }}
      >
        회원가입으로 돌아가기
      </button>
    </div>
  );
}
