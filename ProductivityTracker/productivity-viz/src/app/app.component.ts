import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './api-service/api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'productivity-viz';

  githubData = [];
  firebaseData = [];

  loggedIn = false;

  constructor(private ApiService: ApiServiceService){}

  ngOnInit() {
  }

  public login(event: any){
    this.loggedIn = true;
  }

}
