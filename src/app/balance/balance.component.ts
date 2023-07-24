import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-balance',
    templateUrl: './balance.component.html',
    styleUrls: ['./balance.component.css']
})

export class BalanceComponent implements OnInit {
    balance = 0;
    uid;
    amount = 0;
    data$;
    constructor(public db: AngularFireDatabase) {

    }
    ngOnInit(): void {

        this.data$ = this.db.list("users/"+localStorage.getItem("uid")+"/transactions").valueChanges().pipe(
            map((transactions: any[]) => transactions.reverse())
          );
          

        this.db.object<any>("users/" + localStorage.getItem("uid")).valueChanges().subscribe(data => {
            this.balance = data.balance;
        })
    }

    addBalance() {
    
        this.db.object<any>("users/" + this.uid).valueChanges().pipe(take(1)).subscribe(data => {
            alert("uid "+this.uid + "\n" + ""+data.parentId)
        
            if(data.parentId == localStorage.getItem("uid")) {
                this.db.object<any>("users/" + localStorage.getItem("uid")).valueChanges().pipe(take(1)).subscribe(data => {
                    this.balance = data.balance-this.amount;

                    this.db.object<any>("users/" + localStorage.getItem('uid')).update({ balance: this.balance });
                    this.db.object<any>("users/" + this.uid).valueChanges().pipe(take(1)).subscribe(data => {
                        let bal = parseInt(data.balance)+(this.amount);
                        this.db.object<any>("users/" + this.uid).update({ balance: bal });
                        this.db.list<any>("users/" + localStorage.getItem("uid")+"/transactions")
                                    .push({"amount": this.amount, "uid": this.uid,"email":data.email})
                                    this.uid = " ";
                                    this.amount= 0;
                    });

                })
            } else {
                alert("wrong user or not a member of your team");
            }
        });
        
    }
}