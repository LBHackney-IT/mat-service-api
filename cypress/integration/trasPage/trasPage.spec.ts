/// <reference types="cypress"/>
require('dotenv').config();

import generateToken from '../../../src/tests/helpers/generateToken';

const jwtSecret = Cypress.env('JWT_SECRET');

describe('The Tras page', () => {
  it('successfully loads Tras Page', () => {
    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      [],
      jwtSecret
    );

    cy.setCookie('hackneyToken', token);

    cy.visit('/tras');
    cy.contains('Tenant and Resident Associations');
  });
});
