import {Component, OnInit, ViewChild} from '@angular/core';
import {Student} from '../student.model';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  students: ReadonlyArray<Student>;
  addedStudents: MatTableDataSource<Student>;
  filteredStudents: Array<Student>;
  displayedColumns: string[] = ['select', 'id', 'firstName', 'lastName', 'group'];
  headerState: number; // 1 = unchecked, 2 = indeterminate, 3 = checked
  formControl: FormControl;
  selectedStudent: Student;
  numberSelected: number;

  ngOnInit(): void {
    this.addedStudents.paginator = this.paginator;
    this.addedStudents.sort = this.sort;
  }

  constructor(private snackBar: MatSnackBar) {
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
    this.addedStudents = new MatTableDataSource<Student>([this.students[0], this.students[1]]);
    this.filteredStudents = this.students.filter(value => !this.addedStudents.data.includes(value)).map(value => value);
    this.headerState = 1;
    this.formControl = new FormControl();
    this.selectedStudent = null;
    this.numberSelected = 0;
    this.selectedStudent = null;
  }
  displayStudent(student: Student): string{
    if (student !== null){
      return student.toString();
    }
    return '';
  }
  onHeaderChange(event){
    this.headerState = event.checked ? 3 : 1;
    const studentInPage = this.addedStudents._pageData(this.addedStudents.data);
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
    this.addedStudents._pageData(this.addedStudents.data)[i].checked = event.checked;
    this.setHeaderState();
    this.numberSelected += event.checked ? 1 : -1;
  }
  isCheckboxChecked(i: number): boolean {
    return this.addedStudents._pageData(this.addedStudents.data)[i].checked;
  }
  deleteStudents(){
    if (this.numberSelected === 0) {
      this.snackBar.open('Non hai selezionato nessuno studente', '', {duration: 3000});
      return;
    }
    const currentStudents = this.addedStudents.data;
    const filtered: Student[] = this.addedStudents.data.filter(v => !v.checked);
    this.addedStudents.data.forEach(v => v.checked = false);
    this.addedStudents.data = filtered;
    this.headerState = 1;
    const currentFilteredStudents = this.filteredStudents;
    this.filteredStudents = this.students.filter(v => !this.addedStudents.data.includes(v));

    this.snackBar.open('Gli studenti sono stati rimossi con successo',
      'Undo',
      {duration: 3000})
      .onAction().subscribe(() => {
      this.addedStudents.data = currentStudents;
      this.filteredStudents = currentFilteredStudents;
    });
    this.numberSelected = 0;
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
      this.snackBar.open('Devi prima cercare e selezionare uno studente', '', {duration: 2000});
      return;
    }
    const currentStudents: Array<Student> = [...this.addedStudents.data];
    const currentFilteredStudents: Array<Student> = [...this.filteredStudents];
    this.selectedStudent.checked = false;
    this.addedStudents.data.push(this.selectedStudent);
    this.addedStudents.data = this.addedStudents.data.map(v => v);
    this.filteredStudents = this.filteredStudents.filter(value => !this.addedStudents.data.includes(value));

    const studentInPage = this.addedStudents._pageData(this.addedStudents.data);
    const checkedInPage = studentInPage.filter(v => v.checked).length;
    if (checkedInPage < studentInPage.length  && this.isHeaderChecked()){
      this.headerState = 2; // If is checked -> become indeterminate
    }

    this.snackBar.open(`${this.selectedStudent.firstName} ${this.selectedStudent.lastName} è stato aggiunto`,
      'Undo',
      {duration: 3000})
      .onAction().subscribe(
      () => {
        this.addedStudents.data = currentStudents;
        this.filteredStudents = currentFilteredStudents;
        this.addedStudents.data.forEach(v => v.checked = false);
        this.numberSelected = 0;
        this.headerState = 1;
      }
    );
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
  changePage() {
    this.setHeaderState();
  }

}
