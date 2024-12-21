
# Layouts

Layouts is the name given to an entire notification template. This is the place where reusable components of notifications (partials) are pulled together, and the data structure for a notification payload is defined. 

Each directory within `./layouts/` defines an individual template. They must include the following files:

## Layout template file(s) 
At least one template file following the format `<template-type>.handlebars` e.g. `html.handlebars` || `txt.handlebars`. Within this file  the code should follow `Handlebars.js` syntax, if you're not familiar you can find the [docs here](https://handlebarsjs.com/). An example is shown below: 

```handlebars
<html>
  <head>
    <title>Newly added template</title>
  </head>
  <body>
    {{!-- Example of including a partial --}}
    {{> header}}
    {{!-- Example of consuming a variable from the notification payload --}}
    <p>To: {{name}}</p>
    {{> footer}}
  </body>
</html>
```

## model.ts
A `model.ts` file that includes:
- an `IModel` interface describing the data needed for your template. 
- an array of sample data of type `IModel` to be used in template validation scripts
- an annotation of the `IModel` interface to help generate a json schema using the sample data

```typescript
/**
 * Specify required object
 *
 * @examples require(".").sampleData
 */
export interface IModel {
  name: string;
  username: string;
  requestDateTime: string;
}

export const sampleData: IModel[] = [
  {
    name: 'tim',
    username: 'tim@rocketmakers.com',
    requestDateTime: 'Valid date time',
  },
];

```

## Registering layouts for specific notification providers

In order to consume/utilise a layout it must be included under the `"layouts"` property in a `<provider>.json` at the root of your template repository. See [providerJson.md](./providerJson.md) for details on this process.