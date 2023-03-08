/// <reference types="cypress" />
import { Program, Resource } from "../../../../ClientApp/src/app/services/resource.service";
import { Observable } from "rxjs";

declare global {
  namespace Cypress {
    interface Chainable {
      getElement(automationId: string, ...additionalSelectors: string[]): Chainable<any>;
      login(label: string): Chainable<any>;
      logout(): Chainable<any>;
      entityExistsInDirectoryByName(entityName: string, directoryName: string): Chainable<any>;
      verifyClickRedirect(automationId: string, redirectUrl: string): Chainable<void>;

    }
  }
}
