/// <reference types="cypress"/>
require('dotenv').config();

import generateToken from '../../../src/tests/helpers/generateToken';

const jwtSecret = Cypress.env('JWT_SECRET');

describe('Task Page', () => {
  beforeEach(() => {
    const token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['housing-officer-dev'],
      jwtSecret
    );

    cy.server();
    cy.fixture('activeTask').then((tasks) => {
      cy.route('/api/tasks/6790f691-116f-e811-8133-70106faa6a11', tasks).as(
        'getActiveTask'
      );
    });

    cy.fixture('closedTask').then((tasks) => {
      cy.route('/api/tasks/6790f691-116f-e811-8133-70106faa6a00', tasks).as(
        'getClosedTask'
      );
    });

    cy.fixture('managerTask').then((tasks) => {
      cy.route('/api/tasks/99999999-116f-e811-8133-70106faa6a11', tasks).as(
        'getManagerTask'
      );
    });

    cy.fixture('tasks').then((tasks) => {
      cy.route('/api/tasks?emailAddress=test.user@hackney.gov.uk', tasks).as(
        'getTasks'
      );
    });

    cy.fixture('notes').then((tasks) => {
      cy.route('/api/notes/6790f691-116f-e811-8133-70106faa6a11', tasks).as(
        'getNotes'
      );
    });

    cy.fixture('officers').then((tasks) => {
      cy.route('/api/users?managerEmail=test.user@hackney.gov.uk', tasks).as(
        'getOfficers'
      );
    });

    cy.setCookie('hackneyToken', token);
  });

  describe('Rendering the page for active task', () => {
    it('should show the main elements', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.contains('Tenancy and household check');
      cy.contains('Tenancy');
      // cy.contains('Residents');
      cy.contains('Action');
      cy.contains('Notes');
      cy.contains('Update Notes');
    });

    it('should render the data', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.contains('FLAT 33 KNIGHT COURT, GALES TERRACE');
      cy.contains('Secure');
      cy.contains('26/08/2013');
      // Temporarily disable whilst residents information is disabled
      // cy.contains('James Cagney');
      // cy.contains('james.cagney@yahoo.co.uk');
      cy.contains('CAS-00000-V2L7P6');
      cy.contains('Save Note');
    });

    it('should link to the tenancy page on single view', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.get('a.tenancy')
        .contains('0123456/01')
        .should('have.attr', 'href')
        .then((href) => {
          expect(href.endsWith('/tenancies/0123456-01')).to.equal(true);
        });
    });
  });

  describe('Rendering the page for a closed task', () => {
    it('should show the read only elements', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a00');
      cy.contains('Tenancy and household check');
      cy.contains('Tenancy');
      // cy.contains('Residents');
      cy.contains('Actions');
      cy.contains('Notes and Actions');
      cy.contains('Update Notes').should('not.exist');
    });

    it('should render the data', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a00');
      cy.contains('FLAT 33 KNIGHT COURT, GALES TERRACE');
      cy.contains('Secure'); //check for status
      cy.contains('26/08/2013');
      // Temporarily disable whilst residents information is disabled
      // cy.contains('James Cagney');
      // cy.contains('james.cagney@yahoo.co.uk');
      cy.contains('CAS-00000-V2L7P6');
      cy.contains('Save Note').should('not.exist');
    });

    it('should link to the tenancy page on single view', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a00');
      cy.get('a.tenancy')
        .contains('0123456/01')
        .should('have.attr', 'href')
        .then((href) => {
          expect(href.endsWith('/tenancies/0123456-01')).to.equal(true);
        });
    });
  });

  describe('Send task to manager', () => {
    it('should only display on post visit actions');

    it('should make the correct api request when clicked', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.route(
        'POST',
        '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/sendToManager',
        ''
      ).as('sendToManager');
      cy.get('button.sendToManager').click();
      cy.wait('@sendToManager', { timeout: 1000 });
    });

    it('should show an error if necessary', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.route({
        method: 'POST',
        url: '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/sendToManager',
        status: 500,
        response: {},
      }).as('sendToManagerFail');
      cy.get('button.sendToManager').click();
      cy.contains('Error sending action to manager');
      cy.wait('@sendToManagerFail', { timeout: 1000 });
    });

    it('should not be visible on a task assigned to manager already', () => {
      cy.visit('/tasks/99999999-116f-e811-8133-70106faa6a11');
      cy.get('button.sendToManager').should('not.exist');
    });
  });

  describe('Send task to officer', () => {
    beforeEach(() => {});
    it('should only display on post visit actions');

    it('should make the correct api request when clicked and redirect to worktray page', () => {
      cy.visit('/tasks/99999999-116f-e811-8133-70106faa6a11');
      cy.route(
        'POST',
        '/api/tasks/99999999-116f-e811-8133-70106faa6a11/sendToOfficer',
        ''
      ).as('sendToOfficer');
      cy.get('button.sendToOfficer').click();
      cy.wait('@sendToOfficer', { timeout: 1000 });
      cy.location('pathname').should('eq', '/');
    });

    it('should show an error if necessary', () => {
      cy.visit('/tasks/99999999-116f-e811-8133-70106faa6a11');
      cy.route({
        method: 'POST',
        url: '/api/tasks/99999999-116f-e811-8133-70106faa6a11/sendToOfficer',
        status: 500,
        response: {},
      }).as('sendToOfficerFail');
      cy.get('button.sendToOfficer').click();
      cy.wait('@sendToOfficerFail', { timeout: 1000 });
      cy.contains('Error sending action to officer');
    });

    it('should not be visible on a task assigned to an officer', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.get('button.sendToOfficer').should('not.exist');
    });
  });

  describe('Close task', () => {
    it('should not display on closed tasks');

    it('should make the correct api request when clicked and redirect to the worktray', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.route(
        'POST',
        '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/close',
        ''
      ).as('closeTask');
      cy.get('button.closeTask').click();
      cy.wait('@closeTask', { timeout: 1000 });
      cy.location('pathname').should('eq', '/');
    });

    it('should show an error if necessary', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.route({
        method: 'POST',
        url: '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/close',
        status: 500,
        response: {},
      }).as('closeTask');
      cy.get('button.closeTask').click();
      cy.contains('Error closing action');
      cy.wait('@closeTask', { timeout: 1000 });
    });
  });
});
