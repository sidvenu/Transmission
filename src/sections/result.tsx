import React, { useEffect } from "react"
import "./result.css"
import { TransmissionOutput } from "../logic"
import * as math from "mathjs"
import Desmos from "desmos"
import { Heading } from "../components/heading"

const formattedNumber = (number: number) => {
  if (number === undefined) return ""
  return `(${math
    .format(number, { notation: "engineering", precision: 4 })
    .replace("e+0", "")})`
}

const formattedComplexNumber = (number: math.Complex) => {
  if (number === undefined) return ""
  return `${formattedNumber(number.re)}${number.im > 0 ? "+" : ""}${
    number.im !== 0 ? `${formattedNumber(number.im)}j` : ""
  }`
}

const formattedCircleCentre = (circleCentre: { x: number; y: number }) => {
  if (circleCentre === undefined) return ""
  return `x: ${formattedNumber(circleCentre.x)}, y: ${formattedNumber(
    circleCentre.y
  )}`
}

let calculator: any

const getNewCalculator = () => {
  const e = document.querySelector("#resultGraph")
  if (e) e.innerHTML = ""
  calculator = Desmos.GraphingCalculator(e)
}

const getLatexExpressionForCircle = (
  radius: number,
  centre: { x: number; y: number }
) => `(y-${centre.y})^2+(x-${centre.x})^2 = ${radius}^2`

const getBounds = (
  radius1: number,
  centre1: { x: number; y: number },
  radius2: number,
  centre2: { x: number; y: number }
) => {
  const bounds = {
    left: 0,
    right: 10,
    bottom: 0,
    top: 10,
  }
  if (centre1.x - radius1 < centre2.x - radius2) {
    bounds.left = centre1.x - radius1
  } else {
    bounds.left = centre2.x - radius2
  }
  if (centre1.x + radius1 > centre2.x + radius2) {
    bounds.right = centre1.x + radius1
  } else {
    bounds.right = centre2.x + radius2
  }
  if (centre1.y - radius1 < centre2.y - radius2) {
    bounds.bottom = centre1.y - radius1
  } else {
    bounds.bottom = centre2.y - radius2
  }
  if (centre1.y + radius1 > centre2.y + radius2) {
    bounds.top = centre1.y + radius1
  } else {
    bounds.top = centre2.y + radius2
  }

  const w = bounds.right - bounds.left
  const h = bounds.top - bounds.bottom

  bounds.left -= 0.2 * w
  bounds.right += 0.2 * w
  bounds.bottom -= 0.2 * h
  bounds.top += 0.2 * h

  return bounds
}

const setGraph = (transmissionOutput: TransmissionOutput) => {
  if (
    !(
      transmissionOutput.sendingEndCircleCentre &&
      transmissionOutput.sendingEndCircleRadius &&
      transmissionOutput.receivingEndCircleCentre &&
      transmissionOutput.receivingEndCircleRadius
    )
  ) {
    return
  }

  if (!calculator) {
    getNewCalculator()
  }

  calculator.setExpression({
    id: "sendingEndCircleDiagram",
    latex: getLatexExpressionForCircle(
      transmissionOutput.sendingEndCircleRadius,
      transmissionOutput.sendingEndCircleCentre
    ),
    color: "#1B5E20",
    lineStyle: Desmos.Styles.SOLID,
  })
  calculator.setExpression({
    id: "receivingEndCircleDiagram",
    latex: getLatexExpressionForCircle(
      transmissionOutput.receivingEndCircleRadius,
      transmissionOutput.receivingEndCircleCentre
    ),
    color: "#BF360C",
    lineStyle: Desmos.Styles.SOLID,
  })
  calculator.setMathBounds(
    getBounds(
      transmissionOutput.sendingEndCircleRadius,
      transmissionOutput.sendingEndCircleCentre,
      transmissionOutput.receivingEndCircleRadius,
      transmissionOutput.receivingEndCircleCentre
    )
  )
}

const Result = ({
  transmissionOutput,
}: {
  transmissionOutput: TransmissionOutput
}) => {
  useEffect(() => {
    getNewCalculator()
  }, [])
  useEffect(() => {
    setGraph(transmissionOutput)
  }, [transmissionOutput])
  return (
    <section id="result" className="flex-container direction-column">
      <Heading headingType="h2">Result</Heading>
      <p>
        Inductance per phase per km (H/km)
        <span>
          {formattedNumber(transmissionOutput.inductancePerPhasePerKm)}
        </span>
        <br />
        Capacitance per phase per km (F/km)
        <span>
          {formattedNumber(transmissionOutput.capacitancePerPhasePerKm)}
        </span>
        <br />
        Inductive reactance of the line (&#8486;)
        <span>
          {formattedNumber(transmissionOutput.inductiveReactanceOfTheLine)}
        </span>
        <br />
        Capacitive reactance of the line (&#8486;)
        <span>
          {formattedNumber(transmissionOutput.capacitiveReactanceOfTheLine)}
        </span>
        <br />
        Charging current drawn from the sending end substation (A)
        <span>
          {formattedComplexNumber(
            transmissionOutput.chargingCurrentDrawnFromSendingEndSubstation
          )}
        </span>
        <br />
        A: <span>{formattedComplexNumber(transmissionOutput.A)}</span> B:
        <span>{formattedComplexNumber(transmissionOutput.B)}</span> C:
        <span>{formattedComplexNumber(transmissionOutput.C)}</span> D:
        <span>{formattedComplexNumber(transmissionOutput.D)}</span> <br />
        Sending end voltage (kV)
        <span>
          {formattedComplexNumber(transmissionOutput.sendingEndVoltage)}
        </span>
        <br />
        Sending end current (A)
        <span>
          {formattedComplexNumber(transmissionOutput.sendingEndCurrent)}
        </span>
        <br />
        Voltage Regulation (%)
        <span>
          {formattedNumber(transmissionOutput.percentageVoltageRegulation)}
        </span>
        <br />
        Power Losses in the line (MW)
        <span>{formattedNumber(transmissionOutput.powerLossInTheLine)}</span>
        <br />
        Transmission Efficiency
        <span>
          {formattedNumber(transmissionOutput.transmissionEfficiency)}
        </span>
        <br />
        <br />
        <br />
        <span className="green">Sending end</span> circle centre
        <span>
          {formattedCircleCentre(transmissionOutput.sendingEndCircleCentre)}
        </span>
        <br />
        <span className="green">Sending end</span> circle radius
        <span>
          {formattedNumber(transmissionOutput.sendingEndCircleRadius)}
        </span>
        <br />
        <span className="orange">Receiving end</span> circle centre
        <span>
          {formattedCircleCentre(transmissionOutput.receivingEndCircleCentre)}
        </span>
        <br />
        <span className="orange">Receiving end</span> circle radius
        <span>
          {formattedNumber(transmissionOutput.receivingEndCircleRadius)}
        </span>
      </p>
      <div id="resultGraph" />
    </section>
  )
}

export default Result
