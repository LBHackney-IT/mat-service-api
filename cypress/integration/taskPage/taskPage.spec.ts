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

    cy.fixture('tasks').then((tasks) => {
      cy.route('/api/tasks', tasks).as('getTasks');
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
      cy.wait('@sendToManager');
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
      cy.wait('@sendToManagerFail');
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
      cy.wait('@sendToOfficer');
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
      cy.wait('@sendToOfficerFail');
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
      cy.wait('@closeTask');
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
      cy.wait('@closeTask');
    });
  });

  describe('Render button states and messages when saving notes', () => {
    it('should make the save note button disabled by default', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11'); //active task
      cy.get('button.submitNote').should('be.disabled');
    });

    it('should enable the save note button when update notes textbox has content', () => {
      cy.get('#notes-text-area').type('Sample note');
      cy.get('button.submitNote').should('be.enabled');
    });

    it('should disable all buttons and display correct message when the note is being saved', () => {
      cy.route({
        method: 'POST',
        url: '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/notes',
        status: 200,
        response: {},
        delay: 2000,
      }).as('saveNote');
      cy.get('button.submitNote').click();

      cy.get('button.submitNote').should('be.disabled');
      cy.get('button.sendToManager').should('be.disabled');
      cy.get('button.closeTask').should('be.disabled');

      cy.contains('Submitting note...');
      cy.wait('@saveNote');
      cy.contains('Note submitted successfully');
    });

    it('should disable save note button, clear the update notes textbox and enable all other buttons after the note is saved successfully', () => {
      cy.route({
        method: 'POST',
        url: '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/notes',
        status: 200,
        response: {},
      }).as('saveNote');

      cy.get('#notes-text-area').type('Sample note');
      cy.get('button.submitNote').click();
      cy.wait('@saveNote');
      cy.get('button.submitNote').should('be.disabled');
      cy.get('button.sendToManager').should('be.enabled');
      cy.get('button.closeTask').should('be.enabled');
    });

    it('should show an error if necessary', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.route({
        method: 'POST',
        url: '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/notes',
        status: 500,
        response: {},
      }).as('saveNote');
      cy.get('#notes-text-area').type('Sample note');
      cy.get('button.submitNote').click();
      cy.contains('Error submitting note');
    });
  });

  describe('Render button states and messages when sending the task to a manager', () => {
    it('should disable all buttons and display correct message when sending the task to a manager', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.route({
        method: 'POST',
        url: '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/sendToManager',
        status: 200,
        response: {},
        delay: 2000,
      }).as('sendToManager');
      cy.get('button.sendToManager').click();
      cy.get('button.submitNote').should('be.disabled');
      cy.get('button.sendToManager').should('be.disabled');
      cy.get('button.closeTask').should('be.disabled');
      cy.contains('Transferring to manager...');
      cy.wait('@sendToManager');
      cy.location('pathname').should('eq', '/');
    });

    it('should show an error if necessary', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.route({
        method: 'POST',
        url: '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/sendToManager',
        status: 500,
        response: {},
      }).as('sendToManager');
      cy.get('button.sendToManager').click();
      cy.contains('Error sending action to manager');
    });
  });

  describe('Render button states and messages when closing the task', () => {
    it('should disable all buttons and display correct message when colisng the task', () => {
      cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
      cy.route({
        method: 'POST',
        url: '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/close',
        status: 200,
        response: {},
        delay: 2000,
      }).as('closeTask');

      cy.get('button.closeTask').click();

      cy.get('button.submitNote').should('be.disabled');
      cy.get('button.sendToManager').should('be.disabled');
      cy.get('button.closeTask').should('be.disabled');

      cy.contains('Closing task..');
      cy.wait('@closeTask');
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
    });
  });

  describe('Render button states and messages when tranferring task to officer', () => {
    it('should disable all buttons when task is being transferred to officer', () => {
      cy.visit('/tasks/99999999-116f-e811-8133-70106faa6a11');
      cy.route({
        method: 'POST',
        url: '/api/tasks/99999999-116f-e811-8133-70106faa6a11/sendToOfficer',
        status: 200,
        response: {},
        delay: 2000,
      }).as('sendToOfficer');

      cy.get('button.sendToOfficer').click();

      cy.get('button.submitNote').should('be.disabled');
      cy.get('button.sendToOfficer').should('be.disabled');
      cy.get('button.closeTask').should('be.disabled');
      cy.location('pathname').should('eq', '/');
    });

    it('should show an error if necessary', () => {
      cy.visit('/tasks/99999999-116f-e811-8133-70106faa6a11');
      cy.route({
        method: 'POST',
        url: '/api/tasks/99999999-116f-e811-8133-70106faa6a11/sendToOfficer',
        status: 500,
        response: {},
      }).as('closeTask');
      cy.get('button.sendToOfficer').click();
      cy.contains('Error sending action to officer');
    });
  });
});
