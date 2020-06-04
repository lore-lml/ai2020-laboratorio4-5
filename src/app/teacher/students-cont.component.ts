import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {StudentsComponent} from './students.component';
import {StudentService} from '../services/student.service';
import {Student} from '../models/student.model';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit, AfterViewInit {
  @ViewChild(StudentsComponent)
  private studentsComponent: StudentsComponent;

  constructor(private studentService: StudentService) {
    studentService.getEnrolledStudents().subscribe(enrolled => this.studentsComponent.enrolledStudents = enrolled);
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.studentsComponent.filteredStudents = this.studentsComponent.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        switchMap(value => this.studentService.getFilteredUnrolledStudents(value))
      );
  }

  addStudents(students: Student[]) {
    /*const enrolled: Student[] = [];
    students.forEach(s => this.studentService.enrollStudent(s.id).subscribe(student => {
      enrolled.push(student);
      if (enrolled.length === students.length){
        const newEnrolled = this.studentsComponent.enrolledStudents;
        newEnrolled.push(...enrolled);
        this.studentsComponent.enrolledStudents = newEnrolled;
      }
    }));*/
    this.studentService.enrollStudents(students).subscribe(() => {
      const enrolled = this.studentsComponent.enrolledStudents;
      enrolled.push(...students);
      this.studentsComponent.enrolledStudents = enrolled;
    });
  }

  deleteStudents(students: Student[]) {
    /*const toDelete: Student[] = [];
    students.forEach(s => this.studentService.disenrollStudent(s.id).subscribe(student => {
      toDelete.push(student);
      if (toDelete.length === students.length){
        this.studentsComponent.enrolledStudents = this.studentsComponent.enrolledStudents
          .filter(value => toDelete.findIndex(old => old.id === value.id) === -1);
      }
    }));*/
    this.studentService.unrollStudents(students).subscribe(() => {
      this.studentsComponent.enrolledStudents = this.studentsComponent.enrolledStudents
        .filter(value => students.findIndex(old => old.id === value.id) === -1);
    });
  }

  restoreStudents(students: Student[]) {
    /*this.enrolledStudents = students;
    this.studentsComponent.enrolledStudents = this.enrolledStudents;*/
  }
}
