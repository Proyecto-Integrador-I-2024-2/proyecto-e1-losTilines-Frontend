import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { SkillsSection } from "@/widgets/custom"; 
import { ProjectView } from "@/widgets/cards";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryParams } from "@/hooks/useQueryParams";

export function ProjectDetail() {
  const navigate = useNavigate();
  const { getParams } = useQueryParams();
  const { id } = useParams();

  useEffect(() => {
    const projectIdFromQuery = getParams().get('project');
    if (projectIdFromQuery && projectIdFromQuery !== id) {
      console.log(`Redirigiendo a la ID del proyecto desde query params: ${projectIdFromQuery}`);
      navigate(`/project/detail/${projectIdFromQuery}`);
    }
  }, [getParams, navigate, id]);

  return (
    <div className="flex flex-col w-full h-screen gap-2 overflow-hidden bg-origin-padding">
      <div className="flex w-full flex-1 p-5 pb-5">
        <div className="basis-[70%] pr-2 justify-center"> 
          <ProjectView projectId={12} />
        </div>
        <div className="basis-[30%] pl-2 overflow-y-auto">
          <Card className="border shrink-0 rounded-r-none shadow-sm max-h-full">
            <CardBody className="my-6 h-104 pt-0 pb-10">
              <Typography variant="h5" color="black"> Skills needed </Typography>
              <SkillsSection sectionName={""} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
