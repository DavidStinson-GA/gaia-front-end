// npm
import { z } from "zod"

// helpers
import { tryCatch } from "../helpers/try-catch.js"
import { validateResponseData } from "../helpers/service.js"

// services
import { wsService } from "../services-ws/module.js"

// types
import type { ModuleOutline } from "../types/module-outline.js"
import type { NewModule, Module } from "../types/module.js"

// module constants
const GA_SYSTEMS_BACK_END_URL = import.meta.env.VITE_GAIA_BACK_END_URL as string

// zod
const microlessonSchema = z.object({
  title: z.string(),
  id: z.coerce.number(),
  minutes: z.coerce.number(),
  learningObjective: z.string(),
  outline: z.string().array(),
  ledResponse: z.string(),
  smeResponse: z.string(),
})

const moduleSchema = z.object({
  title: z.string(),
  about: z.string(),
  learnerPersona: z.string(),
  prerequisites: z.string().array(),
  tools: z.string().array(),
  microlessons: z.array(microlessonSchema),
})

const microlessonOutlineSchema = z.object({
  title: z.string(),
  id: z.coerce.number(),
  minutes: z.coerce.number(),
  learningObjective: z.string(),
  outline: z.array(z.string()),
})

const moduleOutlineSchema = z.object({
  title: z.string(),
  about: z.string(),
  tools: z.array(z.string()),
  learnerPersona: z.string(),
  prerequisites: z.array(z.string()),
  microlessons: z.array(microlessonOutlineSchema),
})

async function submitModuleOutlineData(data: ModuleOutline) {
  const [response, responseError] = await tryCatch(
    fetch(`${GA_SYSTEMS_BACK_END_URL}/api/v1/module/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
  )

  if (responseError) {
    throw new Error(`Issue building module: ${responseError.message}`)
  }

  if (!response.ok) {
    throw new Error(`HTTP error - status code: ${response.status.toString()}`)
  }

  const responseData = (await response.json()) as unknown

  const { taskId } = validateResponseData(responseData)

  const generatedModule = await wsService(taskId, "module", "subscribe")

  const { error } = moduleSchema.safeParse(generatedModule)

  if (error) {
    throw new Error(`Received invalid module: ${error.message}`)
  }

  return generatedModule as Module
}

async function submitModuleData(data: NewModule) {
  const [response, responseError] = await tryCatch(
    fetch(`${GA_SYSTEMS_BACK_END_URL}/api/v1/module/outline/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
  )

  if (responseError) {
    throw new Error(`Issue building module outline: ${responseError.message}`)
  }

  if (!response.ok) {
    throw new Error(`HTTP error - status code: ${response.status.toString()}`)
  }

  const responseData = (await response.json()) as unknown

  const { taskId } = validateResponseData(responseData)

  // establish websocket connection and wait for response containing specific
  // data associated with the generatedModuleOutlineId
  const generatedModuleOutline = await wsService(
    taskId,
    "moduleOutline",
    "subscribe",
  )

  console.log("generatedModuleOutline", generatedModuleOutline)

  const { error: zodError } = moduleOutlineSchema.safeParse(
    generatedModuleOutline,
  )

  if (zodError) {
    throw new Error(`Received invalid module outline: ${zodError.message}`)
  }

  return generatedModuleOutline as ModuleOutline
}

async function submitModuleDataCrew(data: NewModule) {
  const [response, responseError] = await tryCatch(
    fetch(`${GA_SYSTEMS_BACK_END_URL}/api/v1/crew/module/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
  )

  if (responseError) {
    console.error(responseError)
    throw new Error(`Issue building module: ${responseError.message}`)
  }

  if (!response.ok) {
    console.error(response)
    throw new Error(`HTTP error - status code: ${response.status.toString()}`)
  }

  const responseData = (await response.json()) as unknown

  const { taskId } = validateResponseData(responseData)

  const generatedModule = await wsService(taskId, "module", "subscribe")

  console.log(generatedModule)

  const { error } = moduleSchema.safeParse(generatedModule)

  if (error) {
    console.error(error)
    throw new Error(`Received invalid module: ${error.message}`)
  }

  return generatedModule as Module
}

export { submitModuleData, submitModuleDataCrew, submitModuleOutlineData }
