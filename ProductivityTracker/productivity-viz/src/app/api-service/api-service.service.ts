import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Octokit } from '@octokit/rest';

import config from 'assets/config';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  
  constructor(private http: HttpClient) { }

  private firebaseURL: any = config.firebaseDatabaseURL;
  private accessToken: any = config.githubAccessToken;
  private githubUsername: any = config.githubUsername;
  private repos: any = config.repos;
  private commits: any = []

  private octokit = new Octokit({
    auth: this.accessToken
  })

  public setFirebaseURL(url: string){
    this.firebaseURL = url;
  }

  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  public setUsername(name: string){
    this.githubUsername = name;
  }

  public async getCommitData(){
    this.repos.forEach(async (repo: any) => {
      const repoCommits = await this.getRepoCommits(repo);
      
      for(const commit of repoCommits){
        const details = await this.getCommitDetails(commit);
        console.log(details);
      }
    })
    
  }

  private async getRepoCommits(repo: any){
      let repoCommits: any  = [];
      const branches: any = await this.getBranches(repo);
      
      branches.data.forEach(async (branch: any) => {
        const commits: any = await this.getBranchCommits(repo, branch)
        
        commits.data.forEach((commit: any) => {
          if(this.isUserCommit(commit)){
            repoCommits[commit.commit.author.date] = commit.commit;
          }
        })
      })

      return await repoCommits;
  }
  private async getBranches(repo: any){
    return await this.octokit.rest.repos.listBranches({
      owner: this.githubUsername,
      repo: repo.name,
    })
  }

  private async getBranchCommits(repo: any, branch: any){
    return await this.octokit.rest.repos.listCommits({
      owner: this.githubUsername,
      repo: repo.name,
      sha: branch.name
    })
  }

  private isUserCommit(commit: any){
    if(commit.author.login === this.githubUsername){
      return true;
    } else return false;
  }

  private sortRepoCommits(commits: any, repo: any){
    const commitTimestamps = Object.keys(commits).sort();
    commitTimestamps.forEach((commit: any) => {
      console.log(commit)
    })
  }

  private async getCommitDetails(commit: any){
    return await commit;
  }

  private async test(x: any){
    console.log(x);
  }
  // private async test(repo: any){
  //   this.http.get(
  //     `https://api.github.com/repos/${this.githubUsername}${repo.name}/branches`,
  //     {
  //       headers:{
  //         authorization: this.accessToken
  //       }
  //     }
  //   ).subscribe(console.log)
  // }

  public getFirebaseData(){}
}
