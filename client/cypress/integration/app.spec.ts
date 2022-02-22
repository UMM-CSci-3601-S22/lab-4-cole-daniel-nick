import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {
  beforeEach(() => page.navigateTo());

  it('Should have the correct title', () => {
    page.getAppTitle().should('contain', 'CSci 3601 Lab 4');
  });

  describe('Sidenav', () => {
    it('Should be invisible by default', () => {
      // Before clicking on the button, the sidenav should be hidden
      page.getSidenav()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('Should be openable by clicking the sidenav button', () => {
      page.getSidenavButton().click();

      page.getSidenav()
        .should('not.be.hidden')
        .and('be.visible');
    });

    it('Should have a working navigation to "Users"', () => {
      page.getSidenavButton().click();
      page.getSidenav();
      // When we click the "Users" option in the side navbar…
      page.getNavLink('Users').click();
      // …then the URL of the current page should change to "…/users".
      cy.url().should('match', /.*\/users$/);
    });


    it('Should have a working navigation to "Home"', () => {
      page.getSidenavButton().click();
      // When we click the "Home" option in the side navbar…
      page.getNavLink('Home').click();
      // …then the URL of the current page should change to "…/".
      cy.url().should('match', /.*\/$/);
    });
  });

});
