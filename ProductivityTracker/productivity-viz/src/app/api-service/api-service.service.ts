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

  public getRepos(){
    return this.repos;
  }
  public async getCommitData(repo: any){
    const repoCommits = await this.getRepoCommits(repo);
     
    return await repoCommits;
  }

  private async getRepoCommits(repo: any){
    const branches: any = await this.getBranches(repo);
      
    let repoCommits = branches.data.map(async (branch: any) => {
      const commits: any = await this.getBranchCommits(repo, branch)
        
      let commitsDetails = commits.data.map(async (commit: any) => {
        if(this.isUserCommit(commit)){
          const details = await this.getCommitDetails(commit, repo);
          
          return await details;
        } else return await {};
      })
      return await commitsDetails
    })
    return await repoCommits;
  }
  private async getBranches(repo: any){
    return await this.octokit.rest.repos.listBranches({
      owner: this.githubUsername,
      repo: repo,
    })
  }

  private async getBranchCommits(repo: any, branch: any){
    return await this.octokit.rest.repos.listCommits({
      owner: this.githubUsername,
      repo: repo,
      sha: branch.name
    })
  }

  private isUserCommit(commit: any){
    if(commit.author.login === this.githubUsername){
      return true;
    } else return false;
  }

  private async getCommitDetails(commit: any, repo: any){
    let response = await this.octokit.rest.repos.getCommit({
      owner: this.githubUsername,
      repo: repo,
      ref: commit.sha
    })

    return await response.data;
  }

  public getFirebaseData(){}
}
