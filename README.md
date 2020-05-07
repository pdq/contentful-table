# Table

A _simple_ table Contentful UI extension: [view demo](https://pdq.github.io/contentful-table/)

## Contentful

### Console

Create an extension and add this link to the src field:

```
https://pdq.github.io/contentful-table/
```

### CLI

First, [setup](#setup) your environment.

#### Configure

Create a configuration file with your credentials for Contentful.

```sh
cp .env.example .env
```

Add `SPACE_ID`, `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` and other values in `.env` in order to upload this extension to your Contentful space.

Then, source the variables into your environment. For a cross-platform experience, we're [waiting](https://github.com/toddbluhm/env-cmd/issues/112) on a new release of [env-cmd](https://www.npmjs.com/package/env-cmd) for variable expansion in NPM scripts.

#### Create

```sh
npm run contentful:create
```

This will register the extension in your space on Contentful.

#### Update

Since the extension is self-hosted, the project does not need to be updated in Contentful after changes are made. However, if fields like `EXTENSION_NAME` or `EXTENSION_SRC` are altered, then the extension should be updated.

```sh
npm run contentful:update
```

### Content Model

To use this UI extension in a Content Model:

1. Add a new field `JSON Object`
1. Configure the field under the "Appearance" tab to use the UI Extension "Table"

## Setup

Install the dependencies:

```sh
npm install
```

## Publish

To publish your own hosted URL, you may deploy changes to the extension hosted from `gh-pages`. Merge your changes into `master` to initiate the Github Actions hook or run:

```sh
npm run publish
```

If you elect to use Github Actions to automate deployment, make sure to add a deployment key to deploy to your repo's Github Actions as [documented here](https://github.com/marketplace/actions/github-pages-action#1-add-ssh-deploy-key).

## Develop

```sh
npm start
```

### Documentation

- [contentful-cli extension API](https://github.com/contentful/contentful-cli/tree/master/docs/extension)
- [contentful-ui-extensions-sdk API](https://github.com/contentful/ui-extensions-sdk)

### Issues

- [`Uncaught ReferenceError: regeneratorRuntime`](https://github.com/parcel-bundler/parcel/issues/1762) - workaround: using `"browserslist": ["last 1 Chrome versions"]`. [To be fixed in Parcel 2.0](https://github.com/parcel-bundler/parcel/issues/1762#issuecomment-480687638)
- [`env-cmd` variable expansion in NPM scripts](https://github.com/toddbluhm/env-cmd/issues/112)

## Code of Conduct

This project has adopted the [Contributor Covenant](https://www.contributor-covenant.org/). For more information see this project's [Code of Conduct](./CODE_OF_CONDUCT.md).

## License
Copyright (c) PDQ.com. All rights reserved.

Licensed under the [MIT license](./LICENSE).
