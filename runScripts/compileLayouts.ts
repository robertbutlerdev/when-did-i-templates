#!/usr/bin/env ts-node

import * as handlebars from "handlebars"
import * as Ajv from "ajv"
import * as path from "path"
import { setDefaultLoggerLevel, createLogger } from "@rocketmakers/shell-commands/lib/logger"
import { Args } from "@rocketmakers/shell-commands/lib/args"
import { FileSystem } from "@rocketmakers/shell-commands/lib/fs"

const logger = createLogger("generate-schemas")

async function run() {
  const args = await Args.match({
    log: Args.single({
      description: "The log level",
      shortName: "l",
      defaultValue: "info",
      validValues: ["trace", "debug", "info", "warn", "error", "fatal"],
    }),
    serviceName: Args.single({
      description: "Name of 3rd party service root json file is named after",
      shortName: "s",
      mandatory: true,
    }),
  })

  if (!args) {
    if (process.argv.includes("--help")) {
      return
    }

    throw new Error("There was a problem parsing the arguments")
  }

  const { log, serviceName } = args

  setDefaultLoggerLevel(log as any)

  const fileName = `${serviceName}.json`
  const serviceJson = JSON.parse(FileSystem.readFile(fileName))

  const serviceJsonSchema = JSON.parse(FileSystem.readFile("node_modules/@rocketmakers/orbit-template-http-repository/lib/serviceJsonSchema.json"))

  const ajv = new Ajv({ allErrors: true, verbose: true })
  const validServiceJson = ajv.validate(serviceJsonSchema, serviceJson)

  if (!validServiceJson) {
    throw new Error(`The file ${fileName} failed to meet the predefined schema with the following errors: ${ajv.errors ? ajv.errors.map((x) => x.message).toString() : ""}`)
  }

  const { partials, layouts } = serviceJson

  logger.info("Registering partials --> ")

  for (const partial in partials) {
    const content = FileSystem.readFile(partials[partial].path)
    handlebars.registerPartial(partial, content)
    logger.info("Registered partial: ", partial)
  }

  logger.info("Compiling layouts --> ")

  for (const layout in layouts) {
    layouts[layout].templates.forEach(async (template: string) => {
      const content = FileSystem.readFile(`${layouts[layout].path}/${template}.handlebars`)

      const data = JSON.parse(FileSystem.readFile(`${layouts[layout].path}/payloadSchema.json`)).examples[0]
      const compile = handlebars.compile(content, { strict: true })

      try {
        const res = compile(data)
        const dir = path.join(__dirname, "../compiledLayouts")
        if (!FileSystem.exists(dir)) {
          await FileSystem.makeDirectory(dir)
        }
        await FileSystem.writeFileAsync(path.join(dir, `${layout}.${template}`), res)
        logger.trace("Compiled template: ", res)
      } catch (error: any) {
        throw new Error(error)
      }
    })
    logger.info("Compiled layout: ", layout)
  }

  logger.info("Templates successfully validated for service: ", serviceName)
}

run().catch((err) => {
  logger.fatal(err)
  process.exit(-1)
})
