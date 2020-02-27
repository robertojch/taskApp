import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private vUser: User;
  private vToken: string;
  constructor(private http: HttpClient) { }

  public get user(): User {

    if (this.vUser != null) {
      return this.vUser;
    } else if (this.vUser == null && sessionStorage.getItem('user') != null) {
      this.vUser = JSON.parse(sessionStorage.getItem('user')) as User;
      return this.vUser;
    }
    return new User();
  }

  public get token(): string {
    if (this.vToken != null) {
      return this.vToken;
    } else if (this.vToken == null && sessionStorage.getItem('token') != null) {
      this.vToken = sessionStorage.getItem('token');
      return this.vToken;
    }
    return null;
  }

  login(user: User): Observable<any> {
    const urlEndPoint = environment.apioauth;

    const credentials = btoa('taskApp:12345');
    const httpHeaders = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credentials
    });

    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', user.username);
    params.set('password', user.password);
    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  getInfoToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  saveUser(accessToken: string): void {
    const payload = this.getInfoToken(accessToken);
    this.vUser = new User();
    this.vUser.nombre = payload.nombre;
    this.vUser.username = payload.user_name;
    this.vUser.roles = payload.authorities;
    sessionStorage.setItem('user', JSON.stringify(this.vUser));
  }

  saveToken(accessToken: string): void {
    this.vToken = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  isAuthenticated(): boolean {
    const payload = this.getInfoToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (this.user.roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this.vToken = null;
    this.vUser = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }

}
