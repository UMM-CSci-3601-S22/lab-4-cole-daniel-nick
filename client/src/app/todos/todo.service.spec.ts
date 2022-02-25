import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  // Todos for testing
  const testTodos: Todo[] = [
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

  let todoService: TodoService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getTodos()', () => {

    it('calls `api/todos` when `getTodos()` is called with no parameters', () => {
      // Make sure we're getting our (unfiltered) testUsers when
      // getTodos() is called sin params.
      todoService.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(todoService.todoURL);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testTodos);
    });
  });

  describe('Calling getTodos() with parameters correctly forms the HTTP request', () => {

    it('correctly calls api/todos with filter parameter \'status\'', () => {
      todoService.getTodos({ status: true }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the status parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoURL) && request.params.has('status')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the status parameter was 'complete'
      expect(req.request.params.get('status')).toEqual('true');

      req.flush(testTodos);
    });

    it('correctly calls api/todos with filter parameter \'category\'', () => {

      todoService.getTodos({ category: 'Homework' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the role parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoURL) && request.params.has('category')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the category parameter was 'Homework'
      expect(req.request.params.get('category')).toEqual('Homework');

      req.flush(testTodos);
    });

    it('correctly calls api/todos with multiple filter parameters', () => {

      todoService.getTodos({ status: true, category: 'Dog Stuff' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the role parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoURL)
          && request.params.has('category') && request.params.has('status')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the parameters are correct
      expect(req.request.params.get('status')).toEqual('true');
      expect(req.request.params.get('category')).toEqual('Dog Stuff');

      req.flush(testTodos);
    });
  });

  //
  describe('getTodoByID()', () => {
    it('calls api/todos/id with the correct ID', () => {
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      todoService.getTodoById(targetId).subscribe(
        todo => expect(todo).toBe(targetTodo)
      );

      const expectedUrl: string = todoService.todoURL + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });

  describe('filterUsers()', () => {

    it('filters by owner', () => {
      const todoOwner = 'i';
      const filteredTodos = todoService.filterTodos(testTodos, { owner: todoOwner });
      // There should be one todo with an 'i' in the
      // owner: Daniel.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo's owner's name should contain an 'i'.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by body', () => {
      const todoBody = 'work';
      const filteredTodos = todoService.filterTodos(testTodos, { body: todoBody });
      // There should be just one todo that has a body that contains work.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo's body should contain 'work'.
      filteredTodos.forEach(todo => {
        expect(todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
      });
    });

    it('limits the amount of todos shown', () => {
      const todoLimit = 2;
      const filteredTodos = todoService.filterTodos(testTodos, { limit: todoLimit });
      // There should be 2 todo when limit is set to 2
      expect(filteredTodos.length).toBe(2);
    });

    it('filters by multiple parameters', () => {
      // There's only one todo (arthur_id) whose owner
      // contains an 'u' and whose body contains
      // an 'or'. There are two whose owner contains
      // an 'u' and two whose body contains an
      // an 'or', so this should test combined filtering.
      const todoOwner = 'u';
      const todoBody = 'or';
      const filters = { owner: todoOwner, body: todoBody };
      const filteredTodos = todoService.filterTodos(testTodos, filters);
      // There should be just one todo with these properties.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo should have both of these properties.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
        expect(todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
