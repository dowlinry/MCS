import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service/api-service.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  githubData: any[] = [];
  firebaseData: any[] = [];

  constructor(private ApiService: ApiServiceService) { }

  ngOnInit(): void {
    this.getFirebaseData();
  }

  getFirebaseData(){
    
  }

  getCommitData(){

  }

}
