import { Paragraph } from 'lbh-frontend-react';
import React, { useState, useEffect } from 'react';

interface DropdownProps {
  /**
   * An object with props of an array of Housing Officers, a selected value to indicate which option is selected and a callback function passed into the Dropdown component
   */
  options: string[];
  selected: string;
  onSelectedChange: (housingOfficer: string) => void;
}

const Dropdown = ({ options, selected, onSelectedChange }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [currentlySelected, setCurrentlySelected] = useState(selected);

  useEffect(() => {
    document.body.addEventListener('click', (event) => {
      setOpen(false);
    });
  }, []);

  const updateSelectedHousingOfficer = (housingOfficer: string) => {
    setCurrentlySelected(housingOfficer);
    onSelectedChange(housingOfficer);
  };

  const style = {
    background: 'white',
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
        onChange={(e) => updateSelectedHousingOfficer(e.target.value)}
        id="housingOfficerDropdown"
        name="housingOfficerDropdown"
        style={style}
        className="dropdown"
      >
        {options.map((housingOfficer) => {
          return (
            <option value={housingOfficer} key={housingOfficer}>
              {housingOfficer}
            </option>
          );
        })}
      </select>
    </div>
  );

  return (
    <div className="govuk-form-group lbh-form-group">
      <div className="label">
        <Paragraph>Select</Paragraph>
      </div>
      <div onClick={() => setOpen(!open)}>{renderedOfficers}</div>
    </div>
  );
};
export default Dropdown;
