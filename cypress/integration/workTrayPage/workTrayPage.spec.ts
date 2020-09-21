/// <reference types="cypress"/>
require('dotenv').config();

import generateToken from '../../../src/tests/helpers/generateToken';

const jwtSecret = Cypress.env('JWT_SECRET');

describe('Work Tray Page Elements', () => {
  it('', () => {
    cy.server();
    cy.fixture('tasks').then((tasks) => {
      cy.route('/api/tasks?emailAddress=test.user@hackney.gov.uk', tasks).as(
        'getTasks'
      );
    });

    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['housing-officer-dev'],
      jwtSecret
    );

    cy.setCookie('hackneyToken', token);
    cy.visit('/');
    cy.wait('@getTasks');

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

    // Date/Completion Column
    // cy.get('.worktray-container th.govuk-table__header:last').dblclick();
  });
});
