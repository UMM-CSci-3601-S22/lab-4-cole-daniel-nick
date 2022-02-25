import { UserRole } from 'src/app/users/user';

export class UserListPage {
  navigateTo() {
    return cy.visit('/users');
  }

  getUserCards() {
    return cy.get('.user-cards-container app-user-card');
  }

  getUserListItems() {
    return cy.get('.user-nav-list .user-list-item');
  }

  /**
   * Clicks the "view profile" button for the given user card.
   * Requires being in the "card" view.
   *
   * @param card The user card
   */
  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewProfileButton]').click();
  }

  /**
   * Change the view of users.
   *
   * @param viewType Which view type to change to: "card" or "list".
   */
  changeView(viewType: 'card' | 'list') {
    return cy.get(`[data-test=viewTypeRadio] .mat-radio-button[value="${viewType}"]`).click();
  }

  /**
   * Selects a role to filter in the "Role" selector.
   *
   * @param value The role *value* to select, this is what's found in the mat-option "value" attribute.
   */
  selectRole(value: UserRole) {
    // Find and click the drop down
    return cy.get('[data-test=userRoleSelect]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  addUserButton() {
    return cy.get('[data-test=addUserButton]');
  }
}
