import React, { useState, useEffect } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';

interface DropdownProps {
  /**
   * An object with props of an array of Housing Officers, a selected value to indicate which option is selected and a callback function passed into the Dropdown component
   */
  name: HousingOfficers[];
  selected: string;
  onSelectedChange(): string
}

interface HousingOfficers {
  officer: string;
}

interface onSelectedChange {
function: string;
}


const housingOfficerArr=["joe blogsd", "mart berry"]

const Dropdown = ({ housingOfficers, selected, onSelectedChange }) => {
  const [open, setOpen] = useState(false);
  const [currentlySelected, setCurrentlySelected] = useState(selected);

  
  useEffect(() => {
    document.body.addEventListener('click', (event) => {
      setOpen(false);
    });
  }, []);
  
  const renderedOptions = housingOfficers.map((housingOfficer) => {
    if (housingOfficer === currentlySelected) {
      return null;
    }
    return (
      <div
        key={housingOfficer}
        className="item"
        onClick={() => onSelectedChange(housingOfficer)}
      >
        {housingOfficer}
      </div>
    );
  });
  
  return (
    <div className="govuk-form-group">
      <div className="govuk-select">
        <div className="label">Select</div>
        <div
          onClick={() => setOpen(!open)}
          // className={`ui selection dropdown ${open ? 'visible active' : ''}`}
        >
          <AiFillCaretDown />
          <div className="text">{selected.label}</div>
          <div
            onClick={() => setOpen(!open)}
            // className={`menu ${open ? 'visible transition' : ''}`}
          >
            {renderedOptions}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dropdown;
