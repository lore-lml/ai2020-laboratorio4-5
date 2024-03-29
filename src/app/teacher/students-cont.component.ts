import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StudentsComponent} from './students.component';
import {StudentService} from '../services/student.service';
import {Student} from '../models/student.model';
import {debounceTime, first, startWith, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(StudentsComponent)
  private studentsComponent: StudentsComponent;
  private filterSubscription: Subscription;

  constructor(private studentService: StudentService) {
    this.filterSubscription = studentService.getEnrolledStudents()
      .subscribe(enrolled => this.studentsComponent.enrolledStudents = enrolled);
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
  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
  }

  addStudents(students: Student[], snackBar: boolean = true) {
    this.studentService.enrollStudents(students).pipe(first())
      .subscribe(() => {
      const enrolled = this.studentsComponent.enrolledStudents;
      enrolled.push(...students);
      this.studentsComponent.enrolledStudents = enrolled;

      if (snackBar){
        const msg = `${students[0].firstName} ${students[0].lastName} è stato aggiunto con successo`;
        const onAction = () => this.deleteStudents(students, false);
        this.studentsComponent.openSnackbarWithAction(msg, onAction);
      }
    }, () => {
      this.studentService.getEnrolledStudents().pipe(first())
        .subscribe(
        enrolledStudents => this.studentsComponent.enrolledStudents = enrolledStudents,
        () => console.log('ERRORE')
      );
    });
  }

  deleteStudents(students: Student[], snackBar: boolean = true) {
    this.studentService.unrollStudents(students).pipe(first())
      .subscribe(() => {
      this.studentsComponent.enrolledStudents = this.studentsComponent.enrolledStudents
        .filter(value => students.findIndex(old => old.id === value.id) === -1);

      if (snackBar){
        const msg = 'Gli studenti sono stato rimossi con successo';
        const onAction = () => this.addStudents(students, false);
        this.studentsComponent.openSnackbarWithAction(msg, onAction);
      }
    }, () => {
      this.studentService.getEnrolledStudents().pipe(first())
        .subscribe(
        enrolledStudents => this.studentsComponent.enrolledStudents = enrolledStudents,
        () => console.log('ERRORE')
      );
    });
  }

  getSelectedStudents(){
    if (this.studentsComponent === undefined) {
      return 0;
    }
    return this.studentsComponent.checkedStudents.size;
  }
}
