const BASE_URL = "http://localhost:7000"

export const environment = {
  production: false,

  /**URL Origin Service */
  urlOrigin: "http://localhost:7000",
  localUrl: "http://localhost:7000",

  serviceLogin: '/academy/login',
  serviceLogout: '/academy/logout',
  serviceRegister:'/academy/person/register',
  serviceRefreshToken: '/academy/refresh_token',

  serviceArea: '/academy/area',
  servicePractice: '/academy/practice',

  serviceStudentCourse: '/academy/student_course',

  servicePerson: '/academy/person',

  serviceApplyCourse: '/academy/student_course/apply',

  serviceStudentModule: '/academy/student_module',

  serviceConfigClassImage: '/academy/config_class_image',

  serviceStudentClass: '/academy/student_class',

  serviceStudentExam: '/academy/student_exam',

  serviceImagenes: '/academy/image',

  serviceConfigExamQuestion: '/academy/config_exam_question',

  serviceEmail: '/academy/email',
};
