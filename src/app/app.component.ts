import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Student} from './student.model';

const STUDENTS: Array<Student> = [
  new Student('s1', 'Lorenzo', 'Limoli'),
  new Student('s2', 'Stefano', 'Loscalzo'),
  new Student('s3', 'Angelo', 'Floridia')
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'lab4';
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;
  studentTable: StudentTable = new StudentTable();
  toggleForMenuClick() {
    this.sidenav.toggle();
  }
}

export class StudentTable{
  students: Array<Student> = STUDENTS;
  displayedColumns: string[] = ['Select', 'Id', 'FirstName', 'LastName'];
}
