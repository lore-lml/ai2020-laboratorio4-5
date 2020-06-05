import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {StudentsContComponent} from './teacher/students-cont.component';
import {HomeComponent} from './home.component';
import {PageNotFoundComponent} from './page-not-found.component';
import {VmsContComponent} from './teacher/vms-cont.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  { path: 'teacher/course', canActivate: [AuthGuard], children: [
      { path: 'applicazioni-internet/students',  component: StudentsContComponent },
      { path: 'applicazioni-internet/vms',       component: VmsContComponent },
    ]
  },
  { path: 'home',                                           component: HomeComponent },
  { path: '',                                               redirectTo: 'home', pathMatch: 'full' },
  { path: '**',                                             component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false} )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
