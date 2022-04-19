import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiServiceService } from 'app/api-service/api-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() loggedInEvent = new EventEmitter<any>();

  userDetailsForm = this.fb.group({
    username: '',
    accessToken: ''
  })

  constructor(
    private fb: FormBuilder,
    private ApiService: ApiServiceService
    ) { }

  ngOnInit(): void {
  }

  async onSubmit(){
    const verified = await this.ApiService.verifyUser(this.userDetailsForm.value.username, this.userDetailsForm.value.accessToken);
    if(verified === true){
      this.loggedInEvent.emit(true)
    }
    else{
      alert(verified)
    }
  }
}
