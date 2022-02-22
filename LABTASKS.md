# Lab Tasks <!-- omit in toc -->

- [Getting started](#getting-started)
- [Exploring the project](#exploring-the-project)
- [Overview of the lab](#overview-of-the-lab)
  - [Features to implement](#features-to-implement)
- [Workflow and Continuous Integration](#workflow-and-continuous-integration)
- [Writing todos to the Database](#writing-todos-to-the-database)
- [Display todos](#display-todos)

## Getting started

- Remember to set up ZenHub with your stories and estimates
- Turn in the URL of the GitHub repository for your group in Canvas. This will make it easier for us to figure out which team is "Snoozing Llamas".

Definitely ask if you're ever confused about what you need to do for a given task.

:warning: Make sure you fix your badges and enable the
quality checks as described in
[CODE_QUALITY_CHECKS](./CODE_QUALITY_CHECKS.md).

## Exploring the project

The structure of this project should be nearly identical to that of lab 3, and as such there really isn't much excitement in that department.

The server is, for the most part, the same as it has been in the past two labs. The difference to look for here is in how the server gets the data it sends out in reply to requests.

Spend some time looking over the project with these questions in mind. (Unlike the previous labs, however, you do _not_ need to write up and turn in your answers to these questions.)

1. What do we do in the `Server` and `UserController` constructors
   to set up our connection to the development database?
1. How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. How do we retrieve all the users with a given age
   in `UserController.getUsers(Context...)`? What's the role of
   the variable `filters` in that method?
1. What is happening in the `UserControllerSpec.setUpEach()` method?
1. What's being tested in `UserControllerSpec.GetUsersByAge()`?
   How is that test implemented?
1. Follow the process for adding a new user. What role does `UserController` play in the process?

## Overview of the lab

- Re-implement the todo API, this time pulling data from MongoDB rather than from a flat JSON file. The new elements of this lab are primarily in the MongoDB interaction, which is mostly in the Java server code.
- When displaying the todos in your Angular front-end, make thoughtful decisions about whether work like filtering
  should be done in Angular or via database queries. For example, have the database filter out all the todos belonging to a single user,
  but let Angular filter by category, body, or status.
- **Do at least some filtering on the database side of things.**

### Features to implement

- Filter todos by status
- Filter todos by owner
- Filter todos by contents of the body
- Filter todos by category
- Ability to add new todos. This requires:
  - An Angular form/page that allows the user to enter the information for a new todo with reasonable controls and validation.
  - A new endpoint on the server that allows clients to add new todos.
  - Logic in the server to add that new todo to the database and return the new ID.
- Testing of all of the above.

## Workflow and Continuous Integration

You should organize your work into features, where each feature is an (small) epic or a single story in ZenHub. Each feature should "slice the cake", including server implementation and testing, Angular implementation and testing, and end-to-end testing.

:warning: Keep the features as small and focussed as
possible. Otherwise things like code reviews become a huge burden,
and pull requests become far less useful.

To maximize your learning, we strongly encourage you to implement features in Angular one at a time instead of copying over
entire components from the previous lab that presumably support numerous features.

Make sure you do frequent commits with useful commit messages.
If you're pair programming (which we definitely recommend!) make
sure include [a co-authorship line in the commit message](https://docs.github.com/en/github/committing-changes-to-your-project/creating-a-commit-with-multiple-authors) so the
person you're working with gets credit. These have the form:

```text
 Co-authored-by: Connie Stewart <conniestewart@ohmnet.com>
```

where you replace the name ("Connie Stewart") and email
("conniestewart@ohmnet.com") with the name and email of the
person you're pairing with.

- As you work, create a branch for a new feature.
  - Write tests for the server actions for the feature you added (run in the server folder using `./gradlew test` or `./gradlew test jacocoTestReport` as described in [README.md](./README.md#testing-the-server)). Then write the server code that makes those tests pass.
  - Write new end-to-end tests for the new views using Cypress. Run
    these in client folder using `ng e2e --watch` as described in [README.md](./README.md#end-to-end-testing)).
  - Write unit tests for the new Angular components you are adding using Karma (run in client folder using `ng test` or `ng test --code-coverage` as described in [README.md](./README.md#testing-the-client)). Then write the Angular code that makes those tests pass.
  - Address failing builds.
- Perform code reviews especially if you're not pair programming.
  _Ask (your partner, the class, the instructor) about things you don't understand!_
- Use pull requests or work together with your lab partner to
  merge things into master when a feature is working
  and is tested (with passing tests and decent coverage).

## Writing todos to the Database

- We have included an example of writing to the database with `addUser` functionality. Add to both the front-end and back-end to make it possible to add todos so that they appear both in your list and in the database.

## Display todos

You should use Angular to display todos in attractive, readable, and useful ways that are helpful for understanding the nature of a todo.

- Use the Angular Material Design tools you've learned about to build a nice interface for
  accessing these APIs:
  - You must use at least two nifty Angular Material features from [here](https://material.angular.io/components/categories)!
  - There are many interesting features and documentation about how to use them - we encourage you to try several
