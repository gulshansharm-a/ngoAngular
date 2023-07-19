import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { UserDataService } from 'app/user-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
sub = "District";
data$: Observable<any[]>;
usertoShow = "coordinator"
self :string = "";
  constructor(public db: AngularFireDatabase,public userdata:UserDataService,auth:AngularFireAuth) {
    auth.user.subscribe(dataL => {
      this.db.object<User1>("users/"+dataL.uid).valueChanges().subscribe(data => {
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

        this.data$ = this.db.list(this.sub, ref => ref.orderByChild('parentID').equalTo(dataL.uid)).valueChanges();

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
