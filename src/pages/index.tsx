import React, { Fragment } from "react"
import "../styles/global.css"
import Intro from "../sections/intro"
import ProjectForm from "../sections/project-form"
import Logic, { TransmissionInput, TransmissionOutput } from "../logic"
import Result from "../sections/result"

const IndexPage = () => {
  const [transmissionOutput, setTransmissionOutput] = React.useState(
    {} as TransmissionOutput
  )
  return (
    <Fragment>
      <Intro />
      <ProjectForm setTransmissionOutput={setTransmissionOutput} />
      <Result transmissionOutput={transmissionOutput} />
    </Fragment>
  )
}

export default IndexPage
