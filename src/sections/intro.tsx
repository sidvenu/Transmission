import React from "react"
import "./intro.css"
import { Heading } from "../components/heading"
import { Button } from "../components/button"

const Intro = () => (
  <section id="intro" className="flex-container direction-column">
    <Heading headingType="h1">EEPC16 Tranmissions Project</Heading>
    <p>Created by Siddharth Venu, Siraj S, Mehul Nath Jindal</p>
    <Button className="icon-button" href="#project">
      Enter Project<span className="material-icons">arrow_drop_down</span>
    </Button>
  </section>
)

export default Intro
