import { Component } from '@angular/core';
import { ApiServiceService } from './api-service/api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'productivity-viz';

  constructor(private ApiService: ApiServiceService){}

  // public graphAvailable(){
  //   if(this.ApiService.accessToken && this.ApiService.firebaseURL && this.ApiService.githubUsername){
  //     return true;
  //   }
  //   else return false;
  // }
}
