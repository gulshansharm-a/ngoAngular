import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  public self: string = "";
  public sub: string = "";

  constructor(public auth: AngularFireAuth, public db: AngularFireDatabase) {

    this.auth.user.subscribe(data => {
      this.db.object<User1>("users").valueChanges().subscribe(data => {
        this.self = data.type;
        console.log("hit" + this.self);

        // Move the if-else logic inside the subscribe block
        if (this.self == "state") {
          this.sub = "district";
        } else if (this.self == "district") {
          this.sub = "coordinator";
        } else if (this.self == "coordinator") {
          this.sub = "student";
        }
      });
    });

  }

  ngOnInit(): void {
    
  }
}

interface User1 {
  email: string;
  password: string;
  type: string;
}
