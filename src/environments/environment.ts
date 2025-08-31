const BASE_URL = "http://localhost:7000"

export const environment = {
  production: false,

  /**URL Origin Service */
  urlOrigin: BASE_URL,
  localUrl: BASE_URL,

  serviceLogin: '/academy/login',
  serviceLogout: '/academy/logout',
  serviceRegister:'/academy/person/register',

  serviceArea: '/academy/area',
  servicePractice: '/academy/practice',
};
