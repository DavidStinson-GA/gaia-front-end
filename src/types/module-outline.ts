interface Microlesson {
  id: number
  title: string
  learningObjective: string
  minutes: string
  outline: string[]
}

interface ModuleOutline {
  title: string
  about: string
  tools: string[]
  learnerPersona: string
  prerequisites: string[]
  microlessons: Microlesson[]
}

export type { Microlesson, ModuleOutline }
