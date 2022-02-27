import { Component, Input } from '@angular/core';
import { Todo } from './todo';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss']
})
export class TodoCardComponent {

  @Input() todo: Todo;
  @Input() simple?: boolean = false;
}
