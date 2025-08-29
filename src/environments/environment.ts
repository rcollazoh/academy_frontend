// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const BASE_URL = "http://localhost:7000"

export const environment = {
  production: false,

  /**URL Origin Service */
  urlOrigin: "http://localhost:7000",
  localUrl: "http://localhost:7000",

  serviceLogin: '/academy/login',
  serviceLogout: '/academy/logout',
  serviceRegister:'/academy/persons/register',

  serviceArea: '/academy/area',
  servicePractice: '/academy/practice',
};
