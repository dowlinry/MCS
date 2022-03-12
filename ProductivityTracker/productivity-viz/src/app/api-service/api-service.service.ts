import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  firebaseURL: any = "ewq";
  accessToken: any = "dqw9";
  githubUsername: any;

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
    return this.http.get(`https://api.github.com/users/${this.githubUsername}/events`);
  }

  public getFirebaseData(){}
}
