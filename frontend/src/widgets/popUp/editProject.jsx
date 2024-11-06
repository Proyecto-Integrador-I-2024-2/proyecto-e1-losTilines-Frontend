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

    setProjectName("")
    setBudget("")
    setDescription("")
    setDate("")
    setOpen(prev => !prev)

  }



  return (
    <Dialog open={open} handler={() => setOpen(false)} size="md">
      <DialogHeader>Edit project info</DialogHeader>
      <DialogBody divider>
        <div className="grid gap-6">
          <Input
            label="Name project"
            name="nameproject"
            value={project.name}
            onChange={(e) => setProjectName(e.target.value)}
            size="lg"
            required
          />
          <Input
            label="Budget"
            name="budget"
            value={project.budget}
            onChange={(e) => setBudget(e.target.value)}
            size="lg"
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={project.description}
            onChange={(e) => setDescription(e.target.value)}
            size="lg"
            required
          />
          <Input
            label="Start date"
            name="start_date"
            type="date"
            value={project.start_date}
            onChange={(e) => setDate(e.target.value)}
            size="lg"
          />
        </div>
      </DialogBody>
      <DialogFooter className="justify-end">
        <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-2">
          Cancel
        </Button>
        <Button variant="gradient" color="cyan" onClick={handleProjectCreation}>
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default EditProjectPopUp;
