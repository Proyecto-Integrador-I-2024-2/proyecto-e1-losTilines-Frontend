import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";

export function EditProjectPopUp({ open, setOpen, project, handleProjectSave }) {

  const [projectName, setProjectName] = useState(project.name);
  const [budget, setBudget] = useState(project.budget);
  const [description, setDescription] = useState(project.description);
  const [start_date, setDate] = useState(project.start_date);


  console.log("Project in pop up: ", project);

  const handleProjectCreation = async () => {
    const projectData = {
      name: projectName,
      budget: budget,
      description: description,
      start_date: start_date,
    }

    handleProjectSave(projectData);
    setOpen(prev => !prev)
  }



  return (
    <Dialog open={open} handler={() => setOpen(false)} size="md">
      <DialogHeader>Edit project info</DialogHeader>
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
        <Button id="cancelButton" variant="text" color="red" onClick={() => setOpen(false)} className="mr-2">
          Cancel
        </Button>
        <Button id="saveChangesButton" variant="gradient" color="cyan" onClick={handleProjectCreation}>
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default EditProjectPopUp;
