import { Label } from 'lbh-frontend-react';
import React, { useState, useEffect } from 'react';

interface DropdownProps {
  /**
   * An object with props of consisting of a two dimensional array, an array of two item arrays, each representing the value and the display text, a selected value to indicate which option is currently selected and a callback function passed into the Dropdown component
   */
  options: string[][];
  selected: string;
  onChange: (option: string) => void;
}

const Dropdown = ({ options, selected, onChange }: DropdownProps) => {
  const [currentlySelected, setCurrentlySelected] = useState(selected);

  const updateWithNewSelection = (selectedValue: string) => {
    setCurrentlySelected(selectedValue);
    onChange(selectedValue);
  };

  const styleSelect = {
    fontSize: '19px',
    fontFamily: 'Open Sans',
    height: '50px',
    width: '150%',
    padding: '10px',
    paddingRight: '50px',
    border: '3px solid #0b0c0c',
  };

  const renderedOfficers = (
    <div className="govuk-select lbh-select test">
      <select
        defaultValue={currentlySelected}
        onChange={(e) => updateWithNewSelection(e.target.value)}
        id="selectOption"
        name="selectOption"
        style={styleSelect}
        className="dropdown"
      >
        {options.map((option) => {
          const [key, displayValue] = option;

          return (
            <option value={key} key={key}>
              {displayValue}
            </option>
          );
        })}
      </select>
    </div>
  );

  return (
    <div className="govuk-form-group lbh-form-group">
      <Label id="selectLabel" for="selectOption">
        Select
      </Label>
      <div>{renderedOfficers}</div>
    </div>
  );
};
export default Dropdown;
