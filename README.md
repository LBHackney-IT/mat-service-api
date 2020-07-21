# Manage A Tenancy Service

## Introduction

## Getting Started

### First install dependencies

```bash
npm install
```

### To run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### To run tests

```bash
npm run test
npm run test:watch
npm run test:coverage
```

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

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
