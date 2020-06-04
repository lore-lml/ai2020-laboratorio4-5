import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Student} from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentsUrl = 'http://localhost:3000/students';
  private coursesUrl = 'http://localhost:3000/courses';
  private groupsUrl = 'http://localhost:3000/groups';

  constructor(private http: HttpClient) {}

  create(newStudent: Student){
    /*if (this._students.filter(s => s.id === newStudent.id).length > 0) {
      return of<Student>(null);
    }
    this._students.push(newStudent);
    return of<Student>(newStudent);*/
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.put<Student>(this.studentsUrl, newStudent, httpOptions);
  }
  update(oldStudent: Student, newStudent: Student){
    /*const ind = this._students.findIndex(s => s.id === oldStudent.id);
    if (ind === -1){
      return of<Student>(oldStudent);
    }
    this._students[ind] = newStudent;
    return of<Student>(newStudent);*/
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.put<Student>(`${this.studentsUrl}/${oldStudent.id}`, newStudent, httpOptions);
  }
  find(studentId: string){
    return this.http.get<Student>(`${this.studentsUrl}/${studentId}`)
      .pipe(
        map(student => new Student(student.id, student.firstName, student.lastName, student.courseId, student.groupId))
      );
  }
  getAllStudents(): Observable<Student[]>{
    return this.getStudentsObservable(this.studentsUrl);
  }
  delete(studentId: string){
    /*const deletedStudentInd = this._students.findIndex(s => s.id === studentId);
    let student;
    if (deletedStudentInd !== -1){
      student = this._students[deletedStudentInd];
      this._students = this._students.filter(s => s.id !== studentId);
    }
    return of<Student[]>(student);*/
  }

  enrollStudent(studentId: string){
    return this.updateCourseId(studentId, 1);
  }
  disenrollStudent(studentId: string){
    return this.updateCourseId(studentId, 0);
  }
  getEnrolledStudents(courseId: number= 1){
    return this.getStudentsObservable(`${this.studentsUrl}?courseId=${courseId}`);
  }
  getFilteredUnrolledStudents(value: string) {
    return this.getStudentsObservable(`${this.studentsUrl}?courseId=0`)
      .pipe(
        map(students => students.filter(s => s.toString().toLowerCase().includes(value.toString().toLowerCase())))
      );
  }
  private getStudentsObservable(url: string){
    return this.http.get<Student[]>(url)
      .pipe(
        map(value => {
          const students: Student[] = [];
          value.forEach(student => students.push(
            new Student(student.id, student.firstName, student.lastName, student.courseId, student.groupId)
          ));
          return students;
        })
      );
  }

  private updateCourseId(studentId: string, id: number){
    const json = {courseId: id};
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.patch<Student>(`${this.studentsUrl}/${studentId}`, json, httpOptions)
      .pipe(
        map(student => new Student(student.id, student.firstName, student.lastName, student.courseId, student.groupId))
      );
  }
}
