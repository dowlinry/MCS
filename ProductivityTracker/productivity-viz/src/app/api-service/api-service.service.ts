import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Octokit } from '@octokit/rest';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

import config from 'assets/config';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private githubUsername: any;
  private repos: any = config.repos;
  private firebaseData!: AngularFireList<any>;
  private firebaseRef!: AngularFireList<any>

  constructor(private firebase: AngularFireDatabase) { }

  private octokit: any;

  public async verifyUser(username: any, accessToken: any){
    this.octokit = new Octokit({
      auth: accessToken
    })


    return await this.octokit.request('GET /user')
    .then((response: any) => {
      if(response.data.login === username){
        this.githubUsername = username;
        this.firebaseData = this.firebase.list(`${username}/PhysicalActivityData`);
        this.firebaseRef = this.firebase.list(`${username}`);
        return true;
      }
      else return "Invalid username or access token";
    })
    .catch((err: any) => {
      return "An error had occured, please try again";
    })
    
  }

  public getRepos(){
    return this.repos;
  }
  public async getCommitData(){
    const repos = await this.getUsersRepos();


    let allRepoCommits = repos.map(async(repo: any) => {
      const repoCommits = await this.getRepoCommits(repo);
      return {key: repo, value: repoCommits}
    })
    
    return await allRepoCommits;
  }

  private async getRepoCommits(repo: any){
    const branches: any = await this.getBranches(repo);

    let repoCommits = branches.data.map(async (branch: any) => {
      const commits: any = await this.getBranchCommits(repo, branch)
      let commitsDetails = commits.data.map(async (commit: any) => {
          const details = await this.getCommitDetails(commit, repo);
          
          return await details;
      })
      return await commitsDetails
    })
    return await repoCommits;
  }
  

  private async getUsersRepos(){
    const repos = await this.octokit.request('GET /user/repos')

    let usersRepos: any = [];

    for await(const repo of repos.data){
      if(repo.owner.login === this.githubUsername){
        usersRepos.push(repo.name)
      }
    }
    return await usersRepos;
  }

  private async getBranches(repo: any){
    const branches = await this.octokit.rest.repos.listBranches({
      owner: this.githubUsername,
      repo: repo,
    })
    .catch((err: any) => {
      return "Error"
    })

    return await branches;
  }

  private async getBranchCommits(repo: any, branch: any){
    return await this.octokit.rest.repos.listCommits({
      owner: this.githubUsername,
      repo: repo,
      sha: branch.name
    })
  }

  public isUserCommit(commit: any){
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

  public async getFirebaseData(){
    let data: any = []
    this.firebaseData.snapshotChanges().pipe(
      map(changes => {
        changes.map(async (c: any) => {
          //data[await c.payload.key] = await c.payload.val();
          data.push({date: await c.payload.key, value: await c.payload.val().value})
        })
      })
    ).subscribe();

    return await data;
  }

  public async pushData(repo: any, date: any, data: any) {
    this.firebaseRef.set(`EngineeringData/${repo}/${date}`, {data})
  }
}
