import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {StudentsContComponent} from './teacher/students-cont.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Virtual Labs';
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;
  @ViewChild(StudentsContComponent)
  studentsComponent: StudentsContComponent;
  toggleForMenuClick() {
    this.sidenav.toggle();
  }
}
