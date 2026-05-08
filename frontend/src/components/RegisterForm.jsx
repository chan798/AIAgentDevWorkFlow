import { useState } from 'react';
import { register } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FieldError({ message }) {
  if (!message) return null;
  return <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px' }}>{message}</p>;
}

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!EMAIL_REGEX.test(form.email)) next.email = '유효한 이메일 형식이 아닙니다.';
    if (form.password.length < 8) next.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    if (form.password !== form.confirm) next.confirm = '비밀번호가 일치하지 않습니다.';
    return next;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register({ email: form.email, password: form.password });
      onSuccess?.();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <h2 style={{ margin: 0 }}>회원가입</h2>

      <div>
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          disabled={loading}
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
        />
        <FieldError message={errors.email} />
      </div>

      <div>
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="8자 이상 입력"
          disabled={loading}
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
        />
        <FieldError message={errors.password} />
      </div>

      <div>
        <label htmlFor="confirm">비밀번호 확인</label>
        <input
          id="confirm"
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          placeholder="비밀번호 재입력"
          disabled={loading}
          style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
        />
        <FieldError message={errors.confirm} />
      </div>

      {apiError && (
        <p style={{ color: '#ef4444', background: '#fef2f2', padding: '8px 12px', borderRadius: '4px', margin: 0 }}>
          {apiError}
        </p>
      )}

      <button type="submit" disabled={loading} style={{ padding: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? '처리 중...' : '회원가입'}
      </button>
    </form>
  );
}
