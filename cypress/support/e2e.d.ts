/// <reference types="cypress" />
import { Observable } from "rxjs";

declare global {
  namespace Cypress {
    interface Chainable {
      getElement(automationId: string, ...additionalSelectors: string[]): Chainable<any>;
      login(label: string): Chainable<any>;
    }
  }
}
