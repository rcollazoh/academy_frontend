import { CourseConfig } from "./course-config-model";

export interface Course {
  id: number; 
  personId: number; 
  course?: CourseConfig; 
  startDate: string;
  endDate: string;
  status: string;
  paymentMethod?: string;
  personName?:string;
  personLastName?: string;
  personEmail?: string;
  configCourseName?: string;
  price?: number;
  durationDays?: number;
}

export interface Lesson {
  id: number;
  viewed: boolean;
  configClassId: number;
  title: string;
  type: string;
  currentImageId: number;
}

export interface Exam {
  id: number;
  configExamId: number;
  status: string;
  title: string;
  durationMinutes: number;
  minQuestions: number;
  questions: number;
}

export interface Question {
  id: number;
  text: string;
  orderNum: number;
  configOptions: QuestionOption[];
}

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Reference {
  id: number;
  link: string;
  orderNum: number;
  title: string;
}

export interface Module {
  id: number;
  confingModuleId: number;
  moduleName: string;
  orderNum: number;
  classes: Lesson[];
  exam: Exam;
  status: string;
  references: Reference[];
}

export interface ClassImageNavigationDto {
  currentId: number;
  title: string;
  recourseUrl: string;
  orderNum: number;
  previousId: number;
  nextId: number;
}

export interface ExamResult {
  questionId: number;
  optionId: number;
  isCorrect?: boolean;
}