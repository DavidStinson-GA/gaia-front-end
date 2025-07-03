interface NewModule {
  title: string
  about: string
  minutes: string
  learnerPersona: string
  learningObjectives: string[]
  tools: string[]
}

interface Module {
  title: string
  about: string
  tools: string[]
  learnerPersona: string
  prerequisites: string[]
  microlessons: {
    id: number
    title: string
    learningObjective: string
    minutes: string
    outline: string[]
    ledResponse: string
    smeResponse: string
  }[]
}

export type { NewModule, Module }
