/// <reference types="cypress"/>
require('dotenv').config();

import generateToken from '../../../src/tests/helpers/generateToken';

const jwtSecret = Cypress.env('JWT_SECRET');

describe('Work Tray Page', () => {
  let token: string;

  beforeEach(() => {
    token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['housing-officer-dev'],
      jwtSecret
    );
    cy.server();
    cy.setCookie('hackneyToken', token);
  });

  it('displays the key elements', () => {
    cy.fixture('tasks').then((tasks) => {
      cy.route('/api/tasks?emailAddress=test.user@hackney.gov.uk', tasks).as(
        'getTasks'
      );
    });

    cy.visit('/');
    cy.wait('@getTasks');

    cy.contains('Created');
    cy.contains('Process / Action');
    cy.contains('Name');
    cy.contains('Address');

    cy.contains('In Progress');
    cy.contains('Completed');
    cy.contains('All Items');

    // Completed Tab
    cy.get('.worktray-container ul li:nth-child(2)').click();

    // All Items
    cy.get('.worktray-container ul li:last').click();

    // Name Column
    cy.get(
      '.worktray-container th.govuk-table__header:nth-child(3)'
    ).dblclick();
  });

  it('redirects to the login error page if no patch is set for the user', () => {
    cy.route({
      method: 'GET',
      url: '/api/tasks?emailAddress=test.user@hackney.gov.uk',
      status: 400,
      response: { error: 'No user patch or area found' },
    });

    cy.visit('/');
    cy.contains('Problem logging in');
    cy.location('pathname').should('equal', '/login-error');
  });
});
