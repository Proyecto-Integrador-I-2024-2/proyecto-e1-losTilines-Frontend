import React from "react";
import {
  Typography,
} from "@material-tailwind/react";
import { useFreelancers } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Identifiers } from "@/hooks/tanstackIdentifiers";
import apiClient from "@/services/apiClient";
import { ProjectCard, SmallFreelancerCard } from "@/widgets/cards";
import { CustomList } from "@/widgets/horList";
import { LandingPage } from "@/widgets/home";

export const Homepage = () => {
  const fetchProjects = async () => {
    const { data } = await apiClient.get("projects/");
    return data;
  };

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery(
    [Identifiers.projectsHome],
    fetchProjects,
    {
      staleTime: 1000 * 60 * 3,
      cachetime: 1000 * 60 * 30,
      retry: 2,
    }
  );

  const { data: freelancersData, isLoading: isFreelancersLoading } =
    useFreelancers();
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  function handleFreelancerCardClick(id) {
    navigate(`/profile?freelancer=${id}`);
  }
  function handleProjectCardClick(id) {
    navigate(`/project/detail/${id}`);
  }

  return (
    <LandingPage>
      {freelancersData &&
        freelancersData.length > 0 &&
        projectsData &&
        projectsData.length > 0 && (
          <>
            <div className="flex flex-col max-h-1/3 my-8 w-full">
              <Typography
                variant="h2"
                className="text-4xl font-semibold text-center text-secondary mb-12"
              >
                Amazing Freelancers to work with!
              </Typography>

              <div className="flex justify-center w-full">
                {freelancersData && (
                  <CustomList
                    sectionTitle={""}
                    sectionSubtitle={""}
                    isDistributedEvenly={true}
                  >
                    {freelancersData.map((freelancer) => (
                      <SmallFreelancerCard
                        key={freelancer.user.id}
                        freelancer={freelancer}
                        onCardClick={handleFreelancerCardClick}
                      />
                    ))}
                  </CustomList>
                )}
              </div>
            </div>

            <div className="flex flex-col max-h-1/3 my-8 w-full">
              <Typography
                variant="h2"
                className="text-4xl font-semibold text-center text-secondary mb-12"
              >
                Incredible projects for you to hop on!
              </Typography>

              <div className="flex justify-center w-full">
                {projectsData && (
                  <CustomList
                    sectionTitle={""}
                    sectionSubtitle={""}
                    isDistributedEvenly={true}
                  >
                    {projectsData.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onCardClick={handleProjectCardClick}
                      />
                    ))}
                  </CustomList>
                )}
              </div>
            </div>
          </>
        )}
    </LandingPage>
  );
};

export default Homepage;