 const authService = {
    login: (username: string, password: string) => {
      if (username === 'user@fishbowlllc.com' && password === 'Password1') {
        localStorage.setItem('auth-token', 'dummy-token');
        localStorage.setItem('user-email', username); 
        return true;
      }
      return false;
    },
    logout: () => {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-email'); 
    },
    isAuthenticated: () => {
      return localStorage.getItem('auth-token') !== null;
    },
    getUserEmail: () => {
      return localStorage.getItem('user-email');
    }
  };
  export default authService;