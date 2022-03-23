import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service/api-service.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  private firebaseData: any[] = [];

  private githubData: any[] = [];
  private repos: any[] = [];

  private currentRepo: any = "";
  private currentRepoData: any = [];

  constructor(private ApiService: ApiServiceService) { }

  async ngOnInit() {
    await this.getGithubData();
  }

  private getFirebaseData(){
    
  }

  private async getGithubData() {
    console.log("Getting commit data")
    const data = await this.ApiService.getCommitData();
    for await(const repo of data){
      console.log(repo)
      // for await(const branch of repo){
      //   console.log(await branch)
      // }
    }
    // return await githubData;
  }

  private async getRepoData(repo: any){
  }

  

}
