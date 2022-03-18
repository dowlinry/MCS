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

  public getCommitData(){
    this.repos.forEach((repo: any) => {
      this.octokit.rest.repos.listCommits({
        owner: this.githubUsername,
        repo: repo.name,
      }).then(console.log)
    })
  }

  public getFirebaseData(){}
}
