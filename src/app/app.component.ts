import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Student} from './student.model';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'lab4';
  studentTable: StudentTable;
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private snackBar: MatSnackBar) {
    this.studentTable = new StudentTable([
      new Student('s1', 'Lorenzo', 'Limoli'),
      new Student('s2', 'Stefano', 'Loscalzo'),
      new Student('s3', 'Angelo', 'Floridia'),
      new Student('s4', 'Giovanni', 'Muciaccia'),
      new Student('s5', 'Alex', 'Astone'),
      new Student('s6', 'Francesco', 'Rossi'),
      new Student('s7', 'Giuseppe', 'Noni'),
      new Student('s8', 'Paola', 'Bianchi')
    ], snackBar);
  }

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
  headerState: number; // 1 = unchecked, 2 = indeterminate, 3 = checked
  formControl: FormControl;
  selectedStudent: Student;
  snackBar: MatSnackBar;

  constructor(students: Array<Student>, snackBar: MatSnackBar) {
    this.students = students;
    this.addedStudents = new MatTableDataSource<Student>([students[0], students[1]]);
    this.filteredStudents = students.filter(value => !this.addedStudents.data.includes(value)).map(value => value);
    this.headerState = 1;
    this.formControl = new FormControl();
    this.selectedStudent = null;
    this.snackBar = snackBar;
  }
  displayStudent(student: Student): string{
    if (student !== null){
      return student.toString();
    }
    return '';
  }
  onHeaderChange(event){
    this.headerState = event.checked ? 3 : 1;
    this.addedStudents._pageData(this.addedStudents.data).forEach((v) => v.checked = event.checked);
  }
  isIndeterminate(): boolean{
    return this.headerState === 2;
  }
  isHeaderChecked(): boolean {
    return this.headerState === 3;
  }
  onCheckboxChange(i: number, event) {
    this.addedStudents._pageData(this.addedStudents.data)[i].checked = event.checked;
    this.setHeaderState();
  }
  isCheckboxChecked(i: number): boolean {
    return this.addedStudents._pageData(this.addedStudents.data)[i].checked;
  }
  deleteStudents(){
    const filtered: Student[] = this.addedStudents.data.filter(v => !v.checked);
    this.addedStudents.data.forEach(v => v.checked = false);
    this.addedStudents.data = filtered;
    this.headerState = 1;
    this.filteredStudents = this.students.filter(v => !this.addedStudents.data.includes(v));

    this.showSnackBar('Gli studenti sono stati rimossi con successo');
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

    const studentInPage = this.addedStudents._pageData(this.addedStudents.data);
    const checkedInPage = studentInPage.filter(v => v.checked).length;
    if (checkedInPage < studentInPage.length  && this.isHeaderChecked()){
      this.headerState = 2; // If is checked -> become indeterminate
    }

    this.showSnackBar(`${this.selectedStudent.firstName} ${this.selectedStudent.lastName} è stato aggiunto`);
    this.selectedStudent = null;
    textInput.value = null;
  }

  private setHeaderState(){
    const pageData: Student[] = this.addedStudents._pageData(this.addedStudents.data);
    const numberOfChecked = pageData.map(v => v.checked).filter(value => value === true).length;
    if (numberOfChecked === 0){
      this.headerState = 1;
    }else if (numberOfChecked === pageData.length){
      this.headerState = 3;
    }else{
      this.headerState = 2;
    }
  }
  showSnackBar(msg: string){
    this.snackBar.open(msg, 'Undo', {duration: 2000});
  }
  changePage() {
    this.setHeaderState();
  }
}
