import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { useUser } from "@/hooks";
import { useCreateProject } from "@/hooks/projects";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function AddProject({ open, setOpen, handleCreateProject }) {
  const { data: user } = useUser();

  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setDate] = useState("");

  const handleProjectCreation = async () => {
    if (projectName && budget && description && start_date) {
      const projectData = {
        name: projectName,
        budget: budget,
        description: description,
        start_date: start_date,
        company: user?.company,
        user: user?.id,
      };

      console.log("projectData", projectData);

      try {
        handleCreateProject(projectData);
      } catch (error) {
        console.error("Error creating project: ", error);
      }
      setProjectName("");
      setBudget("");
      setDescription("");
      setDate("");
      setOpen(false);
    } else {
      alert("Please fill all fields before submitting.");
    }
  };

  return (
    <Dialog open={open} handler={() => setOpen(false)} size="md">
      <DialogHeader>Create a project</DialogHeader>
      <DialogBody divider>
        <div className="grid gap-6">
          <Input
            id="nameProject"
            label="Name project"
            name="nameproject"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            size="lg"
            required
          />
          <Input
            id="budget"
            label="Budget"
            name="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            size="lg"
            required
          />
          <Textarea
            id="description"
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="lg"
            required
          />
          <Input
            id="startDate"
            label="Start date"
            name="start_date"
            type="date"
            value={start_date}
            onChange={(e) => setDate(e.target.value)}
            size="lg"
          />
        </div>
      </DialogBody>
      <DialogFooter className="justify-end">
        <Button id="cancel" variant="text" color="red" onClick={() => setOpen(false)} className="mr-2">
          Cancel
        </Button>
        <Button id="saveChanges" variant="gradient" color="cyan" onClick={handleProjectCreation}>
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default AddProject;
