import { useEffect, useState } from "react"
import { v4 } from "uuid"
import { ChartConfiguration, useConfiguration } from "./chart-configuration"
import { RadarChart, Selection, SelectionState, Colors } from "./radar-chart"

type ChartState = {
  [selection: string]: SelectionState
}

export const DevConfiguration = () => {
  const [chartState, setChartState] = useState<ChartState>({})
  const size = useAutoResize()
  const [activeParticipantId, setActiveParticipantId] = useState<string>("john")
  const [{ title, dimensions, participants, range }, onChangeConfiguration] =
    useConfiguration({
      title: "Test",
      range: [1, 4],
      dimensions: [
        { id: "one", title: "One" },
        { id: "two", title: "Two" },
        { id: "three", title: "Three" },
      ],
      participants: [{ id: "john", name: "john", color: Colors.blue }],
    })

  return (
    <div className="grid grid-cols-2">
      <div className="m-24">
        <RadarChart
          title={title}
          dimensions={dimensions}
          range={range}
          size={size}
        >
          {participants.map(({ id, name, color }) => (
            <Selection
              key={id}
              active={activeParticipantId === id}
              name={name}
              value={chartState[id]}
              onChange={(value) =>
                setChartState({ ...chartState, [id]: value })
              }
              color={color}
            />
          ))}
        </RadarChart>
      </div>

      <div className="mt-24 mr-24">
        <ChartConfiguration
          activeParticipantId={activeParticipantId}
          configuration={{
            title,
            dimensions,
            participants,
            range,
          }}
          onAddDimension={(dimension) =>
            onChangeConfiguration({
              dimensions: [...dimensions, { id: v4(), ...dimension }],
            })
          }
          onRemoveDimension={(dimensionId) =>
            onChangeConfiguration({
              dimensions: dimensions.filter(({ id }) => id !== dimensionId),
            })
          }
          onChange={onChangeConfiguration}
          onActivateParticipant={setActiveParticipantId}
          onSubmit={() => {}}
        />
      </div>
    </div>
  )
}

const useAutoResize = () => {
  const [size, setSize] = useState(window.innerWidth / 3)

  useEffect(() => {
    const callback = () => setSize(window.innerWidth / 3)

    window.addEventListener("resize", callback)

    return () => {
      window.removeEventListener("resize", callback)
    }
  }, [])

  return size
}
