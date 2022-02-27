import { Todo } from 'src/app/todos/todo';

export class AddTodoPage {
  navigateTo() {
    return cy.visit('/todos/new');
  }

  getTitle() {
    return cy.get('.add-todo-title');
  }

  addTodoButton() {
    return cy.get('[data-test=confirmAddTodoButton]');
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
  }

  addTodo(newTodo: Todo) {
    this.getFormField('owner').type(newTodo.owner);
    this.getFormField('category').type(newTodo.category);
    this.getFormField('body').type(newTodo.body);
    this.selectMatSelectValue(this.getFormField('status'), newTodo.status.toString());
    return this.addTodoButton().click();
  }
}
