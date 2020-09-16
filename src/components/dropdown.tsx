import { Paragraph } from 'lbh-frontend-react';
import React, { useState, useEffect } from 'react';

interface DropdownProps {
  /**
   * An object with props of an array of Housing Officers, a selected value to indicate which option is selected and a callback function passed into the Dropdown component
   */
  housingOfficers: string[];
  selected: string;
  onSelectedChange: (housingOfficer: string) => void;
}

const Dropdown = ({
  housingOfficers,
  selected,
  onSelectedChange,
}: DropdownProps) => {
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
    width: '30%',
    height: '50px',
    fontSize: '20px',
    border: '3px solid black',
    padding: '10px',
    fontFamily: 'Open Sans',
  };

  const renderedOfficers = (
    <select
      defaultValue={currentlySelected}
      onChange={(e) => updateSelectedHousingOfficer(e.target.value)}
      id="housingOfficer"
      name="housingOfficer"
      className="govuk-select govuk-!-width-full lbh-select"
      style={style}
    >
      {housingOfficers.map((housingOfficer) => {
        return (
          <option value={housingOfficer} key={housingOfficer}>
            {housingOfficer}
          </option>
        );
      })}
    </select>
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
