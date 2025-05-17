#!/usr/bin/env ts-node

import * as handlebars from "handlebars"
import Ajv from "ajv"
import * as path from "path"
import { setDefaultLoggerLevel, createLogger } from "@rocketmakers/shell/logger"
import * as  Args from "@rocketmakers/shell/args"
import {mkdir, readFile, writeFile} from 'fs/promises'
import {existsSync} from 'fs'

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
  const serviceJson = JSON.parse(await readFile(fileName, {'encoding': 'utf8'}))

  const serviceJsonSchema = JSON.parse(await readFile("node_modules/@rocketmakers/orbit-template-http-repository/lib/serviceJsonSchema.json", {encoding: 'utf8'})) 

  const ajv = new Ajv({ allErrors: true, verbose: true })
  const validServiceJson = ajv.validate(serviceJsonSchema, serviceJson)

  if (!validServiceJson) {
    throw new Error(`The file ${fileName} failed to meet the predefined schema with the following errors: ${ajv.errors ? ajv.errors.map((x) => x.message).toString() : ""}`)
  }

  const { partials, layouts } = serviceJson

  logger.info("Registering partials --> ")

  for (const partial in partials) {
    const content = await readFile(partials[partial].path, {encoding: 'utf8'})
    handlebars.registerPartial(partial, content)
    logger.info("Registered partial: ", partial)
  }

  logger.info("Compiling layouts --> ")

  for (const layout in layouts) {
    layouts[layout].templates.forEach(async (template: string) => {
      const content = await readFile(`${layouts[layout].path}/${template}.handlebars`, {'encoding': 'utf8'})

      const data = JSON.parse(await readFile(`${layouts[layout].path}/payloadSchema.json`, {'encoding': 'utf-8'})).examples[0]
      const compile = handlebars.compile(content, { strict: true })

      try {
        const res = compile(data)
        const dir = path.join(__dirname, "../compiledLayouts")
        if (!existsSync(dir)) {
          await mkdir(dir)
        }
        await writeFile(path.join(dir, `${layout}.${template}`), res)
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
