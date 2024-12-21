# Partials

Partials are reusable components within notification templates and like templates as a whole they can be passed an object of data and parse the variables in line to produce a notification.

## Partial template file

Only one `.handlebars` file is needed when creating a partial. Within this file the code should follow `Handlebars.js` syntax, if you're not familiar you can find the [docs here](https://handlebarsjs.com/). Partials should be saved in the following format `partials/<template-type>/<template-name>.handlers` e.g. `partials/html/header.handlebars` || `partials/txt/header.handlebars`. An example `header` partial is shown below:

```handlebars
<header>
  <h2>To {{name}}</h2>
</header>
```

## Consuming partials

Partials can be pulled together into [layouts](./layouts.md) to reduce repetition and maintenance needed across templates. The following syntax is used to include a partial `{{> myCoolPartial }}`, and an example layout is shown below:

```handlebars
<html>
  <head>
    <title>Example template</title>
  </head>
  <body>
    {{> examplePartial}}
  </body>
</html>
```

## Registering partials for specific notification providers

In order to consume/utilise a layout it must be included under the `"partials"` property in a `<provider>.json` at the root of your template repository. See [providerJson.md](./providerJson.md) for details on this process.