import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
adminId:any;
  constructor(private fireauth: AngularFireAuth, private router: Router, private database: AngularFireDatabase) { }


  // login
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then((res) => {
      const uid = res.user?.uid;
      const userRef = this.database.object(`users/${uid}`);
      userRef.valueChanges().subscribe((userData: any) => {
        // Do something with the user's data
        const data = userData;
        if (data != null) {
         
            localStorage.setItem('token', 'true');
            localStorage.setItem('type', data.type);
            localStorage.setItem('uid', uid);
            this.router.navigate(['/dashboard']);

        }else {
            alert('Login failed');
        }
      });

    }, err => {
      alert('something went wrong');
      this.router.navigate(['/login']);
    })
  }

logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('uid');
    this.router.navigate(['/login']);
}

getUserId() {
    return this.fireauth.currentUser;
  }
  
}