import { CourseConfig } from "./course-config-model";

export interface Course {
  id: number; 
  personId: number; 
  course?: CourseConfig; 
  startDate: string;
  endDate: string;
  status: string;
}