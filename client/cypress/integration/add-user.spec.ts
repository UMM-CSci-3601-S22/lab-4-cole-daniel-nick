import { User } from 'src/app/users/user';
import { AddUserPage } from '../support/add-user.po';

describe('Add user', () => {
  const page = new AddUserPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New User');
  });

  it('Should enable and disable the add user button', () => {
    // ADD USER button should be disabled until all the necessary fields
    // are filled. Once the last (`#emailField`) is filled, then the button should
    // become enabled.
    page.addUserButton().should('be.disabled');
    page.getFormField('name').type('test');
    page.addUserButton().should('be.disabled');
    page.getFormField('age').type('20');
    page.addUserButton().should('be.disabled');
    page.getFormField('email').type('invalid');
    page.addUserButton().should('be.disabled');
    page.getFormField('email').clear().type('user@example.com');
    // all the required fields have valid input, then it should be enabled
    page.addUserButton().should('be.enabled');
  });

  it('Should show error messages for invalid inputs', () => {
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=nameError]').should('not.exist');
    // Just clicking the name field without entering anything should cause an error message
    page.getFormField('name').click().blur();
    cy.get('[data-test=nameError]').should('exist').and('be.visible');
    // Some more tests for various invalid name inputs
    page.getFormField('name').type('J').blur();
    cy.get('[data-test=nameError]').should('exist').and('be.visible');
    page.getFormField('name').clear().type('This is a very long name that goes beyond the 50 character limit').blur();
    cy.get('[data-test=nameError]').should('exist').and('be.visible');
    // Entering a valid name should remove the error.
    page.getFormField('name').clear().type('John Smith').blur();
    cy.get('[data-test=nameError]').should('not.exist');

    // Before doing anything there shouldn't be an error
    cy.get('[data-test=ageError]').should('not.exist');
    // Just clicking the age field without entering anything should cause an error message
    page.getFormField('age').click().blur();
    // Some more tests for various invalid age inputs
    cy.get('[data-test=ageError]').should('exist').and('be.visible');
    page.getFormField('age').type('5').blur();
    cy.get('[data-test=ageError]').should('exist').and('be.visible');
    page.getFormField('age').clear().type('500').blur();
    cy.get('[data-test=ageError]').should('exist').and('be.visible');
    page.getFormField('age').clear().type('asd').blur();
    cy.get('[data-test=ageError]').should('exist').and('be.visible');
    // Entering a valid age should remove the error.
    page.getFormField('age').clear().type('25').blur();
    cy.get('[data-test=ageError]').should('not.exist');

    // Before doing anything there shouldn't be an error
    cy.get('[data-test=emailError]').should('not.exist');
    // Just clicking the email field without entering anything should cause an error message
    page.getFormField('email').click().blur();
    // Some more tests for various invalid email inputs
    cy.get('[data-test=emailError]').should('exist').and('be.visible');
    page.getFormField('email').type('asd').blur();
    cy.get('[data-test=emailError]').should('exist').and('be.visible');
    page.getFormField('email').clear().type('@example.com').blur();
    cy.get('[data-test=emailError]').should('exist').and('be.visible');
    // Entering a valid email should remove the error.
    page.getFormField('email').clear().type('user@example.com').blur();
    cy.get('[data-test=emailError]').should('not.exist');
  });

  describe('Adding a new user', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });

    it('Should go to the right page, and have the right info', () => {
      const user: User = {
        _id: null,
        name: 'Test User',
        age: 30,
        company: 'Test Company',
        email: 'test@example.com',
        role: 'editor'
      };

      page.addUser(user);

      // New URL should end in the 24 hex character Mongo ID of the newly added user
      cy.url()
        .should('match', /\/users\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/users\/new$/);

      // The new user should have all the same attributes as we entered
      cy.get('.user-card-name').should('have.text', user.name);
      cy.get('.user-card-company').should('have.text', user.company);
      cy.get('.user-card-role').should('have.text', user.role);
      cy.get('.user-card-age').should('have.text', user.age);
      cy.get('.user-card-email').should('have.text', user.email);

      // We should see the confirmation message at the bottom of the screen
      cy.get('.mat-simple-snackbar').should('contain', `Added User ${user.name}`);
    });

    it('Should fail with no company', () => {
      const user: User = {
        _id: null,
        name: 'Test User',
        age: 30,
        company: null, // The company being set to null means nothing will be typed for it
        email: 'test@example.com',
        role: 'editor'
      };

      page.addUser(user);

      // We should get an error message
      cy.get('.mat-simple-snackbar').should('contain', `Failed to add the user`);

      // We should have stayed on the new user page
      cy.url()
        .should('not.match', /\/users\/[0-9a-fA-F]{24}$/)
        .should('match', /\/users\/new$/);

      // The things we entered in the form should still be there
      page.getFormField('name').should('have.value', user.name);
      page.getFormField('age').should('have.value', user.age);
      page.getFormField('email').should('have.value', user.email);
      page.getFormField('role').should('contain', 'Editor');
    });
  });

});
