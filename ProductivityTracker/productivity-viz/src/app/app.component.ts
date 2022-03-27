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
  loading = true;

  constructor(private ApiService: ApiServiceService){}

  async ngOnInit() {
    this.getData();
  }

  private async getRepoData(repo: any) {
    console.log("Getting commit data")
    let commits: any = []
    const data = await this.ApiService.getCommitData(repo);
    for await(const branch of data){
      for await(const commit of branch){
        const commitTimestamp = new Date(commit.commit.author.date)
        const date = `${commitTimestamp.getDate()}/${commitTimestamp.getMonth() + 1}/${commitTimestamp.getFullYear()}`

        if(commits[date]){
          commits[date] = { 
            stats: {
              additions: commits[date].stats.additions + commit.stats.additions,
              deletions: commits[date].stats.deletions + commit.stats.deletions,
              total: commits[date].stats.total + commit.stats.total,
            },
            commits: commits[date].commits + 1
          }
        }
        else{
          commits[date] = { 
            stats: commit.stats,
            commits: 1
          }
        }
      }
    }
    return await commits;
  }

  private async getData(){
    this.githubData = await this.getRepoData("MCS");
    this.firebaseData = await this.ApiService.getFirebaseData();
    this.loading = false;
  }
}
