const BASE_URL = "http://localhost:7000"

export const environment = {
  production: true,

  /**URL Origin Service */
  urlOrigin: BASE_URL,

  serviceLogin: BASE_URL + '/academy/login',
  serviceLogout: BASE_URL + '/academy/logout',
  serviceRegister: BASE_URL + '/academy/person/register',
  serviceRefreshToken: BASE_URL + '/academy/refresh_token',

  serviceArea: BASE_URL + '/academy/area',
  servicePractice: BASE_URL + '/academy/practice',

  serviceEstudentCourse: BASE_URL + '/academy/student_course',

  servicePerson: BASE_URL + '/academy/person',

  serviceApplyCourse: BASE_URL + '/academy/student_course/apply'

};


