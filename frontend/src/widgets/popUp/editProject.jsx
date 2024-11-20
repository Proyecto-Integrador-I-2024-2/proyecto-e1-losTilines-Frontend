import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { useState } from "react";

export function EditProjectPopUp({ open, setOpen, project, handleProjectSave, onDelete }) {

  const [projectName, setProjectName] = useState(project.name);
  const [budget, setBudget] = useState(project.budget);
  const [description, setDescription] = useState(project.description);
  const [start_date, setDate] = useState(project.start_date);
  const [status, setStatus] = useState(project.status);

  const STATUS_CHOICES = {
    pending: 'Pending',
    open_to_apply: 'Open to apply',
    in_progress: 'In Progress',
    in_progress_and_open_to_apply: 'In Progress and open to apply',
    finished: 'Finished',
    rejected: 'Rejected',
    canceled: 'Canceled'
  };


  console.log("Project in pop up: ", project);

  const handleProjectCreation = async () => {
    const projectData = {
      name: projectName,
      budget: budget,
      description: description,
      start_date: start_date,
      status: status
    }

    handleProjectSave(projectData);
    setOpen(prev => !prev)
  }

  const handleProjectDelete = async () => {
    onDelete();
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
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            size="lg"
            required
          />
          <Input
            label="Budget"
            name="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            size="lg"
            required
          />

          <Select
            label="Status"
            name="status"
            value={status}
            onChange={(value) => setStatus(value)}
            size="lg"
            required
          >
            {Object.keys(STATUS_CHOICES).map((key) => (
              <Option key={key} value={key}>
                {STATUS_CHOICES[key]}
              </Option>
            ))}
          </Select>

          <Textarea
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="lg"
            required
          />
          <Input
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
        <Button variant="gradient" color="red" onClick={handleProjectDelete} className="mr-2">
          Delete project
        </Button>
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
