# Manage A Tenancy Service

## Introduction

## Getting Started

### First install dependencies and set up the environment

```bash
npm install
cp .env.sample .env
```

### To run the next.js development server

```bash
npm run dev
```

### To run serverless offline

```bash
npm run build
sls offline
```

### To run unit tests

```bash
npm run test:unit
npm run test:unit:watch
npm run test:unit:coverage
```

To run integration tests:

```bash
npm run build
sls offline
npm run test:integration
```

### To run Cypress tests

There is a CYPRESS-CIRCLECI.md file in the repo with detailed instructions on Cypress/CircleCi configuration and how Cypress tests run.

Please ensure you have the development server running first

```bash
npm run dev
```

To run the tests in full mode which generates a browser

```bash
npm run cypress:open
```

To run the tests in the terminal without a browser

```bash
npm run cypress:run
```

### Releasing versions

1. Decide on a new version number, where `x.y.z` is the new version
   number, following [Semantic Versioning](https://semver.org/spec/v2.0.0.html). (The current version number can be found in `package.json`)

2. Run the version bumping script:

   ```sh
   bin/bump-version "x.y.z"
   ```

3. Push the branch and create a pull request, copying the contents of this
   version from the changelog into the description.

4. Get the pull request reviewed and merge the pull request.

## Related Projects

### APIs

- [ManageATenancyAPI](https://github.com/LBHackney-IT/ManageATenancyAPI) [legacy]
- [Manage_a_tenancy_API](https://github.com/LBHackney-IT/Manage_a_tenancy_API) [v1]
- [mat-reporting-api](https://github.com/LBHackney-IT/mat-reporting-api)
- [mat-process-api](https://github.com/LBHackney-IT/mat-process-api)

#### Process Apps

- [ManageATenancyProcessWebApp](https://github.com/LBHackney-IT/ManageATenancyProcessWebApp) [legacy]
- [mat-process-template](https://github.com/LBHackney-IT/mat-process-template)
- [mat-process-thc](https://github.com/LBHackney-IT/mat-process-thc)
- [mat-process-homecheck](https://github.com/LBHackney-IT/mat-process-homecheck)
- [mat-process-itv](https://github.com/LBHackney-IT/mat-process-itv)
- [mat-process-utils](https://github.com/LBHackney-IT/mat-process-utils)
