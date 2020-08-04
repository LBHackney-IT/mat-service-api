
require('dotenv').config();

import generateToken from '../../../src/tests/helpers/generateToken';

const jwtSecret = Cypress.env('JWT_SECRET');

describe('Work Tray Page Elements', () => {
  it('', () => {
    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['housing-officer-dev'],
      jwtSecret
    );

    cy.setCookie('hackneyToken', token);
    cy.visit('/');

    cy.contains('In Progress');
    cy.contains('Completed');
    cy.contains('All Items');

    // Completed Tab
    cy.get('ul li:nth-child(2)').click();

    // All Items
    cy.get('ul li:last').click();

    // Name Column
    cy.get('th.govuk-table__header:nth-child(3)').dblclick();

    // Date/Completion Column
    cy.get('th.govuk-table__header:last').dblclick();
  });
});
