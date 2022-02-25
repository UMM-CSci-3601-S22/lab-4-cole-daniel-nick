export class AppPage {
  navigateTo() {
    return cy.visit('/');
  }

  getAppTitle() {
    return cy.get('.app-title');
  }

  getSidenavButton() {
    return cy.get('.sidenav-button');
  }

  getSidenav() {
    return cy.get('.sidenav');
  }

  getNavLink(navOption: 'Home' | 'Users') {
    return cy.contains('[routerlink] > .mat-list-item-content', `${navOption}`);
  }
}
