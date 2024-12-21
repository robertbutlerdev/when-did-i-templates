# Managing templates

When managing templates it is important to follow the guidance below to ensure no problems are experienced when sending notifications in production.

## Branching strategy

In this repo notification templates are pulled from the `production` branch. Any changes to template (whether creating, updating or deleting) should take place on a separate branch and create a merge request to be reviewed by another developer/team member.

## Access

Members of this git repository can be granted varying levels of access, to update templates and approve merge requests, in the [project settings](https://github.com/robertbutlerdev/when-did-i-templates/settings/access).

## Generating payload schemas

Payload json schemas can be generated for all layouts within this directory by running:

```bash
npm run generate-payload-schemas
```

This will generate a `payloadSchema.json` file within your layout template directory, which will be used to validate payloads when sending notifications.

## Testing templates

You can test sendgrid templates within this repository by running the following:

```bash
npm run test-sendgrid-templates
```

This will look in your `sendgrid.json` file and make sure all registered layouts compile successfully with the provided partials and sample data.

## Viewing a compiled template

Run the following script to compile out each layout to the `compiledLayouts` dir. The script uses test data from your `model.ts` and allows you to visualise the end product for a notification.

```bash
npm run compile-layouts -- -s=<serviceName>
```

## Creating/updating a template

When creating a new template you will need to construct a new [layout](./layouts.md), which should then be registered in your [`<provider>.json`](./providerJson.md) file. If you create any new [partials](./partials.md) they will also need to be added to this file. Conversely if you delete an entire template or any partials these changes also need to be reflected within your `<provider>.json` file.

_Whenever any change to this template repository are made you should run both of the following scripts:_

```bash
# Ensure schemas generate successfully and are up to date
npm run gen-payload-schemas

# Test example payload data against defined templates
npm run test-sendgrid-templates
```

This will make sure any potentially breaking/incorrect changes to notifications are not merged into `production`.

## Deploying changes/updates to notification templates

When changes are made to this template repository there is no need to re-deploy your API/application. You can call the endpoint below to reload the notification template cache within the deployed api. From then on all notifications will be sent using the newly updated templates.

```bash
# POST request to: {{WhenDidIAPI}}/templates/update
```

## Branching & environments

Currently there are two branches active for this repository: `production` and `test`. The WhenDidI source code repository targets those branches in the deployed production and local dev environments respectively. This means that any changes to the `test` branch can be manually checked using a locally deployed version of the WhenDidI API. Once those checks are complete the `test` branch can be merged back into `production`.

Although there are not currently any CI jobs running on creation of a merge request or access controls setup for who can create/merge branches in this repository, these are both configurable features within this type of git managed template repository.
