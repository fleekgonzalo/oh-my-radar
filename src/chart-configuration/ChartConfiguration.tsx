import { useState } from "react"
import { Input } from "../form-controls"
import { NumberInput } from "../form-controls/NumberInput"
import { DimensionDescriptor, Range, SelectionDescriptor } from "../radar-chart"

import { Dimensions } from "./Dimensions"
import { Selections } from "./Selections"

type Configuration = {
  title: string
  range: Range
  selectionDescriptors: SelectionDescriptor[]
  dimensionDescriptors: DimensionDescriptor[]
}

type Props = {
  activeSelectionId: string
  configuration: Configuration
  onChange: (configuration: Configuration) => void
  onActivateSelection: (selectionId: string) => void
}

export const ChartConfiguration = ({
  configuration,
  activeSelectionId,
  onChange,
  onActivateSelection,
}: Props) => {
  const { title, selectionDescriptors, dimensionDescriptors, range } =
    configuration

  const [min, max] = range

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Title"
        value={title}
        onChange={(title) => onChange({ ...configuration, title })}
      />

      <Selections
        selectionDescriptors={selectionDescriptors}
        activeSelectionId={activeSelectionId}
        onAdd={(selectionDescriptor) =>
          onChange({
            ...configuration,
            selectionDescriptors: [
              ...selectionDescriptors,
              selectionDescriptor,
            ],
          })
        }
        onChange={(updatedSelectionDescriptor) =>
          onChange({
            ...configuration,
            selectionDescriptors: selectionDescriptors.map(
              (selectionDescriptor) => {
                if (selectionDescriptor.id === updatedSelectionDescriptor.id) {
                  return updatedSelectionDescriptor
                }

                return selectionDescriptor
              }
            ),
          })
        }
        onActivate={onActivateSelection}
      />

      <Dimensions
        dimensionDescriptors={dimensionDescriptors}
        onAdd={(dimensionDescriptor) =>
          onChange({
            ...configuration,
            dimensionDescriptors: [
              ...configuration.dimensionDescriptors,
              dimensionDescriptor,
            ],
          })
        }
        onRemove={(dimensionId) =>
          onChange({
            ...configuration,
            dimensionDescriptors: dimensionDescriptors.filter(
              ({ id }) => id !== dimensionId
            ),
          })
        }
      />

      <NumberInput
        label="Min value"
        value={min}
        onChange={(value) =>
          onChange({
            ...configuration,
            range: [Math.min(value, max - 1), max],
          })
        }
      />

      <NumberInput
        label="Max value"
        value={max}
        onChange={(value) =>
          onChange({
            ...configuration,
            range: [min, Math.max(value, min + 2)],
          })
        }
      />
    </div>
  )
}

export function useConfiguration(
  initialValue: Configuration
): [Configuration, (configuration: Configuration) => void] {
  return useState<Configuration>(initialValue)
}
