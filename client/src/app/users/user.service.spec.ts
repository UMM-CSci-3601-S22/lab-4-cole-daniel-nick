import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from './user';
import { UserService } from './user.service';

describe('User service: ', () => {
  // A small collection of test users
  const testUsers: User[] = [
    {
      _id: 'chris_id',
      name: 'Chris',
      age: 25,
      company: 'UMM',
      email: 'chris@this.that',
      role: 'admin',
      avatar: 'https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon'
    },
    {
      _id: 'pat_id',
      name: 'Pat',
      age: 37,
      company: 'IBM',
      email: 'pat@something.com',
      role: 'editor',
      avatar: 'https://gravatar.com/avatar/b42a11826c3bde672bce7e06ad729d44?d=identicon'
    },
    {
      _id: 'jamie_id',
      name: 'Jamie',
      age: 37,
      company: 'Frogs, Inc.',
      email: 'jamie@frogs.com',
      role: 'viewer',
      avatar: 'https://gravatar.com/avatar/d4a6c71dd9470ad4cf58f78c100258bf?d=identicon'
    }
  ];
  let userService: UserService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    userService = new UserService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getUsers() calls api/users', () => {
    // Assert that the users we get from this call to getUsers()
    // should be our set of test users. Because we're subscribing
    // to the result of getUsers(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testUsers) a few lines
    // down.
    userService.getUsers().subscribe(
      users => expect(users).toBe(testUsers)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(userService.userUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testUsers);
  });

  it('getUsers() calls api/users with filter parameter \'admin\'', () => {

    userService.getUsers({ role: 'admin' }).subscribe(
      users => expect(users).toBe(testUsers)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(userService.userUrl) && request.params.has('role')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('role')).toEqual('admin');

    req.flush(testUsers);
  });

  it('getUsers() calls api/users with filter parameter \'age\'', () => {

    userService.getUsers({ age: 25 }).subscribe(
      users => expect(users).toBe(testUsers)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(userService.userUrl) && request.params.has('age')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('age')).toEqual('25');

    req.flush(testUsers);
  });

  it('getUsers() calls api/users with multiple filter parameters', () => {

    userService.getUsers({ role: 'editor', company: 'IBM', age: 37 }).subscribe(
      users => expect(users).toBe(testUsers)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(userService.userUrl)
        && request.params.has('role') && request.params.has('company') && request.params.has('age')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameters are correct
    expect(req.request.params.get('role')).toEqual('editor');
    expect(req.request.params.get('company')).toEqual('IBM');
    expect(req.request.params.get('age')).toEqual('37');

    req.flush(testUsers);
  });

  it('getUserById() calls api/users/id', () => {
    const targetUser: User = testUsers[1];
    const targetId: string = targetUser._id;
    userService.getUserById(targetId).subscribe(
      user => expect(user).toBe(targetUser)
    );

    const expectedUrl: string = userService.userUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetUser);
  });

  it('filterUsers() filters by name', () => {
    expect(testUsers.length).toBe(3);
    const userName = 'a';
    expect(userService.filterUsers(testUsers, { name: userName }).length).toBe(2);
  });

  it('filterUsers() filters by company', () => {
    expect(testUsers.length).toBe(3);
    const userCompany = 'UMM';
    expect(userService.filterUsers(testUsers, { company: userCompany }).length).toBe(1);
  });

  it('filterUsers() filters by name and company', () => {
    expect(testUsers.length).toBe(3);
    const userCompany = 'UMM';
    const userName = 'chris';
    expect(userService.filterUsers(testUsers, { name: userName, company: userCompany }).length).toBe(1);
  });

  it('addUser() posts to api/users', () => {

    userService.addUser(testUsers[1]).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(userService.userUrl);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testUsers[1]);

    req.flush({id: 'testid'});
  });
});
