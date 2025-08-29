const BASE_URL = "http://147.182.204.223:7000"
const LOCAL_URL = "http://192.168.2.10:7000"

export const environment = {
  production: true,

  /**URL Origin Service */
  urlOrigin: BASE_URL,
  localUrl: LOCAL_URL,

  serviceLogin: '/academy/login',
  serviceLogout: '/academy/logout',
  serviceRegister:'/academy/persons/register',

  serviceArea: '/academy/area',
  servicePractice: '/academy/practice',

};


