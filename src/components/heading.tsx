import React from "react"
import "./heading.css"

interface HeadingProperties extends React.HTMLProps<HTMLHeadingElement> {
  headingType: string
}

export const Heading = (props: HeadingProperties) => {
  const htmlHeadingProperties = props as React.HTMLProps<HTMLHeadingElement>
  switch (props.headingType) {
    case "h1":
      return <h1 {...htmlHeadingProperties} />
    case "h2":
      return <h2 {...htmlHeadingProperties} />
    case "h3":
      return <h3 {...htmlHeadingProperties} />
    case "h4":
      return <h4 {...htmlHeadingProperties} />
  }
  return <div />
}
