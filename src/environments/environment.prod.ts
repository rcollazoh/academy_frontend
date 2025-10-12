//const BASE_URL = "http://164.92.71.78:7000"
const BASE_URL = "https://pradacademy.com"
const LOCAL_URL = "http://localhost:7000"


export const environment = {
  production: true,

  /**URL Origin Service */
  urlOrigin: BASE_URL,
  localUrl: LOCAL_URL,

  serviceLogin: BASE_URL + '/academy/login',
  serviceLogout: BASE_URL + '/academy/logout',
  serviceRegister: BASE_URL + '/academy/person/register',
  serviceRefreshToken: BASE_URL + '/academy/refresh_token',

  serviceArea: BASE_URL + '/academy/area',
  servicePractice: BASE_URL + '/academy/practice',

  serviceStudentCourse: BASE_URL + '/academy/student_course',

  servicePerson: BASE_URL + '/academy/person',

  serviceApplyCourse: BASE_URL + '/academy/student_course/apply',

  serviceStudentModule: BASE_URL + '/academy/student_module',

  serviceConfigClassImage: BASE_URL + '/academy/config_class_image',

  serviceStudentClass: BASE_URL + '/academy/student_class',

  serviceStudentExam: BASE_URL + '/academy/student_exam',

  serviceImagenes: BASE_URL + '/academy/image',

  serviceConfigExamQuestion: BASE_URL + '/academy/config_exam_question',

};


