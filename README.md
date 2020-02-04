# Table

A _simple_ table Contentful UI extension: [view demo](https://pdq.github.io/contentful-table/)

## Configure

Create a configuration file with your credentials for Contentful.

```sh
cp .env.example .env
```

Add `SPACE_ID` and `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` values in order to upload this extension to your Contentful space.

## Publish

To deploy changes to the extension hosted on `gh-pages`, you may merge your changes into `master` to initiate the Github Actions hook or run:

```sh
npm run publish
```

## Contentful

Publish commands with `source ./.env` which will only work with unix workstations. For a cross-platform experience, we're [waiting](https://github.com/toddbluhm/env-cmd/issues/112) on a new release with [env-cmd](https://www.npmjs.com/package/env-cmd) for variable expansion in NPM scripts.

### Create

```sh
npm run contentful:create
```

Create task will register the extension in your space on Contentful.

### Update

Since the extension is self-hosted, the project does not need to be updated in Contentful after changes are made. However, if fields like `EXTENSION_NAME` or `EXTENSION_SRC` are altered, then the extension should be updated.

```sh
npm run contentful:update
```

### Content Model

To use this UI extension in a Content Model:

1. Add a new field `JSON Object`
1. Configure the field under the "Appearance" tab to use the UI Extension "Table"

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
