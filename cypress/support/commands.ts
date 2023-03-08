Cypress.Commands.add("getElement", (automationId: string, separator: string, ...additionalSelectors: string[]) => {
  const selector = additionalSelectors.join(separator);
  return cy.get(`[data-automationId="${automationId}"]${separator || ''}${selector}`);
});

// auth
Cypress.Commands.add("login", (label: string) => {
  cy.get('input[id="email"]').type(label);
  cy.get('input[id="password"]').type(Cypress.env("password"));
  cy.get("#btn-login").click();
  cy.url().should("not.contain", "auth");
});