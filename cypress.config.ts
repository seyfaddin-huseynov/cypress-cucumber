import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import browserify from "@badeball/cypress-cucumber-preprocessor/browserify";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    browserify(config, {
      typescript: require.resolve("typescript"),
    })
  );

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  defaultCommandTimeout: 10000,
  chromeWebSecurity: false,
  reporter: "junit",
  reporterOptions: {
    mochaFile: "cypress/reports/results.xml",
    toConsole: false,
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  pageLoadTimeout: 120000,
  env: {
    username: "uitester@wilsonlanguage.com",
  },
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    baseUrl: "https://hydra.wilsonacademy.com:5001",
    setupNodeEvents,
  },
});
