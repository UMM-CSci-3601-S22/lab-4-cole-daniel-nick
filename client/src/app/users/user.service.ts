import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserRole } from './user';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  readonly userUrl: string = environment.apiUrl + 'users';

  constructor(private httpClient: HttpClient) {
  }

  getUsers(filters?: { role?: UserRole; age?: number; company?: string }): Observable<User[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.role) {
        httpParams = httpParams.set('role', filters.role);
      }
      if (filters.age) {
        httpParams = httpParams.set('age', filters.age.toString());
      }
      if (filters.company) {
        httpParams = httpParams.set('company', filters.company);
      }
    }
    return this.httpClient.get<User[]>(this.userUrl, {
      params: httpParams,
    });
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(this.userUrl + '/' + id);
  }

  filterUsers(users: User[], filters: { name?: string; company?: string }): User[] {

    let filteredUsers = users;

    // Filter by name
    if (filters.name) {
      filters.name = filters.name.toLowerCase();

      filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().indexOf(filters.name) !== -1);
    }

    // Filter by company
    if (filters.company) {
      filters.company = filters.company.toLowerCase();

      filteredUsers = filteredUsers.filter(user => user.company.toLowerCase().indexOf(filters.company) !== -1);
    }

    return filteredUsers;
  }

  addUser(newUser: User): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{id: string}>(this.userUrl, newUser).pipe(map(res => res.id));
  }
}
