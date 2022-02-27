import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

/**
 * A "mock" version of the `UserService` that can be used to test components
 * without having to create an actual service.
 */
// It needs to be `Injectable` since that's how services are typically
// provided to components.
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: 'arthur_id',
      owner: 'Arthur',
      category: 'Camp Task',
      status: false,
      body: 'Dutch needs more money'
    },
    {
      _id: 'daniel_id',
      owner: 'Daniel',
      category: 'Homework',
      status: false,
      body: 'Need to work on lab 3'
    },
    {
      _id: 'lucy_id',
      owner: 'Lucy',
      category: 'Dog Stuff',
      status: true,
      body: 'Think dog thoughts'
    }
  ];

  constructor() {
    super(null);
  }

  getTodos(filters?: { category?: string; status?: boolean }): Observable<Todo[]> {
    return of(MockTodoService.testTodos);
  }

  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for the first test todo,
    // return that todo, otherwise return `null` so
    // we can test illegal todo requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }

}
