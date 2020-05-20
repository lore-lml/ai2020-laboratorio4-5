import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Student} from './student.model';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

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
    new Student('s3', 'Angelo', 'Floridia'),
    new Student('s4', 'Giovanni', 'Muciaccia'),
    new Student('s5', 'Alex', 'Astone'),
    new Student('s6', 'Francesco', 'Rossi'),
  ]);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.studentTable.addedStudents.paginator = this.paginator;
    this.studentTable.addedStudents.sort = this.sort;
  }
  toggleForMenuClick() {
    this.sidenav.toggle();
  }
}

export class StudentTable{
  students: ReadonlyArray<Student>;
  addedStudents: MatTableDataSource<Student>;
  filteredStudents: Array<Student>;
  displayedColumns: string[] = ['select', 'id', 'firstName', 'lastName'];
  checkboxes: Array<boolean>;
  headerState: number; // 1 = unchecked, 2 = indeterminate, 3 = checked
  formControl: FormControl;
  selectedStudent: Student;

  constructor(students: Array<Student>) {
    this.students = students;
    this.addedStudents = new MatTableDataSource<Student>([students[0], students[1]]);
    this.filteredStudents = students.filter(value => !this.addedStudents.data.includes(value)).map(value => value);
    this.headerState = 1;
    this.formControl = new FormControl();
    this.checkboxes = new Array<boolean>(this.addedStudents.data.length);
    for (let i = 0; i < this.checkboxes.length; i++){
      this.checkboxes[i] = false;
    }
    this.selectedStudent = null;
  }
  displayStudent(student: Student): string{
    if (student !== null){
      return student.toString();
    }
    return '';
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
  deleteStudents(){
    this.addedStudents.data = this.addedStudents.data.filter((value, index) => !this.checkboxes[index]);
    this.checkboxes = this.checkboxes.filter(v => !v);
    this.headerState = 1;
    this.filteredStudents = this.students.filter(v => !this.addedStudents.data.includes(v));
  }

  filterStudents(str: string) {
    this.filteredStudents = this.students
      .filter(value => !this.addedStudents.data.includes(value) &&
      value.toString().toLowerCase().includes(str.toLowerCase())
    );
  }

  setSelectedStudent(event: MatAutocompleteSelectedEvent) {
    this.selectedStudent = event.option.value;
  }

  addStudent(textInput: HTMLInputElement) {
    if (this.selectedStudent === null) {
      return;
    }
    this.addedStudents.data.push(this.selectedStudent);
    this.addedStudents.data = this.addedStudents.data.map(v => v);
    this.filteredStudents = this.filteredStudents.filter(value => !this.addedStudents.data.includes(value));
    this.checkboxes.push(false);
    this.selectedStudent = null;
    textInput.value = null;

    if (this.isHeaderChecked()){
      this.headerState = 2; // If is checked -> become indeterminate
    }
  }
}
