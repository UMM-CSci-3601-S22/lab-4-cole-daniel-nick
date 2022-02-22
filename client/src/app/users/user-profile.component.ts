import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  user: User;
  id: string;
  getUserSub: Subscription;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested user.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getUserSub) {
        this.getUserSub.unsubscribe();
      }
      this.getUserSub = this.userService.getUserById(this.id).subscribe(user => this.user = user);
    });
  }

  ngOnDestroy(): void {
    if (this.getUserSub) {
      this.getUserSub.unsubscribe();
    }
  }

}
