# Table

A _simple_ table Contentful UI extension

## Configure

Create a configuration file with your credentials for Contentful.

```sh
cp .env.example .env
```

Add `SPACE_ID` and `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` values in order to upload this extension to your Contentful space.

## Publish

### Create

```sh
npm run publish:create
```

Create task will register the extension in your space on Contentful.


### Update

```sh
npm run publish:update
```

Update task will upload the extension to your space on Contentful.

## Develop

```sh
npm start
```

### Documentation

- [contentful-cli extension API](https://github.com/contentful/contentful-cli/tree/master/docs/extension)
- [contentful-ui-extensions-sdk API](https://github.com/contentful/ui-extensions-sdk)
