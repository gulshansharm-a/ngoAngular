import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  constructor(private db: AngularFireDatabase,public authf:AngularFireAuth) {

    authf.currentUser.then(user =>  {
         if(    user.uid != null ) { 
             this.isLogin = true;
         }else {
             this.isLogin  = false;
         }
    })
  
    this.itemsRef = db.list('items');
  }
  login() {
    this.authf.signInWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        // Login successful
        console.log('Login successful!', userCredential.user);
        this.authf.currentUser.then(user =>  {
          if(    user.uid != null ) { 
              this.isLogin = true;
              this.loginErrorMessage = user.uid;
          }else {
              this.isLogin  = false;
          }
     })
   
      })
      .catch((error) => {
        // Login failed
        this.loginErrorMessage = 'Invalid credentials. Please try again.';
        console.error('Login error:', error);
      });
  }


  getItemsByCategory(category: string) {
    // Use snapshotChanges() with query methods to filter items based on the "category" property
    this.items$ = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes
          .map(c => ({ key: c.payload.key, ...c.payload.val() }))
          .filter(item => item.category === category)
      )
    );

    // Subscribe to the items$ observable to get the data and log it to the console
    this.items$.subscribe(items => console.log(items));
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authf.currentUser.then(user =>  {
      if(    user.uid != null ) { 
          this.isLogin = true;
      }else {
          this.isLogin  = false;
      }
 })
    this.getItemsByCategory("electronics");

  }
}
