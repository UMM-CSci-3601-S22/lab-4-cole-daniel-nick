import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserRole } from './user';
import { UserService } from './user.service';

/**
 * A component that displays a list of users, either as a grid
 * of cards or as a vertical list.
 *
 * The component supports local filtering by name and/or company,
 * and remote filtering (i.e., filtering by the server) by
 * role and/or age. These choices are fairly arbitrary here,
 * but in "real" projects you want to think about where it
 * makes the most sense to do the filtering.
 */
@Component({
  selector: 'app-user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: []
})
export class UserListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredUsers: User[];
  public filteredUsers: User[];

  public userName: string;
  public userAge: number;
  public userRole: UserRole;
  public userCompany: string;
  public viewType: 'card' | 'list' = 'card';

  /**
   * This constructor injects both an instance of `UserService`
   * and an instance of `MatSnackBar` into this component.
   *
   * @param userService the `UserService` used to get users from the server
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(private userService: UserService, private snackBar: MatSnackBar) {
    // Nothing here – everything is in the injection parameters.
  }

  /**
   * Get the users from the server, filtered by the role and age specified
   * in the GUI.
   */
  getUsersFromServer() {
    this.userService.getUsers({
      role: this.userRole,
      age: this.userAge
    }).subscribe(returnedUsers => {
      // This inner function passed to `subscribe` will be called
      // when the `Observable` returned by `getUsers()` has one
      // or more values to return. `returnedUsers` will be the
      // name for the array of `Users` we got back from the
      // server.
      this.serverFilteredUsers = returnedUsers;
      this.updateFilter();
    }, err => {
      // If there was an error getting the users, log
      // the problem and display a message.
      console.error('We couldn\'t get the list of users; the server might be down');
      this.snackBar.open(
        'Problem contacting the server – try again',
        'OK',
        // The message will disappear after 3 seconds.
        { duration: 3000 });
    });
  }

  /**
   * Called when the filtering information is changed in the GUI so we can
   * get an updated list of `filteredUsers`.
   */
  public updateFilter() {
    this.filteredUsers = this.userService.filterUsers(
      this.serverFilteredUsers, { name: this.userName, company: this.userCompany }
    );
  }

  /**
   * Starts an asynchronous operation to update the users list
   */
  ngOnInit(): void {
    this.getUsersFromServer();
  }
}
