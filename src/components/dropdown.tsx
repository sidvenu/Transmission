import React, { Fragment } from "react"
import "./dropdown.css"

interface DropdownProperties extends React.HTMLProps<HTMLSelectElement> {
  nameValuePairs: Array<{ name: string; value: string }>
}

export const Dropdown = (props: DropdownProperties) => (
  <div className="dropdown">
    <label htmlFor={props.id}>{props.label}</label>
    <select {...(props as React.HTMLProps<HTMLSelectElement>)}>
      {props.nameValuePairs.map(nameValuePair => (
        <option key={nameValuePair.value} value={nameValuePair.value}>
          {nameValuePair.name}
        </option>
      ))}
    </select>
  </div>
)
