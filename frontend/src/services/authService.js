const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * 회원가입 API 호출
 * @param {{ email: string, password: string }} data
 */
export const register = async ({ email, password }) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();

  if (!res.ok) {
    const message =
      json.errors?.[0]?.msg || json.message || '회원가입에 실패했습니다.';
    throw new Error(message);
  }

  return json;
};
