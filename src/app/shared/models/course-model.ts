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
}

export interface Lesson {
  id: number;
  viewed: boolean;
  configClassId: number;
  title: string;
  type: string;
}

export interface Exam {
  configExamId: number;
  status: string;
  title: string;
}

export interface Module {
  id: number;
  confingModuleId: number;
  moduleName: string;
  orderNum: number;
  classes: Lesson[];
  exam: Exam;
}

export interface ClassImageNavigationDto {
  currentId: number;
  title: string;
  recourseUrl: string;
  orderNum: number;
  previousId: number;
  nextId: number;
}