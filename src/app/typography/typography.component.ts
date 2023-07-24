import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {
  
  aadharNumber ="";
  name="";
  fathernmae="";
  mothername="";
  //gender pending
  DOB="";
  school="";
  email="";
  password="";
  mobile="";
  city="";
  area="";
  pincode="";
  village_town="";
  //state=""
  fatherAddhar="";
  fatherDob="";
  motherAadhar="";
  motherDob="";
  fatherPAN="";
  motherPAN="";
  

  second = false;
  
  bo: Boolean;
  sub = "";
  self = "";
  constructor(public fauth:AngularFireAuth,public db:AngularFireDatabase,public router:Router) {
    if(localStorage.getItem("uid")==null) {
      this.router.navigate(['/login']);
    }
   }
  setSecond() {
    this.second = true;
  }
  unsetSecond () {
    this.second = false;
  }
getDataFromFirstForm() {
  
}
  uploadFormToDb() {
      let databig = {
        uid:"",
        aadharNumber: this.aadharNumber,
        name: this.name,
        fathernmae: this.fathernmae,
        mothername: this.mothername,
        DOB: this.DOB,
        school: this.school,
        email: this.email,
        mobile: this.mobile,
        city: this.city,
        area: this.area,
        pincode: this.pincode,
        village_town: this.village_town,
        fatherAddhar: this.fatherAddhar,
        fatherDob: this.fatherDob,
        motherAadhar: this.motherAadhar,
        motherDob: this.motherDob,
        fatherPAN: this.fatherPAN,
        motherPAN: this.motherPAN,
        DOJ:"new Date()",
        parentID: "",
      };

      this.fauth.user.subscribe(dataUser => {
        databig.parentID = localStorage.getItem("uid");
        this.fauth.createUserWithEmailAndPassword(this.email, this.password)
          .then((newuser) => {
            let currentDate = new Date();
            databig.DOJ = currentDate.getDate() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getFullYear();
            databig.uid = newuser.user.uid;
            this.db.object<any>('users/' + localStorage.getItem("uid")).valueChanges().pipe(
              take(1) // Add take(1) here to unsubscribe after the first emission
            ).subscribe((data) => { // Provide the correct type for 'data'
              alert(data); //
                this.db.object('users/' + newuser.user.uid).set({ "email": this.email, "password": this.password, "type": "student" });
                let balance = parseInt(data.balance.toString()) - 300;
                this.db.object('users/' + localStorage.getItem('balance')).update({ "balance": balance });
                data.uid = newuser.user.uid;
                alert("sub"+this.sub)
                this.db.object("student" + "/" + newuser.user.uid).set(databig)
                  .then(() => {
                    this.router.navigate(['/']);
                  });
             
            });
          })
          .catch((error) => {
            console.log('Error creating new user:', error);
          });
      });

  }

  ngOnInit() {
    if(localStorage.getItem("uid")==null) {
      this.router.navigate(['/login']);
    }
  }
}