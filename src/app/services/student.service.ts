import {Injectable} from '@angular/core';
import {Student} from '../student.model';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private _students: Student[];

  constructor() {
    this._students = [
      new Student(1, 'Lorenzo', 'Limoli'),
      new Student(2, 'Stefano', 'Loscalzo'),
      new Student(3, 'Angelo', 'Floridia'),
      new Student(4, 'Giovanni', 'Muciaccia'),
      new Student(5, 'Alex', 'Astone'),
      new Student(6, 'Francesco', 'Rossi'),
      new Student(7, 'Giuseppe', 'Noni'),
      new Student(8, 'Paola', 'Bianchi')
    ];
    this._students.slice(0, 2).forEach(s => s.courses = 1);
  }

  create(newStudent: Student){
    if (this._students.filter(s => s.id === newStudent.id).length > 0) {
      return of<Student>(null);
    }
    this._students.push(newStudent);
    return of<Student>(newStudent);
  }
  update(oldStudent: Student, newStudent: Student){
    const ind = this._students.findIndex(s => s.id === oldStudent.id);
    if (ind === -1){
      return of<Student>(oldStudent);
    }
    this._students[ind] = newStudent;
    return of<Student>(newStudent);
  }
  find(studentId: number){
    return of<Student>(this._students.find(value => value.id === studentId));
  }
  query(){
    return of<Student[]>(this._students);
  }
  delete(studentId: number){
    const deletedStudentInd = this._students.findIndex(s => s.id === studentId);
    let student;
    if (deletedStudentInd !== -1){
      student = this._students[deletedStudentInd];
      this._students = this._students.filter(s => s.id !== studentId);
    }
    return of<Student[]>(student);
  }

  enrollStudent(studentId: number, courseId: number= 1){
    const student = this._students.find(s => s.id === studentId);
    if (student !== undefined){
      student.courses = courseId;
    }
    return of<Student>(student);
  }
  disenrollStudent(studentId: number, courseId: number= 1){
    const student = this._students.find(s => s.id === studentId);
    if (student !== undefined){
      student.courses = 0;
    }
    return of<Student>(student);
  }
  getEnrolledStudents(courseId: number= 1){
    return of<Student[]>(this._students.filter(s => s.courses === courseId));
  }
}
