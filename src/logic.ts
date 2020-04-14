import * as math from "mathjs"

export interface TransmissionInput {
  typeOfSystem: string
  spacingBetweenPhaseConductors1: number
  spacingBetweenPhaseConductors2: number
  spacingBetweenPhaseConductors3: number
  numSubconductorsPerBundle: number
  spacingBetweenSubconductors: number
  numStrandsPerSubconductor: number
  diameterOfEachStrand: number
  lengthOfTheLine: number
  modelOfTheLine: string
  resistanceOfTheLine: number
  powerFrequency: number
  nominalSystemVoltage: number
  receivingEndLoad: number
  powerFactorOfReceivingEndLoad: number
}

export interface TransmissionOutput {
  inductancePerPhasePerKm: number
  capacitancePerPhasePerKm: number
  inductiveReactanceOfTheLine: number
  capacitiveReactanceOfTheLine: number
  chargingCurrentDrawnFromSendingEndSubstation: math.Complex
  sendingEndVoltage: math.Complex
  sendingEndCurrent: math.Complex
  percentageVoltageRegulation: number
  powerLossInTheLine: number
  transmissionEfficiency: number
  A: math.Complex
  B: math.Complex
  C: math.Complex
  D: math.Complex
  sendingEndCircleRadius: number
  sendingEndCircleCentre: { x: number; y: number }
  receivingEndCircleRadius: number
  receivingEndCircleCentre: { x: number; y: number }
}

