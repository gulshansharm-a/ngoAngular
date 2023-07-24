import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/shaired/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginErrorMessage
    email
    password
  constructor(public auth:AuthService) { }

  ngOnInit(): void {
  }
    login(){
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
  
}
