import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("I search for next 10 days forecast in {string}", (cityName: string) => {
  // type search text and hit Enter right after
  cy.get(".gLFyf").type(`${cityName} forecast for next 10 days{enter}`);
  cy.get("a h3").first().click();
  cy.url().should("contain", "weather.com");
});

Then("I decide if {string} worth to visit", (cityName: string) => {
  let temperatureSum: number = 0;
  cy.get('[class*="DetailsSummary--highTempValue"]').as("highTempValues");
  // using Xpath selector to get only daily temperature for the next 14 days.
  for (let index = 1; index < 15; index++) {
    cy.get("@highTempValues")
      .eq(index)
      .invoke("text")
      .then((el) => {
        const text: string = el;
        temperatureSum += parseInt(text);
        const temperatureAverage = temperatureSum / 14;
        // if temperature more than 9 C° or 45 F°  
        if ((temperatureAverage > 7 || temperatureAverage > 45) && index === 14) {
          cy.log(
            `THE TEMPERATURE WILL BE AROUND ${Math.round(
              temperatureAverage
            ).toString()} °, I THINK WE SHOULD VISIT BOSTON 😊 🦃`
          );
        }
        else if((temperatureAverage < 7 || temperatureAverage < 45) && index === 14){
          cy.log("I THINK MIAMI FOR NOW 🌴🌴🌴😎🌴🌴🌴")
        }
      });
  }
});
