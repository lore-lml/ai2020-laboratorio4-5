import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Student} from './student.model';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Virtual Labs';
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

  ngOnInit() {
    this.studentTable.enrolledStudents.paginator = this.paginator;
    this.studentTable.enrolledStudents.sort = this.sort;
    this.studentTable.filteredStudents = this.studentTable.formControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.studentTable.filterStudents(value))
      );
  }
  toggleForMenuClick() {
    this.sidenav.toggle();
  }
}

export class StudentTable{
  students: ReadonlyArray<Student>;
  enrolledStudents: MatTableDataSource<Student>;
  filteredStudents: Observable<Student[]>;
  displayedColumns: string[] = ['select', 'id', 'firstName', 'lastName', 'group'];
  headerState: number; // 1 = unchecked, 2 = indeterminate, 3 = checked
  formControl: FormControl;
  selectedStudent: Student;
  snackBar: MatSnackBar;
  numberSelected: number;

  constructor(students: Array<Student>, snackBar: MatSnackBar) {
    this.students = students;
    this.enrolledStudents = new MatTableDataSource<Student>([students[0], students[1]]);
    this.headerState = 1;
    this.formControl = new FormControl();
    this.selectedStudent = null;
    this.numberSelected = 0;
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
    const studentInPage = this.enrolledStudents._pageData(this.enrolledStudents.data);
    let count = 0;
    studentInPage.forEach((v) => {
      if (v.checked !== event.checked) {
        count++;
        v.checked = event.checked;
      }
    });

    this.numberSelected += event.checked ? count : -count;
  }
  isIndeterminate(): boolean{
    return this.headerState === 2;
  }
  isHeaderChecked(): boolean {
    // If state == 2 -> indeterminate == true -> indeterminate state wins over checked
    // Needed to not break checkbox header animation
    return this.headerState >= 2;
  }
  onCheckboxChange(i: number, event) {
    this.enrolledStudents._pageData(this.enrolledStudents.data)[i].checked = event.checked;
    this.setHeaderState();
    this.numberSelected += event.checked ? 1 : -1;
  }
  isCheckboxChecked(i: number): boolean {
    return this.enrolledStudents._pageData(this.enrolledStudents.data)[i].checked;
  }
  deleteStudents(){
    if (this.numberSelected === 0) {
      this.snackBar.open('Non hai selezionato nessuno studente', '', {duration: 3000});
      return;
    }
    const currentStudents = this.enrolledStudents.data;
    const filtered: Student[] = this.enrolledStudents.data.filter(v => !v.checked);
    this.enrolledStudents.data.forEach(v => v.checked = false);
    this.enrolledStudents.data = filtered;
    this.headerState = 1;

    this.snackBar.open('Gli studenti sono stati rimossi con successo',
      'Undo',
      {duration: 3000})
      .onAction().subscribe(() => {
      this.enrolledStudents.data = currentStudents;
      this.formControl.setValue('');
    });
    this.numberSelected = 0;
    this.formControl.setValue('');
  }

  filterStudents(str: string) {
    return this.students
      .filter(value => !this.enrolledStudents.data.includes(value) &&
        value.toString().toLowerCase().includes(str.toString().toLowerCase())
      );
  }

  setSelectedStudent(event: MatAutocompleteSelectedEvent) {
    this.selectedStudent = event.option.value;
  }

  addStudent() {
    this.filteredStudents.toPromise().then(value => console.log(value));
    if (this.selectedStudent === null) {
      this.snackBar.open('Devi prima cercare e selezionare uno studente', '', {duration: 2000});
      return;
    }
    const currentStudents: Array<Student> = [...this.enrolledStudents.data];
    this.selectedStudent.checked = false;
    this.enrolledStudents.data.push(this.selectedStudent);
    this.enrolledStudents.data = this.enrolledStudents.data.map(v => v);

    const studentInPage = this.enrolledStudents._pageData(this.enrolledStudents.data);
    const checkedInPage = studentInPage.filter(v => v.checked).length;
    if (checkedInPage < studentInPage.length  && this.isHeaderChecked()){
      this.headerState = 2; // If is checked -> become indeterminate
    }

    this.snackBar.open(`${this.selectedStudent.firstName} ${this.selectedStudent.lastName} è stato aggiunto`,
      'Undo',
      {duration: 3000})
      .onAction().subscribe(
      () => {
        this.enrolledStudents.data = currentStudents;
        this.enrolledStudents.data.forEach(v => v.checked = false);
        this.numberSelected = 0;
        this.headerState = 1;
        this.formControl.setValue('');
      }
    );
    this.selectedStudent = null;
    this.formControl.setValue('');
  }

  private setHeaderState(){
    const pageData: Student[] = this.enrolledStudents._pageData(this.enrolledStudents.data);
    const numberOfChecked = pageData.map(v => v.checked).filter(value => value === true).length;
    if (numberOfChecked === 0){
      this.headerState = 1;
    }else if (numberOfChecked === pageData.length){
      this.headerState = 3;
    }else{
      this.headerState = 2;
    }
  }
  changePage() {
    this.setHeaderState();
  }
}