const Logic = (transmissionInput: TransmissionInput): TransmissionOutput => {
  const transmissionOutput = {} as TransmissionOutput
  const numberOfLayers =
    (1 +
      math.sqrt(
        1 - (4 * (1 - transmissionInput.numStrandsPerSubconductor)) / 3
      )) /
    2
  const diameterOfSubconductor =
    (2 * numberOfLayers - 1) * transmissionInput.diameterOfEachStrand

  const m = transmissionInput.numSubconductorsPerBundle
  const spacingCubed =
    transmissionInput.spacingBetweenPhaseConductors1 *
    transmissionInput.spacingBetweenPhaseConductors2 *
    transmissionInput.spacingBetweenPhaseConductors3

  const mgmd = math.pow(
    spacingCubed,
    transmissionInput.typeOfSystem === "symmetrical" ? 1 / (m * m) : 1 / 3
  ) as number
  const sgmd = math.pow(
    ((math.pow(math.e, -1 / 4) as number) * diameterOfSubconductor) / 2,
    1 / m
  ) as number
  const mgmdc = mgmd
  const sgmdc = math.pow(diameterOfSubconductor / 2, 1 / m) as number

  transmissionOutput.inductancePerPhasePerKm =
    2 * (math.pow(10, -4) as number) * math.log(mgmd / sgmd)

  transmissionOutput.inductiveReactanceOfTheLine =
    2 *
    math.pi *
    transmissionInput.powerFrequency *
    transmissionOutput.inductancePerPhasePerKm *
    transmissionInput.lengthOfTheLine

  transmissionOutput.capacitancePerPhasePerKm =
    2 *
    math.pi *
    8.854 *
    (math.divide(math.pow(10, -9), math.log(mgmdc / sgmdc)) as number)

  transmissionOutput.capacitiveReactanceOfTheLine =
    math.divide(
      1,
      2 *
        math.pi *
        transmissionInput.powerFrequency *
        transmissionOutput.capacitancePerPhasePerKm
    ) * transmissionInput.lengthOfTheLine

  const Vr = transmissionInput.nominalSystemVoltage / math.sqrt(3)
  const Ir =
    transmissionInput.receivingEndLoad /
    transmissionInput.powerFactorOfReceivingEndLoad /
    transmissionInput.nominalSystemVoltage /
    3
  const Z = math.complex(
    transmissionInput.resistanceOfTheLine * transmissionInput.lengthOfTheLine,
    transmissionOutput.inductiveReactanceOfTheLine
  )
  const Y = math.complex(
    0,
    math.divide(1, transmissionOutput.capacitiveReactanceOfTheLine)
  )
  const G = math.sqrt(math.multiply(Y, Z) as math.Complex)
  const Zc = math.sqrt(math.divide(Z, Y) as math.Complex)

  switch (transmissionInput.modelOfTheLine) {
    case "short": {
      transmissionOutput.chargingCurrentDrawnFromSendingEndSubstation = math.complex(
        0,
        0
      )
      transmissionOutput.A = math.complex(1, 0)
      transmissionOutput.B = Z
      transmissionOutput.C = math.complex(0, 0)
      transmissionOutput.D = math.complex(1, 0)
      break
    }
    case "nominal-pi": {
      transmissionOutput.chargingCurrentDrawnFromSendingEndSubstation = math.add(
        math.multiply(
          math.add(Y, math.multiply(Y, math.multiply(Y, math.divide(Z, 2)))),
          Vr
        ),
        math.multiply(math.multiply(Y, math.divide(Z, 2)), Ir)
      ) as math.Complex
      transmissionOutput.A = math.add(
        math.divide(math.multiply(Y, Z), 2),
        1
      ) as math.Complex
      transmissionOutput.B = Z
      transmissionOutput.C = math.multiply(
        Y,
        math.add(1, math.divide(math.multiply(Y, Z), 4))
      ) as math.Complex
      transmissionOutput.D = transmissionOutput.A
      break
    }
    case "long": {
      transmissionOutput.A = math.cosh(G)
      transmissionOutput.B = math.multiply(Zc, math.sinh(G)) as math.Complex
      transmissionOutput.C = math.multiply(
        math.divide(1, Zc),
        math.sinh(G)
      ) as math.Complex
      transmissionOutput.D = transmissionOutput.A
      transmissionOutput.chargingCurrentDrawnFromSendingEndSubstation = math.add(
        math.multiply(Vr, transmissionOutput.B),
        math.multiply(Ir, math.subtract(transmissionOutput.A, 1))
      ) as math.Complex
      break
    }
  }

  transmissionOutput.sendingEndVoltage = math.multiply(
    math.add(
      math.multiply(transmissionOutput.A, Vr),
      math.multiply(transmissionOutput.B, Ir)
    ),
    math.sqrt(3)
  ) as math.Complex

  transmissionOutput.sendingEndCurrent = math.add(
    transmissionOutput.chargingCurrentDrawnFromSendingEndSubstation,
    Ir
  ) as math.Complex

  const Vs = transmissionOutput.sendingEndVoltage
  const Vsabs = (math.abs(
    transmissionOutput.sendingEndVoltage
  ) as unknown) as number
  console.log(`Vsabs: ${Vsabs}`)
  console.log(`Vr: ${Vr}`)
  switch (transmissionInput.modelOfTheLine) {
    case "short": {
      transmissionOutput.percentageVoltageRegulation = ((Vsabs - Vr) / Vr) * 100
      break
    }
    case "nominal-pi": {
      transmissionOutput.percentageVoltageRegulation =
        (Vsabs /
          ((math.abs(
            math.subtract(Vs, math.multiply(Y, Ir)) as math.Complex
          ) as unknown) as number) -
          1) *
        100
      break
    }
    case "long": {
      transmissionOutput.percentageVoltageRegulation =
        (Vsabs /
          ((math.abs(
            math.subtract(
              Vs,
              math.multiply(Ir, transmissionOutput.B)
            ) as math.Complex
          ) as unknown) as number) -
          1) *
        100
      break
    }
  }

  transmissionOutput.powerLossInTheLine =
    3 *
    Ir *
    Ir *
    transmissionInput.resistanceOfTheLine *
    transmissionInput.lengthOfTheLine

  transmissionOutput.transmissionEfficiency =
    transmissionInput.receivingEndLoad /
    (transmissionInput.receivingEndLoad + transmissionOutput.powerLossInTheLine)

  transmissionOutput.chargingCurrentDrawnFromSendingEndSubstation = math.multiply(
    transmissionOutput.chargingCurrentDrawnFromSendingEndSubstation,
    1000
  ) as math.Complex
  transmissionOutput.sendingEndCurrent = math.multiply(
    transmissionOutput.sendingEndCurrent,
    1000
  ) as math.Complex

  const alpha = math.acos(
    (math.divide(
      transmissionOutput.A,
      (math.abs(transmissionOutput.A) as unknown) as number
    ) as math.Complex).re
  )
  const beta = math.acos(
    (math.divide(
      transmissionOutput.B,
      (math.abs(transmissionOutput.B) as unknown) as number
    ) as math.Complex).re
  )

  transmissionOutput.sendingEndCircleCentre = {
    x: math.multiply(
      math.divide(
        math.abs(transmissionOutput.A),
        math.abs(transmissionOutput.B)
      ),
      math.multiply(
        math.pow((math.abs(Vr) as unknown) as number, 2),
        math.cos(beta - alpha)
      )
    ) as number,
    y: math.multiply(
      math.divide(
        math.abs(transmissionOutput.A),
        math.abs(transmissionOutput.B)
      ),
      math.multiply(
        math.pow((math.abs(Vr) as unknown) as number, 2),
        math.sin(beta - alpha)
      )
    ) as number,
  }

  transmissionOutput.sendingEndCircleRadius = math.divide(
    math.multiply(math.abs(Vs), math.abs(Vr)),
    math.abs(transmissionOutput.B)
  ) as number

  transmissionOutput.receivingEndCircleCentre = {
    x: math.multiply(
      math.abs(
        math.divide(transmissionOutput.A, transmissionOutput.B) as math.Complex
      ),
      math.multiply(
        math.pow((math.abs(Vs) as unknown) as number, 2),
        math.cos(beta - alpha)
      )
    ) as number,
    y: math.multiply(
      math.abs(
        math.divide(transmissionOutput.A, transmissionOutput.B) as math.Complex
      ),
      math.multiply(
        math.pow((math.abs(Vs) as unknown) as number, 2),
        math.sin(beta - alpha)
      )
    ) as number,
  }

  transmissionOutput.receivingEndCircleRadius =
    transmissionOutput.sendingEndCircleRadius

  return transmissionOutput
}

export default Logic
