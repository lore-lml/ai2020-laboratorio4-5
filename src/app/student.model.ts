export class Student {
  id: string;
  firstName: string;
  lastName: string;

  constructor(id: string, firstName: string, lastName: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }
  toString = (): string => {
    return `${this.firstName} ${this.lastName} (${this.id})`;
  }
}
