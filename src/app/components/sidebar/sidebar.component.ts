import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { AuthService } from 'app/shaired/auth.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}


export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'Add Team',  icon:'person', class: '' },
    { path: '/list', title: 'Team',  icon:'content_paste', class: '' },
    { path: '/enrolment-add', title: 'Add Enrolment',  icon:'library_books', class: '' },
    { path: '/enrolment', title: 'Enrolment',  icon:'bubble_chart', class: '' },
    { path: '/enrolment-pending', title: ' Pending Enrolment',  icon:'location_on', class: '' },
    { path: '/enrolment-renew', title: 'Enrolment Renew',  icon:'notifications', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  uid:string;
  self = "state"
  constructor(auth:AngularFireAuth,db:AngularFireDatabase,public authService:AuthService, public router :Router) {
    if(localStorage.getItem("uid")==null) {
      this.router.navigate(['/login']);
    }
    auth.user.subscribe(user => {
      this.uid = user.uid;
      db.object<User1>("users/"+user.uid).snapshotChanges().subscribe (data => { 
        console.log(data);
        this.self = data[0].type;
        });
      
    });
   }
logout() {
this.authService.logout();
}
  ngOnInit() {
    if(localStorage.getItem("uid")==null) {
      this.router.navigate(['/login']);
    }
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}

interface User1 {
  email: string;
  password: string;
  type: string;
}
