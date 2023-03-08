import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import cypress = require("cypress");

Given("I am at url {string} WITH auth redirect", (url: string) => {});

Given("I am at url {string}", (url: string) => {
  cy.visit(url)
    .wait(1000)
    .url()
    .then(($url: string) => {
      if ($url.includes("auth")) {
        cy.login(Cypress.env("username"));
      }
      // This is temporary solution, currently auth doesn't remember where it is coming from
      cy.visit(url);
      cy.url().should("include", url);
    });
});

Given(
  "I am at url {string} and the address bar shows {string}",
  (url: string, actualUrl: string) => {
    cy.visit(url)
      .wait(1000)
      .url()
      .then(($url: string) => {
        if ($url.includes("auth")) {
          cy.login(Cypress.env("username"));
        }
        cy.url().should("include", actualUrl);
      });
  }
);
