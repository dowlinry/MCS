import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service/api-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private ApiService: ApiServiceService) { }

  ngOnInit(): void {
    
  }

  // accessTokenInput(value: string){
  //   this.ApiService.setAccessToken(value);
  //   alert("Access Token has been set as: " + this.ApiService.accessToken);
  // }

  // firebaseUrlInput(value: string){
  //   this.ApiService.setFirebaseURL(value);
  //   alert("Firebase URL has been set as: " + this.ApiService.firebaseURL);
  // }

  // githubUsernameInput(value: string){
  //   this.ApiService.setUsername(value);
  //   alert("Github username has been set as: " + this.ApiService.githubUsername);
  // }
}
