# CYPRESS SET UP IN CIRCLECI

## CIRCLECI CONFIG.YML file set up:

### Cypress CircleCI Orb

We used the official Cypress CircleCI orb, the Cypress CircleCI Orb is a piece of configuration set in your circle.yml file to correctly install, cache and run Cypress.io tests on CircleCI with very little effort. See this orb in CircleCI Registry. 

Refer to below links for details on how to integrate and access jobs defined in the Cypress orb.

[CirclCi-Cypress Orb Quick Start Guide](https://circleci.com/orbs/registry/orb/cypress-io/cypress#quick-start)

[Github CirclCi-Cypress Orb](https://github.com/cypress-io/circleci-orb)

Example addition of orb in a config.yml file:

```bash
orbs:
  cypress: cypress-io/cypress@1.25.1
```

### Cached Dependencies in CircleCI

Cypress does not have automatic access to the application package.json dependencies cached by CircleCI. CircleCI caches these dependencies in order to optimize its builds, removing the need to fetch and download these dependencies on each build. 


We had to set the Cypress cache folder to the working directory:

```bash
- run:
          name: Install dependencies
          command: |
            sudo CYPRESS_CACHE_FOLDER=~/repo npm i --no-cache git
            sudo CYPRESS_CACHE_FOLDER=~/repo npm i
```


## CIRCLECI PROJECT ENVIRONMENTAL VARIABLES:

As CircleCI has no access to env vars from the local dev environment, it is necessary to add them to the CircleCI project environmental variable section.

Env vars required by Cypress should be prefixed with "CYPRESS_" to allow Cypress to recognise them.

```bash
CYPRESS_BASE_URL	

CYPRESS_CACHE_FOLDER	

CYPRESS_JWT_SECRET
```

CYPRESS_BASE_URL refers to the Hackney https staging address

CYPRESS_CACHE_FOLDER refers to the caching directory set in the config.yml file

CYPRESS_JWT_SECRET refers to the common Hackney jwt secret, the value of which can be found in AWS SSM Parameter Store

## Cypress Browser Testing:

### Where are the cypress tests in the repo?

The Cypress folder is located in the root of the project. 
All tests are within the Cypress/integration folder. 
It’s best practice to create a separate directory for each page you intend to test within the integration folder to aid isolation of tests, eg:

```bash
cypress/integration/workTrayPage
```

Cypress requires you to run your development server first.

Please start the next server before running Cypress tests:

```bash
npm run dev
```

### How to run Cypress tests locally using the Cypress Test Runner

Cypress can run in a full mode and a headless mode.
In full mode Cypress will open a browser (It will give you the option to choose from the available browsers on your machine) and display the page indicated in your tests.
In headless mode it will run the tests in the terminal without displaying the pages under test

Start up the Cypress Test Runner, 
this will display a list of available integration tests:

```bash
npm run cypress:open:dev
```
 
Once you select which test you wish to run the browser displaying the page will open automatically.

The tests run automatically once everything on the page has loaded. Cypress waits for several seconds to ensure any latency doesn’t cause failing tests. If there are click events that result in a new page being rendered, Cypress will also take this into account and wait for everything to load before completing the tests.


For the headless mode, which will run the tests in your terminal:

```bash
npm run cypress:run:dev
```

[Cypress Documentation on writing your first test file](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file)


