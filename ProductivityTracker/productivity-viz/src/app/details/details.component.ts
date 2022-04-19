import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service/api-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  loading: any = true;

  public githubData: any = []
  public firebaseData = [];

  public selectedRepo = "";
  public selectedMetric = "commits";
  public selectedRepoData: any = [];

  constructor(private ApiService: ApiServiceService) { }

  async ngOnInit() {
    this.githubData = await this.getRepoData();
    this.firebaseData = await this.ApiService.getFirebaseData();
    this.loading = false;
  }

  private async getRepoData() {
    const allRepos = await this.ApiService.getCommitData();

    let allRepoCommits: any = [];

    for await (const repo of allRepos){
      let commits: any = []
      for await(const branch of repo.value){
        for await(const commit of branch){
          if(this.ApiService.isUserCommit(commit)){
            const commitTimestamp = new Date(commit.commit.author.date)
            const date = `0${commitTimestamp.getMonth() + 1}-${commitTimestamp.getDate()}-${commitTimestamp.getFullYear()}`
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
            this.ApiService.pushData(repo.key, date, commits[date])
          }
        }
      }
      allRepoCommits.push({key: repo.key, value: commits})
    }
    return await allRepoCommits;
  }

  public repoList(){
    return Object.keys(this.githubData);
  }
  
  public onSelectRepo(repoName: any){
    this.selectedRepo = repoName;
    this.selectedRepoData = [];

    for(const repo of this.githubData){
      if(repo.key === repoName){
        const dates = Object.keys(repo.value)
        const commits = repo.value;
        for(const date of dates){
          if(this.selectedMetric === "commits"){
            this.selectedRepoData.push({date: date, value: commits[date].commits})
          }
          else if(this.selectedMetric === "adds"){
            this.selectedRepoData.push({date: date, value: commits[date].stats.additions})
          }
          else if(this.selectedMetric === "deletes"){
            this.selectedRepoData.push({date: date, value: commits[date].stats.deletions})        
          }
          else if(this.selectedMetric === "addsAndDeletes"){
            this.selectedRepoData.push({date: date, value: commits[date].stats.total})      
          }
        }
      }
    }
  }

  public onSelectMetric(metric: any){
    this.selectedMetric = metric;
    this.onSelectRepo(this.selectedRepo);
  }

}
