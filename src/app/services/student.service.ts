import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
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
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<Student>(this.studentsUrl, newStudent, httpOptions);
  }
  update(oldStudent: Student, newStudent: Student){
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
    return this.http.delete<Student>(`${this.studentsUrl}/${studentId}`)
      .pipe(
        map(student => new Student(student.id, student.firstName, student.lastName, student.courseId, student.groupId))
      );
  }
  enrollStudents(studentsToEnroll: Student[]){
    const observables: Observable<Student>[] = [];
    studentsToEnroll.forEach(s => observables.push(this.updateCourseId(s, 1)));
    return forkJoin(observables);
  }
  unrollStudents(studentsToUnroll: Student[]){
    const observables: Observable<Student>[] = [];
    studentsToUnroll.forEach(s => observables.push(this.updateCourseId(s, 0)));
    return forkJoin(observables);
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

  private updateCourseId(student: Student, id: number){
    const json = {courseId: id};
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.patch<Student>(`${this.studentsUrl}/${student.id}`, json, httpOptions)
      .pipe(
        map(response => new Student(response.id, response.firstName, response.lastName, response.courseId, response.groupId))
      );
  }
}
