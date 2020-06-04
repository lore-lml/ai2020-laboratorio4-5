import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {StudentsComponent} from './students.component';
import {StudentService} from '../services/student.service';
import {Student} from '../models/student.model';
import {debounceTime, startWith, switchMap} from 'rxjs/operators';

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
    this.studentService.enrollStudents(students).subscribe(() => {
      const enrolled = this.studentsComponent.enrolledStudents;
      enrolled.push(...students);
      this.studentsComponent.enrolledStudents = enrolled;
    }, () => {
      this.studentService.getEnrolledStudents().subscribe(
        enrolledStudents => this.studentsComponent.enrolledStudents = enrolledStudents,
        () => console.log('ERRORE')
      );
    });
  }

  deleteStudents(students: Student[]) {
    this.studentService.unrollStudents(students).subscribe(() => {
      this.studentsComponent.enrolledStudents = this.studentsComponent.enrolledStudents
        .filter(value => students.findIndex(old => old.id === value.id) === -1);
    }, () => {
      this.studentService.getEnrolledStudents().subscribe(
        enrolledStudents => this.studentsComponent.enrolledStudents = enrolledStudents,
        () => console.log('ERRORE')
      );
    });
  }
}
