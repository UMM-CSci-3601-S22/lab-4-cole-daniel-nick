import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-profile',
  templateUrl: './todo-profile.component.html',
  styleUrls: ['./todo-profile.component.scss']
})
export class TodoProfileComponent implements OnInit, OnDestroy {

  todo: Todo;
  id: string;
  getTodoSub: Subscription;

  constructor(private route: ActivatedRoute, private todoService: TodoService) { }

  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested todo.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getTodoSub) {
        this.getTodoSub.unsubscribe();
      }
      this.getTodoSub = this.todoService.getTodoById(this.id).subscribe(todo => this.todo = todo);
    });
  }

  ngOnDestroy(): void {
    if (this.getTodoSub) {
      this.getTodoSub.unsubscribe();
    }
  }

}
