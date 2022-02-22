import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, UserRole } from './user';
import { UserService } from './user.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: []
})

export class UserListComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredUsers: User[];
  public filteredUsers: User[];

  public userName: string;
  public userAge: number;
  public userRole: UserRole;
  public userCompany: string;
  public viewType: 'card' | 'list' = 'card';
  getUsersSub: Subscription;
  ageSubject = new Subject<number>();
  age: number;

  // Inject the UserService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.

  constructor(private userService: UserService) {
    this.ageSubject.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(age => {
        this.userAge = age;
        this.getUsersFromServer();
      });
  }

  getUsersFromServer(): void {
    console.log('Calling getUsersFromServer()');
    // this.unsub();
    this.getUsersSub = this.userService.getUsers({
      role: this.userRole,
      age: this.userAge
    }).subscribe(returnedUsers => {
      this.serverFilteredUsers = returnedUsers;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredUsers = this.userService.filterUsers(
      this.serverFilteredUsers, { name: this.userName, company: this.userCompany });
  }

  /**
   * Starts an asynchronous operation to update the users list
   *
   */
  ngOnInit(): void {
    this.getUsersFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getUsersSub) {
      this.getUsersSub.unsubscribe();
    }
  }
}
