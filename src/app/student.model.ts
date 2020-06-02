export class Student {
  id: number;
  firstName: string;
  lastName: string;
  group: string;
  // checked: boolean;
  // tslint:disable-next-line:variable-name
  private _courses: number[];

  constructor(id: number, firstName: string, lastName: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.group = '- - -';
    // this.checked = false;
    this._courses = [0];
  }
  toString = (): string => {
    return `${this.firstName} ${this.lastName} (${this.id})`;
  }
  get courses(): number {
    return this._courses[0];
  }

  set courses(value: number) {
    this._courses[0] = value;
  }
}
