/// <reference types="cypress"/>

import React from 'react';

describe('Work Tray Page Elements', () => {
  it('', () => {
    cy.setCookie(
      'hackneyToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDg4NTQyNzMzMzE0ODQ4MDg1NTIiLCJlbWFpbCI6InRlc3QudXNlckBoYWNrbmV5Lmdvdi51ayIsImlzcyI6IkhhY2tuZXkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZ3JvdXBzIjpbImFyZWEtaG91c2luZy1tYW5hZ2VyLWRldiJdLCJpYXQiOjE1OTUzNDMxMTB9.RnwD8lgD6jGBmve3k0O8b6sOqGlInmGrXdg08I9t_9s'
    );
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
