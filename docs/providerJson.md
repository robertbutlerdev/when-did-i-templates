# `<provider>.json`

When sending notifications through `@rocketmakers/orbit-template-http-repository` you must include a `<provider>.json` file at the root of your template repository, where `<provider>`  is the third party service you are using for notifications e.g. sendgrid, twilio. This file is responsible for providing your template metadata. This metadata includes: 
- paths to template layout files 
- any partials that need to be registered
- template names within a particular layout

[An example can be found here](../sendgrid.json) for registering/setting up sendgrid templates. The schema for these json files can be found at `node_modules/@rocketmakers/orbit-template-http-repository/lib/serviceJsonSchema.json`.

When creating new templates you should add the appropriate layouts and partials to the `<provider.json>` to ensure they can be tested, when updated, and accessed when sending notifications.