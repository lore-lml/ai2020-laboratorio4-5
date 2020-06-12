import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Observable} from 'rxjs';
import {Student} from '../models/student.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})

export class StudentsComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  // tslint:disable-next-line:variable-name
  _enrolledStudents: MatTableDataSource<Student>;
  filteredStudents: Observable<Student[]>;
  checkedStudents: Set<string>;
  displayedColumns: string[] = ['select', 'id', 'firstName', 'lastName', 'group'];
  headerState: number; // 1 = unchecked, 2 = indeterminate, 3 = checked
  formControl: FormControl;
  selectedStudent: Student;

  @Output()
  private addStudentEvent: EventEmitter<Student[]>;
  @Output()
  private deleteStudentEvent: EventEmitter<Student[]>;
  @Output()
  private restoreEvent: EventEmitter<Student[]>;

  ngOnInit(): void {
    this._enrolledStudents.paginator = this.paginator;
    this._enrolledStudents.sort = this.sort;
  }

  constructor(private snackBar: MatSnackBar) {
    this._enrolledStudents = new MatTableDataSource<Student>();
    this.headerState = 1;
    this.formControl = new FormControl();
    this.selectedStudent = null;

    this.addStudentEvent = new EventEmitter<Student[]>();
    this.deleteStudentEvent = new EventEmitter<Student[]>();
    this.restoreEvent = new EventEmitter<Student[]>();
    this.checkedStudents = new Set<string>();
  }

  @Input() set enrolledStudents(students: Student[]){
    this._enrolledStudents.data = students.map(value => value);
    this.checkedStudents.clear();
    this.setHeaderState();
    this.formControl.setValue('');
  }

  get enrolledStudents(): Student[] {
    return this._enrolledStudents.data.map(value => value);
  }

  displayStudent(student: Student): string{
    if (student !== null){
      return student.toString();
    }
    return '';
  }
  onHeaderChange(event){
    this.headerState = event.checked ? 3 : 1;
    const studentInPage = this._enrolledStudents._pageData(this._enrolledStudents.data);
    let count = 0;
    studentInPage.forEach((v) => {
      if (this.checkedStudents.has(v.id) !== event.checked) {
        count++;
        event.checked ? this.checkedStudents.add(v.id) : this.checkedStudents.delete(v.id);
      }
    });
  }
  isIndeterminate(): boolean{
    return this.headerState === 2;
  }
  isHeaderChecked(): boolean {
    // If state == 2 -> indeterminate == true -> indeterminate state wins over checked
    // Needed to not break checkbox header animation
    return this.headerState >= 2;
  }
  onCheckboxChange(selectedStudent: Student, event) {
    event.checked ? this.checkedStudents.add(selectedStudent.id) : this.checkedStudents.delete(selectedStudent.id);
    this.setHeaderState();
  }
  isCheckboxChecked(selectedStudent: Student): boolean {
    return this.checkedStudents.has(selectedStudent.id);
  }
  deleteStudents(){
    if (this.checkedStudents.size === 0){
      this.snackBar.open('Non hai selezionato nessuno studente', '', {duration: 3000});
      return;
    }
    const studentsToDelete: Student[] = this._enrolledStudents.data.filter(v => this.checkedStudents.has(v.id));

    /*this.snackBar.open('Gli studenti sono stato rimossi con successo',
      'Annulla',
      {duration: 2000})
      .onAction().subscribe(() => {
      this.addStudentEvent.emit(studentsToDelete);
    });*/

    studentsToDelete.forEach(v => this.checkedStudents.delete(v.id));
    this.deleteStudentEvent.emit(studentsToDelete);
    this.formControl.setValue('');
  }

  setSelectedStudent(event: MatAutocompleteSelectedEvent) {
    this.selectedStudent = event.option.value;
  }

  addStudent() {
    if (this.selectedStudent === null) {
      this.snackBar.open('Devi prima cercare e selezionare uno studente', '', {duration: 2000});
      return;
    }

    this.addStudentEvent.emit([this.selectedStudent]);
    this.selectedStudent = null;
    this.formControl.setValue('');
  }

  openSnackbarWithAction(msg: string, onAction: () => void){
    this.snackBar.open(msg, 'Annulla', {duration: 2000})
      .onAction().subscribe(() => onAction());
  }

  private setHeaderState(){
    const pageData: Student[] = this._enrolledStudents._pageData(this._enrolledStudents.data);
    const numberOfChecked = pageData.filter(v => this.checkedStudents.has(v.id)).length;
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
