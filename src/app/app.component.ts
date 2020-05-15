import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Student} from './student.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'lab4';
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;
  studentTable: StudentTable = new StudentTable([
    new Student('s1', 'Lorenzo', 'Limoli'),
    new Student('s2', 'Stefano', 'Loscalzo'),
    new Student('s3', 'Angelo', 'Floridia')
  ]);
  toggleForMenuClick() {
    this.sidenav.toggle();
  }
}

export class StudentTable{
  students: Array<Student>;
  displayedColumns: string[] = ['Select', 'Id', 'FirstName', 'LastName'];
  checkboxes: Array<boolean>;
  headerState: number; // 1 = unchecked, 2 = indeterminate, 3 = checked
  constructor(students: Array<Student>) {
    this.students = students;
    this.headerState = 1;
    this.checkboxes = new Array<boolean>(students.length);
    for (let i = 0; i < students.length; i++){
      this.checkboxes[i] = false;
    }
  }
  onHeaderChange(event){
    if (event.checked){
      this.headerState = 3;
      this.checkboxes.forEach((value, index) => this.checkboxes[index] = true);
      return;
    }
    this.headerState = 1;
    this.checkboxes.forEach((v, i) => this.checkboxes[i] = false);
    return;
  }
  isIndeterminate(): boolean{
    return this.headerState === 2;
  }
  isHeaderChecked(): boolean {
    return this.headerState === 3;
  }
  onCheckboxChange(i: number, event) {
    this.checkboxes[i] = event.checked;
    const numberOfChecked = this.checkboxes.filter(value => value === true).length;
    if (numberOfChecked === 0){
      this.headerState = 1;
    }else if (numberOfChecked === this.checkboxes.length){
      this.headerState = 3;
    }else{
      this.headerState = 2;
    }
  }
  isCheckboxChecked(i: number): boolean {
    return this.checkboxes[i];
  }
}
