import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Route } from '@angular/router';
import { UserDataService } from 'app/user-data.service';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userId = "";
  aadharNumber = '';
  email = '';
  firstName = '';
  lastName = '';
  address = '';
  city = '';
  area = '';
  password = "";
  selectedImage: any;
  errorForCreating = "";
  uploadProgress = 0;
  downloadURL = '';
  previousUID = "";
  previousEmail = "";
  previousPassword = "";
  bo: Boolean;
  sub = "";
  self = "";

  constructor(
    public db: AngularFireDatabase,
    private storage: AngularFireStorage,
    public fauth: AngularFireAuth,
    public userdata: UserDataService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.bo = true;
    this.fauth.user.subscribe(dataL => {
      this.db.object<User1>("users/" + dataL.uid).valueChanges().subscribe(data => {
        this.self = data.type;
        console.log("hit" + this.self);

        if (localStorage.getItem("type") == "state") {
          this.sub = "district";
        } else if (localStorage.getItem("type") == "district") {
          this.sub = "coordinator";
        } else if (localStorage.getItem("type") == "coordinator") {
          this.sub = "student";
        }
      });
    });
  }

  uploadFormToDb() {
    const dataOfNewUser = {
      aadharNumber: this.aadharNumber,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      city: this.city,
      area: this.area,
      parentID: this.userId,
      uid: ""
    };

    this.fauth.user.subscribe(dataUser => {
      dataOfNewUser.parentID = localStorage.getItem("uid");
      this.fauth.createUserWithEmailAndPassword(this.email, this.password)
        .then((newuser) => {
          this.db.object<any>('users/' + localStorage.getItem("uid")).valueChanges().pipe(
            take(1) // Add take(1) here to unsubscribe after the first emission
          ).subscribe((data: User1) => { // Provide the correct type for 'data'
           
              this.db.object('users/' + newuser.user.uid).set({ "email": this.email, "password": this.password, "type": this.sub, "balance": 0 ,"parentId":localStorage.getItem('uid')});
              dataOfNewUser.uid = newuser.user.uid;
              if (localStorage.getItem("type") == "state") {
                this.sub = "district";
              } else if (localStorage.getItem("type") == "district") {
                this.sub = "coordinator";
              } else if (localStorage.getItem("type") == "coordinator") {
                this.sub = "student";
              }
              alert("sub"+localStorage.getItem('type'))
              this.db.object(this.sub + "/" + newuser.user.uid).set(dataOfNewUser)
                .then(() => {
                  this.clearForm();
                  this.router.navigate(['/']);
                });
            
          });
        })
        .catch((error) => {
          console.log('Error creating new user:', error);
          this.errorForCreating = error.message;
        });
    });
  }

  clearForm() {
    this.aadharNumber = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.address = '';
    this.city = '';
    this.area = '';
  }

  onFileSelected(event: any, s: String) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.uploadImage(s);
    }
  }

  uploadImage(s: String) {
    if (this.selectedImage) {
      const filePath = `images/${Date.now()}_${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedImage);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.downloadURL = url;
          });
        })
      ).subscribe(
        (percentage: any) => {
          console.log(percentage);
          this.uploadProgress = Math.round((percentage.bytesTransferred / percentage.totalBytes) * 100);
        },
        error => {
          console.log('Error uploading image:', error);
        }
      );
    }
  }
}

interface User1 {
  email: string;
  password: string;
  type: string;
  balance: number;
  // Add other properties as needed
}
