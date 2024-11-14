export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "done":
      return "green";
    case "in_progress":
      return "";
    case "pending":
      return "cyan";
    case "to_do":
      return "red";
    default:
      return "";
  }
};

export const statusChoices = [
  { value: "to_do", label: "To do" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];
