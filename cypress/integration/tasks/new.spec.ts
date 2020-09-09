/// <reference types="cypress"/>
require('dotenv').config();

import generateToken from '../../../src/tests/helpers/generateToken';

const jwtSecret = Cypress.env('JWT_SECRET');

describe('Tenancy Page Elements', () => {
  beforeEach(() => {
    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['housing-officer-dev'],
      jwtSecret
    );

    cy.setCookie('hackneyToken', token);
    cy.visit('/tasks/new?tag_ref=1234567-1&uprn=12345678901');
  });

  it('enables the button if home check is selected', () => {
    cy.get('input#homecheck').check();
    cy.get('button').should('not.be.disabled');
  });

  it('enables the button if itv is selected', () => {
    cy.get('input#itv').check();
    cy.get('button').should('not.be.disabled');
  });

  it('displays a submenu with disabled button if thc is selected', () => {
    cy.get('button').should('be.disabled');
    cy.contains('Gas safety forced entry').should('not.exist');
    cy.get('input#thc').check();
    cy.get('button').should('be.disabled');
    cy.contains('Gas safety forced entry');
  });

  it('only enables the button if the submenu is selected', () => {
    cy.get('button').should('be.disabled');
    cy.contains('Gas safety forced entry').should('not.exist');
    cy.get('input#thc').check();
    cy.get('button').should('be.disabled');
    cy.contains('Gas safety forced entry');
    cy.get('input#thcReason3').check();
    cy.get('button').should('not.be.disabled');
  });

  it('displays the form with a disabled button', () => {
    cy.contains('Create New Process');
    cy.get('button').should('be.disabled');
  });
});
