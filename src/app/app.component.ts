import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './shaired/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  itemsRef: AngularFireList<any>;
  items$: Observable<any[]>;
  isLogin = false;
  email
  password
  loginErrorMessage
  constructor(private db: AngularFireDatabase,public authf:AngularFireAuth,public auth:AuthService,public rout:Router) {

   
    this.itemsRef = db.list('items');
  }
  
  login() {
    
      if(this.email == ''){
        alert('please enter all values');
        return;
      }
      if(this.password == ''){
        alert('please ent password');
      return
      }
      this.auth.login(this.email,this.password);
      this.email='';
      this.password='';
  
  }


  getItemsByCategory(category: string) {
    this.items$ = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes
          .map(c => ({ key: c.payload.key, ...c.payload.val() }))
          .filter(item => item.category === category)
      )
    );

    this.items$.subscribe(items => console.log(items));
  }
  ngOnInit(): void {
    setInterval(() => {
      if(localStorage.getItem('uid') ==null) {
        this.rout.navigate(['login']);
        this.isLogin = false;
        }else {
          this.isLogin = true;
        }
    }, 500);

    console.log( "data"+ localStorage.getItem('uid'));
   
    this.getItemsByCategory("electronics");

  }
}
