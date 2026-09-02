import authReducer, { loginUser, signUpUser, logout } from './authSlice';

const createStorageMock = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
};

describe('auth slice', () => {
  beforeEach(() => {
    global.localStorage = createStorageMock();
  });

  test('stores a token when login succeeds', () => {
    const state = authReducer(undefined, {
      type: loginUser.fulfilled.type,
      payload: { id: 'u-1', email: 'student@moringapair.com', role: 'student', name: 'Student User', token: 'demo-token' },
    });

    expect(state.user.email).toBe('student@moringapair.com');
    expect(global.localStorage.getItem('moringaPairToken')).toBe('demo-token');
    expect(JSON.parse(global.localStorage.getItem('moringaPairUser')).email).toBe('student@moringapair.com');
  });

  test('removes the token on logout', () => {
    global.localStorage.setItem('moringaPairToken', 'demo-token');
    global.localStorage.setItem('moringaPairUser', JSON.stringify({ id: 'u-1', role: 'student' }));

    const state = authReducer(
      { user: { id: 'u-1', role: 'student' }, status: 'succeeded', error: null },
      logout()
    );

    expect(state.user).toBeNull();
    expect(global.localStorage.getItem('moringaPairToken')).toBeNull();
    expect(global.localStorage.getItem('moringaPairUser')).toBeNull();
  });

  test('stores a token when sign up succeeds', () => {
    const state = authReducer(undefined, {
      type: signUpUser.fulfilled.type,
      payload: { id: 'u-2', email: 'new@moringapair.com', role: 'student', name: 'New User', token: 'signup-token' },
    });

    expect(state.user.email).toBe('new@moringapair.com');
    expect(global.localStorage.getItem('moringaPairToken')).toBe('signup-token');
  });
});
