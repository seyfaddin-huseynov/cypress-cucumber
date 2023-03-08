import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("I am logged in", () => {
  cy.visit('/');
  cy.login(Cypress.env("username"));
});
