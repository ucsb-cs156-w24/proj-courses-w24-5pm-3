import { useState } from "react";
import { Form } from "react-bootstrap";

const SingleLevelDropdown = ({
  levels,
  setLevel,
  controlId,
  onChange = null,
  label = "Course Level",
}) => {
  const localSearchLevel = localStorage.getItem(controlId);
  console.log(`SingleLevelDropdown ln12: localSearchLevelFetch, controlId = ${localSearchLevel}  ${controlId}`);
  const [levelState, setLevelState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchLevel || "U",
  );
  console.log(`SingleLevelDropdown ln17: levelState = ${levelState}`);

  const handleLevelOnChange = (event) => {
    const selectedLevel = event.target.value;
    console.log(`SingleLevelDropdown ln21: selectedLevel = ${selectedLevel}`);
    localStorage.setItem(controlId, selectedLevel);
    setLevelState(selectedLevel);
    console.log(`SingleLevelDropdown ln24: controlId, setLevelState, selectedLevel  = ${controlId}  ${setLevelState}  ${selectedLevel}`);
    setLevel(selectedLevel);
    console.log(`SingleLevelDropdown ln26: setLevel = ${setLevel}`);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={levelState}
        onChange={handleLevelOnChange}
      >
        {levels.map(function (object, i) {
          const key = `${controlId}-option-${i}`;
          return (
            <option key={key} data-testid={key} value={object[0]}>
              {object[1]}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleLevelDropdown;
