import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { AddUserComponent } from './users/add-user.component';
import { TodoListComponent } from './todos/todo-list.component';
import { TodoProfileComponent } from './todos/todo-profile/todo-profile.component';
import { AddTodoComponent } from './todos/add-todo/add-todo.component';

// Note that the `users/new` route needs to come before
// the `users/:id` route. If `users/:id` came first, it
// would accidentally catch the requests to `users/new`;
// the router would just think that the string "new"
// is a user ID.
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: AddUserComponent },
  { path: 'users/:id', component: UserProfileComponent },
  { path: 'todos', component: TodoListComponent },
  { path: 'todos/new', component: AddTodoComponent },
  { path: 'todos/:id', component: TodoProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
