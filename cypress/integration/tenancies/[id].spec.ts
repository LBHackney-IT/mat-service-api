/// <reference types="cypress"/>
require('dotenv').config();

import generateToken from '../../../src/tests/helpers/generateToken';

const jwtSecret = Cypress.env('JWT_SECRET');

console.log(jwtSecret);

describe('Tenancy Page Elements', () => {
  it('', () => {
    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['housing-officer-dev'],
      jwtSecret
    );

    cy.setCookie('hackneyToken', token);
    cy.visit('/tenancies/0383aee7-5a13-4b3b-ac5f-4cfbffc13429');

    cy.contains('Create New Process');
    cy.contains('Tenancy');
    cy.contains('Processes');
  });
});
