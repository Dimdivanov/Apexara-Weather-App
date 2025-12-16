export const endpoints = {
  news: {
    all: 'news',
  },
  apiEndpoints: {
    weatherByCity: (city: string) => `weather/${city}`,
    weatherByCoords: (lat: number, lon: number) => `weather/coords?lat=${lat}&lon=${lon}`,
  },
  auth: {
    login: 'auth/login',
    logStatus: 'auth/me',
    logout: 'auth/logout',
    register: 'auth/register',
    changePassword: 'auth/password/change',
  },
  user: {
    account: 'user/',
  }
};
