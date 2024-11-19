// StatusChoices.jsx
import React, { useState } from "react";
import { Option, Select } from "@material-tailwind/react";
import { statusChoices } from "@/services/colorBaseOnStatus";

export function StatusChoices({ initialStatus, onStatusChange }) {
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || "");

  const handleChange = (value) => {
    setSelectedStatus(value);
    if (onStatusChange) {
      onStatusChange(value);
    }
  };

  return (
    <Select
      label="Select Status"
      value={selectedStatus}
      onChange={handleChange}
    >
      {statusChoices.map((status) => (
        <Option key={status.value} value={status.value}>
          {status.label}
        </Option>
      ))}
    </Select>
  );
}

export default StatusChoices;
