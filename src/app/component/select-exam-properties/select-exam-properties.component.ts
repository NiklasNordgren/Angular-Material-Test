import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subject } from 'src/app/model/subject.model';
import { Course } from 'src/app/model/course.model';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './format-datepicker';
import { Exam } from 'src/app/model/exam.model';

@Component({
  selector: 'app-select-exam-properties',
  templateUrl: './select-exam-properties.component.html',
  styleUrls: ['./select-exam-properties.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class SelectExamPropertiesComponent implements OnInit {

  @Input() tempId: number;

  @Input() academies: Academy[];
  @Input() subjects: Subject[];
  @Input() courses: Course[];
  @Input() uploadedExams: Exam[];
  @Input() examsToUpload: Exam[];

  @Output() courseIdEmitter = new EventEmitter<number>();
  @Output() examDateEmitter = new EventEmitter<Date>();

  subjectsFilteredByAcademyId: Subject[];
  coursesFilteredBySubjectId: Course[];

  id: number;
  selectedAcademyId: number = 0;
  selectedSubjectId: number = 0;
  selectedCourseId: number = 0;
  selectedDate: Date;

  regexpDate: RegExp = new RegExp("\\d{6,}");

  constructor() { }

  ngOnInit() {
    this.id = this.tempId;
    this.tryToAutoMatchCourse();
    this.selectedDate = this.tryToAutoMatchDate();
    this.setSelectedExamDate(this.selectedDate);
  }

  academyChanged(academyId: number): void {
    this.subjectsFilteredByAcademyId = this.subjects.filter(x => x.academyId == academyId);
    if (this.subjectsFilteredByAcademyId && this.subjectsFilteredByAcademyId.length > 0)
      this.subjectChanged(this.subjectsFilteredByAcademyId[0].id);
    else
      this.setSelectedCourseId(0);
  }

  subjectChanged(subjectId: number): void {
    this.coursesFilteredBySubjectId = this.courses.filter(x => x.subjectId == subjectId);
    if (this.coursesFilteredBySubjectId && this.coursesFilteredBySubjectId.length > 0)
      this.setSelectedCourseId(this.coursesFilteredBySubjectId[0].id);
    else
      this.setSelectedCourseId(0);
  }

  setSelectedCourseId(courseId: any) {
    if (typeof courseId === "string") {
      courseId = parseInt(courseId);
    }
    this.selectedCourseId = courseId;
    this.courseIdEmitter.emit(this.selectedCourseId);
  }

  setSelectedExamDate(examDate: Date) {
    this.examDateEmitter.emit(this.selectedDate);
  }

  isExamUploaded(): boolean {
    return this.uploadedExams.find(x => x.tempId === this.id) === undefined ? false : true;
  }

  tryToAutoMatchDate(): Date {

    let matchedDateString = this.examsToUpload.find(x => x.tempId === this.tempId).fileName.match(this.regexpDate);

    if (matchedDateString && (matchedDateString[0].length === 6 || matchedDateString[0].length === 8)) {
      this.autoMatchDateSuccessful();
      if (matchedDateString[0].length === 6) {
        return new Date("20" + matchedDateString[0].substring(0, 2) + "-" + matchedDateString[0].substring(2, 4) + "-" + matchedDateString[0].substring(4, 6));
      } else {
        return new Date(matchedDateString[0].substring(0, 4) + "-" + matchedDateString[0].substring(4, 6) + "-" + matchedDateString[0].substring(6, 8));
      }
    } else {
      return new Date();
    }

  }

  tryToAutoMatchCourse(): void {

    let courseCodeString = this.examsToUpload.find(x => x.tempId === this.tempId).fileName.trim().split(" ")[0];
    let courseMatch = this.courses.find(x => x.courseCode === courseCodeString);

    if (courseMatch) {
      let courseSubject = this.subjects.find(x => x.id === courseMatch.subjectId);
      let courseAcademy = this.academies.find(x => x.id === courseSubject.academyId);

      this.academyChanged(courseAcademy.id);
      this.selectedAcademyId = courseAcademy.id;

      this.subjectChanged(courseSubject.id);
      this.selectedSubjectId = courseSubject.id;

      this.setSelectedCourseId(courseMatch.id);
      this.autoMatchCourseSuccessful();

    } else {
      this.academyChanged(this.academies[0].id);
      this.selectedAcademyId = this.academies[0].id;
      this.selectedSubjectId = this.subjects[0].id;
    }

  }

  autoMatchDateSuccessful(){
    this.examsToUpload.find(x => x.tempId === this.tempId).autoMatchDate = true;
  }

  autoMatchCourseSuccessful(){
    this.examsToUpload.find(x => x.tempId === this.tempId).autoMatchCourse = true;
  }

}


