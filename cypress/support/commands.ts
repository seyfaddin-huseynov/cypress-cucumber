Cypress.Commands.add("getElement", (automationId: string, separator: string, ...additionalSelectors: string[]) => {
  const selector = additionalSelectors.join(separator);
  return cy.get(`[data-automationId="${automationId}"]${separator || ''}${selector}`);
});

Cypress.Commands.add("verifyClickRedirect", (automationId: string, redirectUrl: string) => {
  cy.getElement(automationId).first().should("be.visible").click({ force: true });
  cy.url().should("include", redirectUrl);
});

Cypress.Commands.add("entityExistsInDirectoryByName", (entityName: string, directoryName: string) => {
  cy.getElement(`admin_menu_${directoryName}`).should("be.visible").click({ force: true });
  cy.getElement("titlebar_input").should("be.visible").type(entityName);

  // let it search
  cy.wait(3000);

  // confirm it doesn't exist
  cy.get(`[data-automationId='admin_directory_resourceName'][data-resourceName='${entityName}']`);
  cy.getElement("titlebar_input").should("be.visible").clear();
});

// auth
// Universal UI log in command for all Wilson Apps
Cypress.Commands.add("login", (label: string) => {
  cy.get('input[id="email"]').type(label);
  cy.get('input[id="password"]').type(Cypress.env("password"));
  cy.get("#btn-login").click();
  cy.url().should("not.contain", "auth");
});

// This command verifies landing page after user logged out
Cypress.Commands.add("logout", () => {
  cy.title().should("eq", "Log In - Wilson Language Training");
  cy.get('[id="login-form"]')
    .should("be.visible")
    .within(() => {
      cy.get("h2").and("have.text", "Welcome Back!");
      cy.get("p").and("have.text", "Log in to continue");
    });
  cy.get('[id="login-form"] form')
    .should("be.visible")
    .within(() => {
      cy.get('[for="email"]').should("have.text", "Email Address");
      cy.get('[type="email"]').should("have.attr", "name", "email");
      cy.get('[for="password"]').should("have.text", "Password");
      cy.get('[type="password"]').should("have.attr", "name", "password");
      cy.get('[type="submit"]').should("have.text", "Log In");
      cy.get('[type="button"]').should("have.text", "\n                  Forgot your password?\n                ");
    });
  cy.get(".subform")
    .should("be.visible")
    .within(() => {
      cy.get("h3").and("have.text", "Have an access code?");
      cy.get("a").and("have.attr", "href", "http://register.wilsonlanguage.com");
    });
});
