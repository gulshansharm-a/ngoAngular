import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {
  data$
  sub
  constructor(public db:AngularFireDatabase) {

   }

  ngOnInit() {
    this.data$ = this.db.list("student", ref => ref.orderByChild('parentID').equalTo(localStorage.getItem('uid')))
  .valueChanges()
  .pipe(
    map((transactions: any[]) => {
      console.log('Number of transactions: ', transactions.length);
      return transactions.reverse();
    })
  );
  }

}
