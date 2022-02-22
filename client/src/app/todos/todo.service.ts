import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';

@Injectable()
export class TodoService {
  // todos server api url:
  readonly todoURL: string = environment.apiUrl + 'todos';

  // Inject an HttpClient
  constructor(private httpClient: HttpClient) { }

  // Get the todos from the server, filtered by the information on the filters map
  getTodos(filters?: {category?: string; status?: boolean }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      // not working
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      // working
      if (filters.status) {
        httpParams = httpParams.set('status', filters.status);
      }
    }
    // Send the HTTP GET request with the given URL and parameters.
    return this.httpClient.get<Todo[]>(this.todoURL, {
      params: httpParams,
    });
  }

  // Get Todo with specified ID
  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoURL + '/' + id);
  }

  // Get Todos by filtering todos with a specified filter
  filterTodos(todos: Todo[], filters: { owner?: string; body?: string; limit?: number }): Todo[] {
    let filteredTodos = todos;

    // working
    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.owner.toLowerCase().indexOf(filters.owner) !== -1);
    }

    // working
    if (filters.body) {
      filters.body = filters.body.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }

    // working
    if (filters.limit) {
      filteredTodos = filteredTodos.slice(0, filters.limit);
    }

    return filteredTodos;
  }
}

