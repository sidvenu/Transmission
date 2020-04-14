import React, { useEffect } from "react"
import "./project-form.css"
import { Dropdown } from "../components/dropdown"
import { Input } from "../components/input"
import { Heading } from "../components/heading"
import { Button } from "../components/button"
import Logic, { TransmissionInput, TransmissionOutput } from "../logic"

const ProjectForm = ({
  setTransmissionOutput,
}: {
  setTransmissionOutput: any
}) => {
  const typesOfSystem = [
    { name: "Symmetrical Spacing", value: "symmetrical" },
    { name: "Unsymmetrical Spacing", value: "unsymmetrical" },
  ]
  const modelsOfTheLine = [
    { name: "Short", value: "short" },
    { name: "Nominal Pi", value: "nominal-pi" },
    { name: "Long", value: "long" },
  ]
  const [transmissionInput, setTransmissionInput] = React.useState({
    typeOfSystem: "symmetrical",
    modelOfTheLine: "short",
  } as TransmissionInput)

  const generateReport = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (transmissionInput.typeOfSystem === "symmetrical") {
      transmissionInput.spacingBetweenPhaseConductors2 =
        transmissionInput.spacingBetweenPhaseConductors1
      transmissionInput.spacingBetweenPhaseConductors3 =
        transmissionInput.spacingBetweenPhaseConductors1
    }
    const transmissionOutput = Logic(transmissionInput)
    console.log(transmissionInput)
    console.log(transmissionOutput)

    setTransmissionOutput(transmissionOutput)
    const url = window.location.href
    window.location.href = `${url.substring(0, url.indexOf("#"))}#result`
    event.preventDefault()
  }

  return (
    <section id="project" className="flex-container direction-column">
      <Heading headingType="h2">Enter info about the system</Heading>
      <form>
        <Dropdown
          label="Type of System"
          id="typeOfSystem"
          nameValuePairs={typesOfSystem}
          value={transmissionInput.typeOfSystem}
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              typeOfSystem: e.currentTarget.value,
            })
          }}
        />
        <div className="three-input-group flex-container direction-row">
          <Input
            label="Spacing between the phase conductors (mm)"
            id="spacingPhaseConductors1"
            type="number"
            onChange={e => {
              setTransmissionInput({
                ...transmissionInput,
                spacingBetweenPhaseConductors1: Number(e.currentTarget.value),
              })
            }}
          />
          <Input
            label=" "
            id="spacingPhaseConductors2"
            type="number"
            disabled={transmissionInput.typeOfSystem == "symmetrical"}
            className={
              transmissionInput.typeOfSystem == "symmetrical" ? "disabled" : ""
            }
            onChange={e => {
              setTransmissionInput({
                ...transmissionInput,
                spacingBetweenPhaseConductors2: Number(e.currentTarget.value),
              })
            }}
          />
          <Input
            label=" "
            id="spacingPhaseConductors3"
            type="number"
            disabled={transmissionInput.typeOfSystem == "symmetrical"}
            className={
              transmissionInput.typeOfSystem == "symmetrical" ? "disabled" : ""
            }
            onChange={e => {
              setTransmissionInput({
                ...transmissionInput,
                spacingBetweenPhaseConductors3: Number(e.currentTarget.value),
              })
            }}
          />
        </div>
        <Input
          label="Number of sub-conductors per bundle"
          id="numSubconductorsPerBundle"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              numSubconductorsPerBundle: Number(e.currentTarget.value),
            })
          }}
        />
        <Input
          label="Spacing between the sub-conductors (mm)"
          id="spacingSubconductors"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              spacingBetweenSubconductors: Number(e.currentTarget.value),
            })
          }}
        />
        <Input
          label="Number of strands in each sub-conductor"
          id="numStrandsPerSubconductor"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              numStrandsPerSubconductor: Number(e.currentTarget.value),
            })
          }}
        />
        <Input
          label="Diameter of each strand (mm)"
          id="diameterOfEachStrand"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              diameterOfEachStrand: Number(e.currentTarget.value),
            })
          }}
        />
        <Input
          label="Length of the line (km)"
          id="lengthOfTheLine"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              lengthOfTheLine: Number(e.currentTarget.value),
            })
          }}
        />
        <Dropdown
          label="Model of the line"
          id="modelOfTheLine"
          nameValuePairs={modelsOfTheLine}
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              modelOfTheLine: e.currentTarget.value,
            })
          }}
        />
        <Input
          label="Resistance of the line (&#8486;/km)"
          id="resistanceOfTheLine"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              resistanceOfTheLine: Number(e.currentTarget.value),
            })
          }}
        />
        <Input
          label="Power Frequency (Hz)"
          id="powerFrequency"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              powerFrequency: Number(e.currentTarget.value),
            })
          }}
        />
        <Input
          label="Nominal System Voltage (kV)"
          id="nominalSystemVoltage"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              nominalSystemVoltage: Number(e.currentTarget.value),
            })
          }}
        />
        <Input
          label="Receiving end load (MW)"
          id="receivingEndLoad"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              receivingEndLoad: Number(e.currentTarget.value),
            })
          }}
        />
        <Input
          label="Power factor of receiving end load"
          id="powerFactorOfReceivingEndLoad"
          type="number"
          onChange={e => {
            setTransmissionInput({
              ...transmissionInput,
              powerFactorOfReceivingEndLoad: Number(e.currentTarget.value),
            })
          }}
        />
        <Button
          id="submit"
          className="icon-button outline-button"
          onClick={generateReport}
        >
          Generate Report<span className="material-icons">assignment</span>
        </Button>
      </form>
    </section>
  )
}

export default ProjectForm
