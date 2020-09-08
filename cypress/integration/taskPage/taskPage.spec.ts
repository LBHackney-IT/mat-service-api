/// <reference types="cypress"/>
require('dotenv').config();

import generateToken from '../../../src/tests/helpers/generateToken';

const jwtSecret = Cypress.env('JWT_SECRET');

describe('Task Page Elements', () => {
  it('', () => {
    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['housing-officer-dev'],
      jwtSecret
    );

    cy.setCookie('hackneyToken', token);
    cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');

    cy.contains('Tenancy and household check');
    cy.contains('Tenancy');
    cy.contains('Residents');
    cy.contains('Action');
  });
});
