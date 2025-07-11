// npm
import { useState } from "react"
import { useNavigate } from "react-router"

// components
import ArrayInput from "../../../components/form/ArrayInput/ArrayInput"
import FormInput from "../../../components/form/FormInput/FormInput"

// services
import { submitModuleData, submitModuleDataCrew } from "../../../services/module"

// helpers
import { tryCatch } from "../../../helpers/try-catch"

// data
import { exampleData } from "./example-data"

// types
import type { NewModule as FormData } from "../../../types/module"

// component
function NewModule() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    title: "",
    about: "",
    minutes: "",
    learnerPersona: "",
    learningObjectives: [""],
    tools: [""],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateItem = (
    field: keyof FormData,
    index: number,
    value: string,
  ) => {
    if (Array.isArray(formData[field])) {
      const newArray = Array.from(formData[field] as string[])
      newArray[index] = value
      setFormData((prev) => ({ ...prev, [field]: newArray }))
    }
  }

  const addItem = (field: keyof FormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }))
  }

  const removeItem = (field: keyof FormData, index: number) => {
    const newArray = Array.from(formData[field] as string[])
    newArray.splice(index, 1)
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent, isCrew: boolean) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (isSubmitting) return

    const submissionData = cleanUpData()

    if (isCrew) {
      const [response, error] = await tryCatch(
        submitModuleDataCrew(submissionData),
      )

      if (error) {
        handleSubmitError(error)
        setIsSubmitting(false)
        return
      }

      console.log(response)

      await navigate(`/module/show`, { state: { response } })
    } else {
      const [response, error] = await tryCatch(submitModuleData(submissionData))

      if (error) {
        handleSubmitError(error)
        setIsSubmitting(false)
        return
      }

      console.log(response)

      await navigate(`/module/outline/edit`, { state: { response } })
    }

    setIsSubmitting(false)
  }

  function cleanUpData() {
    const filteredObjectives = formData.learningObjectives.filter(
      (obj) => obj.trim() !== "",
    )

    const filteredTools = formData.tools.filter((tool) => tool.trim() !== "")

    let numMinutes = parseInt(formData.minutes)

    if (isNaN(numMinutes)) numMinutes = 0

    return {
      ...formData,
      learningObjectives: filteredObjectives,
      tools: filteredTools,
      minutes: numMinutes.toString(),
    }
  }

  function handleSubmitError(error: unknown) {
    setError(
      error instanceof Error
        ? error.message
        : "An error occurred while submitting the form",
    )
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <form className="space-y-4">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => {setFormData(exampleData)}}
          className="mt-1 w-full flex justify-center px-3 py-2 border border-transparent text-sm leading-4 font-bold rounded-md text-accent-on-subtle-background bg-background-subtle hover:bg-background-subtle-hover hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Use demo data (this clears existing data)
        </button>

        <FormInput
          label="Module Title"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter module title"
          required
        />

        <FormInput
          label="About the Module"
          id="about"
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Enter module topic"
          rows={6}
          required
        />

        <FormInput
          label="Module Duration (minutes)"
          id="minutes"
          name="minutes"
          value={formData.minutes}
          onChange={handleInputChange}
          type="number"
          min="1"
          placeholder="Enter duration in minutes"
          required
        />

        <FormInput
          label="Learner Persona"
          id="learnerPersona"
          name="learnerPersona"
          value={formData.learnerPersona}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Describe the target learner persona"
          required
          rows={4}
        />

        <ArrayInput
          label="Learning Objectives"
          values={formData.learningObjectives}
          onUpdate={(index: number, value: string) => {
            updateItem("learningObjectives", index, value)
          }}
          onAdd={() => {addItem("learningObjectives")}}
          onRemove={(index: number) => {
            removeItem("learningObjectives", index)
          }}
          placeholder="Learning objective"
          required
        />

        <ArrayInput
          label="Module Tools"
          values={formData.tools}
          onUpdate={(index: number, value: string) => {
            updateItem("tools", index, value)
          }}
          onAdd={() => {addItem("tools")}}
          onRemove={(index: number) => {
            removeItem("tools", index)
          }}
          placeholder="Tool"
          required
        />

        <hr />

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-background-accent hover:bg-background-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={(e) => {void handleSubmit(e, true)}}
        >
          {isSubmitting ? "Submitting..." : "Submit to Option 1"}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-background-accent hover:bg-background-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={(e) => {void handleSubmit(e, false)}}
        >
          {isSubmitting
            ? "Submitting..."
            : "Submit to Option 2 (with the ability to edit the outline)"}
        </button>
      </form>
    </main>
  )
}

export default NewModule
