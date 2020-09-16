import { Paragraph } from 'lbh-frontend-react';
import React, { useState, useEffect } from 'react';
import Select from '@govuk-react/select';

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
    // width: '30%'//,
    // height: '50px',
    // fontSize: '20px',
    // border: '3px solid black',
    // padding: '10px',
    // fontFamily: 'Open Sans',

    fontWeight: '400px',
    fontSize: '16px',
    lineHeight: 1.25, // max-width: 100%;
    height: '80px',
    padding: '5px',
    border: '2px solid #0b0c0c',
  };

  const renderedOfficers = (
    <div className="govuk-select lbh-select test">
      <select
        defaultValue={currentlySelected}
        onChange={(e) => updateSelectedHousingOfficer(e.target.value)}
        id="housingOfficer"
        name="housingOfficer"
        style={style}
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
