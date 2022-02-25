import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for owner 'Lynn Ferguson'
    cy.get('#todo-owner-input').type('Blanche');

    // All of the todo cards should have the owner we are filtering by
    page.getTodoCards().each($card => {
      cy.wrap($card).find('.todo-card-owner').should('have.text', 'Blanche');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoCards().find('.todo-card-owner').each($owner =>
      expect($owner.text()).to.equal('Blanche')
    );
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    // Filter for category 'software design'
    cy.get('#todo-category-input').type('software design');

    // All of the todo cards should have the category we are filtering by
    page.getTodoCards().each($card => {
      cy.wrap($card).find('.todo-card-category').should('have.text', 'software design');
    });
  });

  it('Should type something partial in the owner filter and check that it returned correct elements', () => {
    // Filter for owners that contain 'b'
    cy.get('#todo-owner-input').type('b');

    // Go through each of the cards that are being shown and get the companies
    page.getTodoCards().find('.todo-card-owner')
      // We should see these owners
      .should('contain.text', 'Blanche')
      .should('contain.text', 'Barry')
      .should('contain.text', 'Roberta')
      // We shouldn't see these companies
      .should('not.contain.text', 'Fry')
      .should('not.contain.text', 'Workman')
      .should('not.contain.text', 'Dawn');
  });

  it('Should type something in the body filter and check that it returned correct elements', () => {
    // Filter for todos with body containing 'lorem ipsum'
    cy.get('#todo-body-input').type('lorem ipsum');

    // Go through each of the cards that are being shown and get the owners
    page.getTodoCards().find('.todo-card-owner')
      // We should see these todos whose body contains 'lorem ipsum'
      .should('contain.text', 'Dawn')
      .should('contain.text', 'Fry')
      // We shouldn't see these todos
      .should('not.contain.text', 'Blanche')
      .should('not.contain.text', 'Barry')
      .should('not.contain.text', 'Roberta')
      .should('not.contain.text', 'Workman');
  });

  it('Should change the view', () => {
    // Choose the view type "List"
    page.changeView('list');

    // We should not see any cards
    // There should be list items
    page.getTodoCards().should('not.exist');
    page.getTodoListItems().should('exist');

    // Choose the view type "Card"
    page.changeView('card');

    // There should be cards
    // We should not see any list items
    page.getTodoCards().should('exist');
    page.getTodoListItems().should('not.exist');
  });

  it('Should select a status and check that it returned correct elements', () => {
    // Filter for status 'true');
    page.selectStatus('complete');

    // Choose the view type "List"
    page.changeView('list');

    // Some of the todos should be listed
    page.getTodoListItems().should('exist');

    // All of the todo list items that show should have the status we are looking for
    page.getTodoListItems().each($todo => {
      cy.wrap($todo).find('.todo-list-status').should('have.text', ' true '); // this seems fragile since the spaces are expected
    });
  });

});
