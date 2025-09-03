import React from "react";

type AddEventButtonProps = {
  onClick: () => void
}

const button = `

`

const AddEventButton: React.FC<AddEventButtonProps> = ({onClick}) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        margin: "8px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#4CAF50",
        color: "white",
        cursor: "pointer",
      }}
    >
      + Add Event
    </button>
  );
};

export default AddEventButton;