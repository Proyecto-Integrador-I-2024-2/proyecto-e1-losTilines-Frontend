// ProjectDetail.jsx

import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Button
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/solid";
import { SkillsSection } from "@/widgets/custom";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryParams } from "@/hooks";
import { useProject } from "@/hooks";
import { profile_pic } from "@/data/placeholder";
import { EditProjectPopUp, EditSkillsPopup, FreelancerInterestPopUp } from "@/widgets/popUp";
import { addSkillToProject, deleteProjectSkill, editProject, editProjectSkill, postFreelancerInterest } from "@/services";
import { useQueryClient } from "@tanstack/react-query";


export function ProjectDetail() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getParams } = useQueryParams();
  const { id } = useParams();
  const [showSkillsPopUp, setShowSkillsPopUp] = useState(false);
  const [showEditProjectPopUp, setShowEditProjectPopUp] = useState(false);
  const [freelancerInterestPopUp, setFreelancerInterestPopUp] = useState(false);

  console.log("ID del proyecto:", id); // Para depuración

  // Obtener la información del proyecto usando el hook
  const { data: project, isLoading, error, refetch: projectRefetch } = useProject(id);

  useEffect(() => {
    const projectIdFromQuery = getParams().get('project');
    if (projectIdFromQuery && projectIdFromQuery !== id) {
      console.log(`Redirigiendo a la ID del proyecto desde query params: ${projectIdFromQuery}`);
      navigate(`/project/detail/${projectIdFromQuery}`);
    }
  }, [getParams, navigate, id]);

  console.log("Proyecto:", project); // Para depuración

  // Manejo de estado de carga y error
  if (isLoading) {
    return <Typography variant="h6" color="gray">Cargando detalles del proyecto...</Typography>;
  }

  if (error) {
    console.error('Error fetching project:', error);
    return <Typography variant="h6" color="red">Error al cargar el proyecto: {error.message}</Typography>;
  }

  // Verifica si project existe antes de intentar acceder a sus propiedades
  if (!project) {
    return <Typography variant="h6" color="red">Proyecto no encontrado.</Typography>;
  }

  // Project Skill Data
  function handleAddSkill(body) {
    console.log("Body", body);
    const skillToAddData = {
      project: id,
      skill: body.skill,
      level: body.level
    }
    addSkillToProject({ body: skillToAddData })
    queryClient.invalidateQueries(['project', id]);
    projectRefetch()
  }

  function handleEditSkill(id, body) {
    const skillToEditData = {
      project: body.project,
      level: body.level,
      skill: body.skill.id
    }
    editProjectSkill({ id, body: skillToEditData })
    queryClient.invalidateQueries(['project', id]);
    projectRefetch()
  }

  function handleDeleteSkill(id) {
    console.log("ID", id);
    deleteProjectSkill({ id })
    queryClient.invalidateQueries(['project', id]);
    projectRefetch()
  }

  // Project basic Data
  function handleEditProject(body) {
    console.log("Body", body);
    editProject({ id, body })
    queryClient.invalidateQueries(['project', id]);
    projectRefetch()
  }

  // Freelancer Interest
  function handleFreelancerInterest() {

    const body = {
      project: id,
      freelancer: 0,
      status: "freelancer_interested"
    }

    postFreelancerInterest(body)
  }


  return (
    <>
      <div className="w-full h-full">
        <div className="mx-3 mt-4 mb-4 lg:mx-4">
          <Card className="inline-flex w-full border border-blue-gray-100 mb-2">
            <CardBody className="h-full p-4">
              <div className=" flex items-center justify-between flex-wrap gap-6 h-auto">
                <div className="flex items-center gap-6">
                  <Avatar
                    src={project.image || profile_pic}
                    alt="Project Image"
                    size="xl"
                    variant="rounded"
                    className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                  />
                  <div>
                    <Typography variant="h5" color="blue-gray" className="mb-1">
                      {project.user.first_name + " " + project.user.last_name}
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-600"
                    >
                      {project.user.email}
                    </Typography>
                  </div>
                </div>
                <Button color="light-blue" onClick={() => setFreelancerInterestPopUp(prev => !prev)}>Apply Now!</Button>

              </div >
            </CardBody>
          </Card>
          <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 flex items-center justify-between px-6 pt-6 pb-0"
              >
                <div>
                  <Typography variant="h4" color="blue-gray" className="mb-1">
                    {project.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    className="flex items-center gap-1 font-normal text-blue-gray-600"
                  >
                    <CurrencyDollarIcon strokeWidth={5} className="h-6 w-6 text-light-green-600" />
                    <strong>{project.budget}</strong>
                  </Typography>
                </div>
                <Menu placement="left-start">
                  <MenuHandler>
                    <IconButton size="sm" variant="text" color="blue-gray">
                      <EllipsisVerticalIcon
                        strokeWidth={3}
                        fill="currenColor"
                        className="h-6 w-6"
                      />
                    </IconButton>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => setShowEditProjectPopUp(prev => !prev)}>Edit project information</MenuItem>
                    <MenuItem onClick={() => setShowSkillsPopUp(prev => !prev)}>Edit project skills</MenuItem>
                  </MenuList>
                </Menu>
              </CardHeader>
              <CardBody className="flex flex-col items-start justify-between">
                <Typography variant="paragraph" color="black" className="text-lg">
                  {project.description}
                </Typography>

                <Typography variant="h3" color="light-blue" textGradient className="my-2"> {project.status_name} </Typography>
                <Typography variant="lead" color="black" className="text-lg">
                  Fecha de inicio: {project.start_date}
                </Typography>
              </CardBody>
            </Card>
            <Card className="border border-blue-gray-100 shadow-sm max-h-full">
              <CardBody className="my-6 h-104 pt-0 pb-10">
                <Typography variant="h5" color="black"> Skills needed </Typography>
                <SkillsSection sectionName={""} skills={project.skills || []} />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <EditSkillsPopup open={showSkillsPopUp} onOpen={setShowSkillsPopUp} skills={project.skills || []} editSkill={handleEditSkill} addSkill={handleAddSkill} deleteSkill={handleDeleteSkill} />
      <EditProjectPopUp open={showEditProjectPopUp} setOpen={setShowEditProjectPopUp} project={project} handleProjectSave={handleEditProject} />
      <FreelancerInterestPopUp open={freelancerInterestPopUp} onOpen={setFreelancerInterestPopUp} handleInterest={handleFreelancerInterest} project={project} />
    </>
  );
}

export default ProjectDetail;
