describe('The Work Tray Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });
});

describe('Work Tray Page Elements', () => {
  it('', () => {
    cy.visit('/');

    cy.contains("In Progress")
    cy.contains('Completed');
    cy.contains('All Items');
  });
});
