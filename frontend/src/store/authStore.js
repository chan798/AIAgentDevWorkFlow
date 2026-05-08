import { create } from 'zustand';

const TOKEN_KEY = 'accessToken';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem(TOKEN_KEY) || null,
  isLoggedIn: !!localStorage.getItem(TOKEN_KEY),

  /**
   * 로그인 성공 시 토큰 및 유저 정보 저장
   * @param {{ accessToken: string, userId: string, email: string }} payload
   */
  login: ({ accessToken, userId, email }) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    set({ accessToken, user: { userId, email }, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ accessToken: null, user: null, isLoggedIn: false });
  },
}));
