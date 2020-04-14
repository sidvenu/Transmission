import React from "react"
import "./input.css"

export const Input = (props: React.HTMLProps<HTMLInputElement>) => (
  <div>
    <label htmlFor={props.id}>
      <pre>{props.label}</pre>
    </label>
    <input {...props} />
  </div>
)
