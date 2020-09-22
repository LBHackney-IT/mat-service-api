/// <reference types="cypress"/>
require('dotenv').config();

import generateToken from '../../../src/tests/helpers/generateToken';

const jwtSecret = Cypress.env('JWT_SECRET');

describe('Task Page', () => {
  beforeEach(() => {
    let token = generateToken(
      '108854273331484808552',
      'Test User',
      'test.user@hackney.gov.uk',
      ['housing-officer-dev'],
      jwtSecret
    );

    cy.server();
    cy.fixture('task').then((tasks) => {
      cy.route('/api/tasks/6790f691-116f-e811-8133-70106faa6a11', tasks).as(
        'getTasks'
      );
    });

    cy.setCookie('hackneyToken', token);
    cy.visit('/tasks/6790f691-116f-e811-8133-70106faa6a11');
  });

  describe('Rendering the page', () => {
    it('should show the main elements', () => {
      cy.contains('Tenancy and household check');
      cy.contains('Tenancy');
      cy.contains('Residents');
      cy.contains('Action');
      cy.contains('Notes');
      cy.contains('Update Notes');
    });

    it('should render the data', () => {
      cy.contains('FLAT 33 KNIGHT COURT, GALES TERRACE');
      cy.contains('Secure');
      cy.contains('26/08/2013');
      cy.contains('James Cagney');
      cy.contains('james.cagney@yahoo.co.uk');
      cy.contains('CAS-00000-V2L7P6');
      cy.contains('Save Update');
    });
    it('should link to the tenancy page on single view', () => {
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
      cy.route(
        'POST',
        '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/sendToManager'
      ).as('sendToManager');
      cy.get('button.sendToManager').click();
      cy.wait('@sendToManager');
    });

    it('should should show an error if necessary', () => {
      cy.route({
        method: 'POST',
        url: '/api/tasks/6790f691-116f-e811-8133-70106faa6a11/sendToManager',
        status: 500,
      }).as('sendToManager');
      cy.get('button.sendToManager').click();
      cy.contains('Error sending action to manager');
      cy.wait('@sendToManager');
    });
  });

  it('Displays clickable elements', () => {
    cy.get('#selectOption').should('contain', 'Mary Berry');

    cy.get('#selectOption').select('Joe Bloggs');
    cy.get('#selectOption').should('have.value', '1');

    cy.get('.submit').contains('Send action to officer');
  });
});
