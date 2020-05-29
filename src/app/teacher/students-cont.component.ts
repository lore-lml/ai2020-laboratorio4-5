import {Component, OnInit} from '@angular/core';
import {Student} from '../student.model';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit {

  students: ReadonlyArray<Student>;
  enrolledStudents: MatTableDataSource<Student>;

  constructor() {
    this.students = [
      new Student('s1', 'Lorenzo', 'Limoli'),
      new Student('s2', 'Stefano', 'Loscalzo'),
      new Student('s3', 'Angelo', 'Floridia'),
      new Student('s4', 'Giovanni', 'Muciaccia'),
      new Student('s5', 'Alex', 'Astone'),
      new Student('s6', 'Francesco', 'Rossi'),
      new Student('s7', 'Giuseppe', 'Noni'),
      new Student('s8', 'Paola', 'Bianchi')
    ];
    this.enrolledStudents = new MatTableDataSource<Student>([this.students[0], this.students[1]]);
  }

  ngOnInit(): void {
  }
}
