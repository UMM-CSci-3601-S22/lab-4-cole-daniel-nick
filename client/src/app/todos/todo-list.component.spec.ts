import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockTodoService } from '../../testing/todo.service.mock';
import { Todo } from './todo';
import { TodoCardComponent } from './todo-card.component';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';


const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

// The `TodoListComponent` being tested
let todoList: TodoListComponent;

// This constructs the `todoList` (declared
// above) that will be used throughout the tests.
// This is called in a `beforeEach()` in each of the
// `describe()` sections below.
async function constructTodoList() {
    // Compile all the components in the test bed
  // so that everything's ready to go.
  await TestBed.compileComponents();
  // Create a fixture of the TodoListComponent. That
  // allows us to get an instance of the component
  // (todoList, below) that we can control in
  // the tests.
  const fixture = TestBed.createComponent(TodoListComponent);
  todoList = fixture.componentInstance;
  // Tells Angular to sync the data bindings between
  // the model and the DOM. This ensures, e.g., that the
  // `todoList` component actually requests the list
  // of todos from the `MockTodoService` so that it's
  // up to date before we start running tests on it.
  fixture.detectChanges();
}

describe('TodoListComponent', () => {
  // Set up the `TestBed` so that it uses
  // a `MockTodoService` in place of the real `TodoService`
  // for the purposes of the testing. We also have to include
  // the relevant imports and declarations so that the tests
  // can find all the necessary parts.
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [TodoListComponent, TodoCardComponent],
      // providers:    [ TodoService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      // This MockerTodoService is defined in client/testing/todo.service.mock.
      providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    });
  });

  // Construct the `todoList` used for the testing in the `it` statements
  // below.
  beforeEach(waitForAsync(constructTodoList));

  it('contains all the todos', () => {
    expect(todoList.serverFilteredTodos.length).toBe(3);
  });

  it('contains a todo with category "Camp Task"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.category === 'Camp Task')).toBe(true);
  });

  it('contains a todo with category "Homework"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.category === 'Homework')).toBe(true);
  });

  it('doesn\'t contain a todo with category "World Domination"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.category === 'World Domination')).toBe(false);
  });

  it('has two todos that are incomplete', () => {
    expect(todoList.serverFilteredTodos.filter((todo: Todo) => todo.status === false).length).toBe(2);
  });
});
