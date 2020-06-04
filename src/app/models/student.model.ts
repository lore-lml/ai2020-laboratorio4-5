export class Student {
  id: string;
  firstName: string;
  lastName: string;
  courseId: number;
  groupId: number;

  constructor(id: string, firstName: string, lastName: string, courseId: number= 0, groupId: number= 0) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.groupId = groupId;
    this.courseId = courseId;
  }

  toString = (): string => {
    return `${this.firstName} ${this.lastName} (${this.id})`;
  }
}
