import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'app/user-data.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  sub = "District";
  data$: Observable<any[]>;
  usertoShow = "coordinator";
  self: string = "";
  uid: string = "";

  constructor(
    public db: AngularFireDatabase,
    public userdata: UserDataService,
    auth: AngularFireAuth,
    private route: ActivatedRoute
  ) {
    auth.user.subscribe(dataL => {
      this.uid = localStorage.getItem('uid');
      this.db.object<User1>("users/" + localStorage.getItem('uid')).valueChanges().subscribe(data => {
        this.self = data.type;
        console.log("hit" + this.self);
        this.self = localStorage.getItem('type');

        if (this.self == "state") {
          this.sub = "district";
        } else if (this.self == "district") {
          this.sub = "coordinator";
        } else if (this.self == "coordinator") {
          this.sub = "student";
        }

        // Create a reference to the data$ observable
        let data$: Observable<any[]>;

        if (
          this.route.snapshot.paramMap.get('sub') == "state" ||
          this.route.snapshot.paramMap.get('sub') == "district" ||
          this.route.snapshot.paramMap.get('sub') == "student" ||
          this.route.snapshot.paramMap.get('sub') == "coordinator"
        ) {
          if (this.route.snapshot.paramMap.get('sub') == "state") {
            this.sub = "district";
          } else if (this.route.snapshot.paramMap.get('sub') == "district") {
            this.sub = "coordinator";
          } else if (this.route.snapshot.paramMap.get('sub') == "coordinator") {
            this.sub = "student";
          }
          data$ = this.db.list(this.sub, ref => ref.orderByChild('parentID').equalTo(this.route.snapshot.paramMap.get('uid'))).valueChanges();
        } else {
          data$ = this.db.list(this.sub, ref => ref.orderByChild('parentID').equalTo(localStorage.getItem('uid'))).valueChanges();
        }

        // Use the pipe operator to handle errors and replace null/empty result
        this.data$ = data$.pipe(
          catchError(error => {
            console.error(error);
            // Return an array with an empty object having the expected properties
            console.log("error");
            return of([{ firstName: '', lastName: '', email: '' }]);
          })
        );
      });
    });
  }
  ngOnInit() {
  }
}

interface User1 {
  email: string;
  password: string;
  type: string;
}
