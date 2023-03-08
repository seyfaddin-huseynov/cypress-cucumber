import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I search for next 10 days forecast in {string}", (cityName: string) => {
  // type search text and hit Enter right after
  cy.get(".gLFyf").type(`${cityName} forecast for next 10 days{enter}`);
  cy.get("a h3").first().click();
  cy.url().should("contain", "weather.com");
});

Then("I decide if {string} worth to visit", (cityName: string) => {
  let temperatureAverage: number = 0;
  cy.get('[data-testid="TemperatureValue"]').each((el, index) => {
    +index;
    if (index > 1) {
      const text: string = el.text();
      temperatureAverage += parseInt(text);
      if (temperatureAverage / 30 / 2 > 45) {
        cy.log("I AM HAPPY!");
      }
    }
  });
});
