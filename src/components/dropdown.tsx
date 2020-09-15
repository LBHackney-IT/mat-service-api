import React, { useState, useEffect } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';

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

  const renderedOfficers = (
    <select
      defaultValue={currentlySelected}
      onChange={(e) => updateSelectedHousingOfficer(e.target.value)}
      id="housingOfficer"
      name="housingOfficer"
      className="govuk-select govuk-!-width-full lbh-select"
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
      <div className="label">Select</div>
      <div onClick={() => setOpen(!open)}>{renderedOfficers}</div>
    </div>
  );
};
export default Dropdown;
