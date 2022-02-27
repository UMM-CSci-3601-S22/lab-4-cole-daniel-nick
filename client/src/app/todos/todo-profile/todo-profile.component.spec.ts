import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { Todo } from '../todo';
import { TodoCardComponent } from '../todo-card.component';
import { TodoService } from '../todo.service';

import { TodoProfileComponent } from './todo-profile.component';

describe('TodosProfileComponent', () => {
  let component: TodoProfileComponent;
  let fixture: ComponentFixture<TodoProfileComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule
      ],
      declarations: [TodoProfileComponent, TodoCardComponent],
      providers: [
        { provide: TodoService, useValue: new MockTodoService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific todo profile', () => {
    const expectedTodo: Todo = MockTodoService.testTodos[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `TodoProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedTodo._id });

    expect(component.id).toEqual(expectedTodo._id);
    expect(component.todo).toEqual(expectedTodo);
  });

  it('should navigate to correct todo when the id parameter changes', () => {
    let expectedTodo: Todo = MockTodoService.testTodos[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `TodoProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedTodo._id });

    expect(component.id).toEqual(expectedTodo._id);

    // Changing the paramMap should update the displayed todo profile.
    expectedTodo = MockTodoService.testTodos[1];
    activatedRoute.setParamMap({ id: expectedTodo._id });

    expect(component.id).toEqual(expectedTodo._id);
  });

  it('should have `null` for the todo for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a todo, we expect the service
    // to return `null`, so we would expect the component's todo
    // to also be `null`.
    expect(component.id).toEqual('badID');
    expect(component.todo).toBeNull();
  });
});
