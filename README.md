# Table

A _simple_ table Contentful UI extension: [view demo](https://pdq.github.io/contentful-table/)

## Configure

Create a configuration file with your credentials for Contentful.

```sh
cp .env.example .env
```

Add `SPACE_ID` and `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` values in order to upload this extension to your Contentful space.

## Publish

Publish commands with `source ./.env` which will only work with unix workstations. For a cross-platform experience, we're [waiting](https://github.com/toddbluhm/env-cmd/issues/112) on a new release with [env-cmd](https://www.npmjs.com/package/env-cmd) for variable expansion in NPM scripts.

## Contentful

You must create the extension manually in the Contentful Extensions console. See [#issues](#issues) below for more information.

### Create

```sh
npm run contentful:create
```

Create task will register the extension in your space on Contentful.

### Update

```sh
npm run contentful:update
```

Update task will upload the extension to your space on Contentful.

## Develop

```sh
npm start
```

### Documentation

- [contentful-cli extension API](https://github.com/contentful/contentful-cli/tree/master/docs/extension)
- [contentful-ui-extensions-sdk API](https://github.com/contentful/ui-extensions-sdk)

### Issues

- [Updating the extension `src` via the CLI does not work](https://github.com/contentful/contentful-cli/issues/217) - in the meantime, you must do this via the console: https://app.contentful.com/spaces/${SPACE_ID}/settings/extensions
- [`Uncaught ReferenceError: regeneratorRuntime`](https://github.com/parcel-bundler/parcel/issues/1762) - workaround: using `"browserslist": ["last 1 Chrome versions"]`. [To be fixed in Parcel 2.0](https://github.com/parcel-bundler/parcel/issues/1762#issuecomment-480687638)
- [`env-cmd` variable expansion in NPM scripts](https://github.com/toddbluhm/env-cmd/issues/112)
