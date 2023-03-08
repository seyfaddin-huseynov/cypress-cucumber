Feature: Weather in Boston

    Scenario: Check the forecast for the next 10 days
        Given I am at url "https://www.google.com/"
        Then I search for next 10 days forecast in "Boston"
        Then I decide if "Boston" worth to visit