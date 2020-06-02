import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Student} from '../student.model';
import {StudentsComponent} from './students.component';
import {StudentService} from '../services/student.service';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit {
  @ViewChild(StudentsComponent)
  private studentsComponent: StudentsComponent;
  students: ReadonlyArray<Student>;
  enrolledStudents: Student[];

  constructor(private studentService: StudentService) {
    this.enrolledStudents = [];
    studentService.query().subscribe(students => {
      this.students = students;
    });
    studentService.getEnrolledStudents().subscribe(enrolled => this.enrolledStudents = enrolled);
  }

  ngOnInit(): void {
  }

  addStudents(students: Student[]) {
    const enrolled: Student[] = [];
    students.forEach(s => this.studentService.enrollStudent(s.id).subscribe(student => {
      enrolled.push(student);
      if (enrolled.length === students.length){
        this.enrolledStudents.push(...enrolled);
        this.studentsComponent.enrolledStudents = this.enrolledStudents;
      }
    }));
  }

  deleteStudents(students: Student[]) {
    const toDelete: Student[] = [];
    students.forEach(s => this.studentService.disenrollStudent(s.id).subscribe(student => {
      toDelete.push(student);
      if (toDelete.length === students.length){
        this.enrolledStudents = this.enrolledStudents.filter(value => !toDelete.includes(value));
        this.studentsComponent.enrolledStudents = this.enrolledStudents;
      }
    }));
  }

  restoreStudents(students: Student[]) {
    this.enrolledStudents = students;
    this.studentsComponent.enrolledStudents = this.enrolledStudents;
  }
}
