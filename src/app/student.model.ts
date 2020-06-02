export class Student {
  id: string;
  firstName: string;
  lastName: string;
  group: string;
  // checked: boolean;

  constructor(id: string, firstName: string, lastName: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.group = '- - -';
    // this.checked = false;
  }
  toString = (): string => {
    return `${this.firstName} ${this.lastName} (${this.id})`;
  }
}
