import { Collection, Program, Resource } from "../../../../ClientApp/src/app/services/resource.service";
import { Observable } from "rxjs";
import { Chainable } from "@cypress/browserify-preprocessor";
import { Interception } from "cypress/types/net-stubbing";

export namespace HydraMode {
  export function rndStr() {
    return Cypress._.random(0, 1e6).toString();
  }

  export function getPrograms(): Chainable<Program[]> {
    return cy.window().should("have.property", "FunnelService").invoke("getFunnels");
  }

  export function getResource(id: string): Chainable<Resource> {
    return cy.window().should("have.property", "AdminService").invoke("getResource", id);
  }

  export function addResource(resource: Resource = null): Chainable<Observable<Resource>> {
    const uuid = rndStr();
    resource =
      resource ||
      ({
        name: uuid,
        type: "externalLink",
        url: "https://www.google.com",
        description: `description ${uuid}`,
        isPublished: true,
        parentProgramIds: ["fundations-k"],
      } as unknown as Resource);

    return cy.window().should("have.property", "AdminService").invoke("upsertResource", resource);
  }

  export function deleteResource(resource: Resource): Chainable<Observable<void>> {
    return cy.window().should("have.property", "AdminService").invoke("deleteResource", resource);
  }

  export function addResourceTestAndDelete(fnTest: (resource: Resource) => any) {
    cy.intercept({ method: "PUT", path: "/admin/UpsertResource" }).as("upsertRequest");
    cy.intercept({ method: "PUT", path: "/admin/UpsertResource" }).as("deleteRequest");

    // creates an external link by default
    HydraMode.addResource().then((obs: Observable<Resource>) => obs.subscribe());

    // wait for the call to complete
    cy.wait("@upsertRequest").then((response: Interception) => {
      // get the resource and pass it into the test function
      const r = response.response.body as Resource;
      fnTest(r);

      // delete the fake resource
      HydraMode.deleteResource(r).then((obs: Observable<void>) => obs.subscribe());
      cy.wait("@deleteRequest");
    });
  }

  export function addCollection(collection: Collection = null): Chainable<Observable<Collection>> {
    const uuid = rndStr();
    collection =
      collection ||
      ({
        name: uuid,
        type: "collection",
        childResourceType: "collection",
        childResourceCount: 0,
        childResources: [],
        createdDate: "2021-11-14T09:55:49.610+00:00",
        createdBy: "Me",
        lastModifiedDate: "2021-11-15T09:55:49.610+00:00",
        lastModifiedBy: "You",
        requiredSubscription: null,
        description: `description ${uuid}`,
        isPublished: true,
        isDeletable: true,
        isSearchable: true,
        parentProgramId: "fundations-k",
      } as unknown as Collection);

    return cy.window().should("have.property", "AdminService").invoke("upsertCollectionResource", collection);
  }

  export function addCollectionTestAndDelete(fnTest: (collection: Collection) => any) {
    cy.intercept({ method: "PUT", path: "/admin/UpsertCollectionResource" }).as("upsertRequest");
    cy.intercept({ method: "GET", path: "/admin/GetResource/*" }).as("getRequest");
    cy.intercept({ method: "DELETE", path: "/admin/DeleteResource/*" }).as("deleteRequest");

    HydraMode.addCollection().then((obs: Observable<Collection>) => obs.subscribe());
    // wait for the call to complete
    cy.wait("@upsertRequest").then((upsertResponse: Interception) => {
      const r = upsertResponse.response.body as Resource;

      // get the full collection resource we just created (since upsertCollectionResource only gives us the id)
      // and pass it into the test function
      HydraMode.getResource(r.id).then((obs: Observable<void>) => obs.subscribe())
      cy.wait("@getRequest").then((getResponse: Interception) => {
        const c = getResponse.response.body as Collection;
        fnTest(c);

        // delete the collection
        HydraMode.deleteResource(r).then((obs: Observable<void>) => obs.subscribe());
        cy.wait("@deleteRequest");
      })
    });
  }
}
