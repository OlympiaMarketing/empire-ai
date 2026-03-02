"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type QuestionType = "text" | "select" | "multi-select" | "textarea"

export type Question = {
  id: string
  label: string
  type: QuestionType
  placeholder?: string
  options?: string[]
  required?: boolean
}

export type QuizStepData = {
  title: string
  subtitle: string
  questions: Question[]
}

type QuizStepProps = {
  step: QuizStepData
  currentStep: number
  totalSteps: number
  values: Record<string, string | string[]>
  onChange: (questionId: string, value: string | string[]) => void
  onNext: () => void
  onBack: () => void
}

function SelectOption({
  option,
  selected,
  onClick,
}: {
  option: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-3 rounded-lg border text-sm text-left transition-all",
        selected
          ? "border-cyan bg-cyan/10 text-foreground"
          : "border-border bg-card/50 text-muted-foreground hover:border-cyan/30 hover:bg-card"
      )}
    >
      {option}
    </button>
  )
}

function MultiSelectOption({
  option,
  selected,
  onClick,
}: {
  option: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-2 rounded-full border text-sm transition-all",
        selected
          ? "border-cyan bg-cyan/10 text-foreground"
          : "border-border bg-card/50 text-muted-foreground hover:border-cyan/30"
      )}
    >
      {option}
    </button>
  )
}

export function QuizStep({
  step,
  currentStep,
  totalSteps,
  values,
  onChange,
  onNext,
  onBack,
}: QuizStepProps) {
  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan rounded-full transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step header */}
      <div>
        <h2 className="text-2xl font-bold">{step.title}</h2>
        <p className="text-muted-foreground mt-1">{step.subtitle}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {step.questions.map((question) => {
          const value = values[question.id]

          return (
            <div key={question.id} className="space-y-3">
              <Label className="text-base">{question.label}</Label>

              {question.type === "text" && (
                <Input
                  placeholder={question.placeholder}
                  value={(value as string) || ""}
                  onChange={(e) => onChange(question.id, e.target.value)}
                />
              )}

              {question.type === "textarea" && (
                <textarea
                  placeholder={question.placeholder}
                  value={(value as string) || ""}
                  onChange={(e) => onChange(question.id, e.target.value)}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={4}
                />
              )}

              {question.type === "select" && question.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {question.options.map((option) => (
                    <SelectOption
                      key={option}
                      option={option}
                      selected={value === option}
                      onClick={() => onChange(question.id, option)}
                    />
                  ))}
                </div>
              )}

              {question.type === "multi-select" && question.options && (
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option) => {
                    const selected = Array.isArray(value) && value.includes(option)
                    return (
                      <MultiSelectOption
                        key={option}
                        option={option}
                        selected={selected}
                        onClick={() => {
                          const current = Array.isArray(value) ? value : []
                          if (selected) {
                            onChange(
                              question.id,
                              current.filter((v) => v !== option)
                            )
                          } else {
                            onChange(question.id, [...current, option])
                          }
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-cyan text-background hover:bg-cyan/90"
        >
          {currentStep === totalSteps - 1 ? "Complete" : "Next"}
          {currentStep < totalSteps - 1 && (
            <ArrowRight className="w-4 h-4 ml-2" />
          )}
        </Button>
      </div>
    </div>
  )
}
