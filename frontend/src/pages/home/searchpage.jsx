import React, { useState, useEffect } from "react";
import {
    Input,
    Select,
    Option,
    Card,
    CardBody,
    Typography,
    Button,
    Spinner,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useFreelancers, useProjects } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { Identifiers } from "@/hooks/tanstackIdentifiers";
import apiClient from "@/services/apiClient";
import { ProjectCard, SmallFreelancerCard } from "@/widgets/cards";
import { useNavigate } from "react-router-dom";

export const SearchPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("freelancers");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    // Fetch data using existing hooks and queries
    const { data: freelancersData, isLoading: isFreelancersLoading } =
        useFreelancers();
    const { data: projectsData, isLoading: isProjectsLoading } = useQuery(
        [Identifiers.projectsHome],
        async () => {
            const { data } = await apiClient.get("projects/?status=open_to_apply");
            return data;
        },
        {
            staleTime: 1000 * 60 * 3,
            cacheTime: 1000 * 60 * 30,
            retry: 2,
        }
    );

    // Extract unique skills from freelancers and projects
    const getAllSkills = () => {
        const skillSet = new Set();

        freelancersData?.forEach((freelancer) =>
            freelancer.skills?.forEach((skill) => skillSet.add(skill.skill_name))
        );

        projectsData?.forEach((project) =>
            project.skills?.forEach((skill) => skillSet.add(skill.skill.name))
        );

        return Array.from(skillSet);
    };

    console.log("selectedSkill: ", selectedSkill);
    console.log("all skills: ", getAllSkills());

    // Filter and sort functions
    const filterAndSortData = (data, type) => {
        if (!data) return [];

        let filteredData = [...data];

        // Filter by search term
        if (searchTerm) {
            filteredData = filteredData.filter((item) => {
                if (type === "freelancers") {
                    return (
                        item.user.first_name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        item.user.last_name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                } else {
                    return (
                        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
            });
        }

        // Filter by skill
        if (selectedSkill) {
            filteredData = filteredData.filter((item) =>
                item.skills?.some(
                    (skill) => (skill?.skill?.name || skill?.skill_name) === selectedSkill
                )
            );
        }

        // Sort
        filteredData.sort((a, b) => {
            let compareA, compareB;

            if (type === "freelancers") {
                switch (sortBy) {
                    case "name":
                        compareA = `${a.user.first_name} ${a.user.last_name}`;
                        compareB = `${b.user.first_name} ${b.user.last_name}`;
                        break;
                    case "skill":
                        compareA = a.skills?.[0]?.skill_name || "";
                        compareB = b.skills?.[0]?.skill_name || "";
                        break;
                    default:
                        compareA = a.user.first_name;
                        compareB = b.user.first_name;
                }
            } else {
                switch (sortBy) {
                    case "name":
                        compareA = a.name;
                        compareB = b.name;
                        break;
                    case "skill":
                        compareA = a.skills?.[0]?.skill_name || "";
                        compareB = b.skills?.[0]?.skill_name || "";
                        break;
                    default:
                        compareA = a.name;
                        compareB = b.name;
                }
            }

            return sortOrder === "asc"
                ? compareA.localeCompare(compareB)
                : compareB.localeCompare(compareA);
        });

        return filteredData;
    };

    const handleFreelancerCardClick = (id) => {
        navigate(`/profile?freelancer=${id}`);
    };

    const handleProjectCardClick = (id) => {
        navigate(`/project/detail/${id}`);
    };

    if (isFreelancersLoading || isProjectsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Typography
                        variant="h2"
                        className="text-4xl font-semibold text-center text-secondary mb-6"
                    >
                        Explore Opportunities
                    </Typography>
                    <Typography className="text-center text-gray-600 mb-8">
                        Find the perfect freelancer or project for your needs
                    </Typography>
                </div>

                <Tabs value={activeTab} className="mb-8">
                    <TabsHeader>
                        <Tab
                            value="freelancers"
                            onClick={() => setActiveTab("freelancers")}
                        >
                            Freelancers
                        </Tab>
                        <Tab value="projects" onClick={() => setActiveTab("projects")}>
                            Projects
                        </Tab>
                    </TabsHeader>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="col-span-1">
                        <Input
                            label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        />
                    </div>

                    <div className="col-span-1">
                        <Select
                            label="Filter by Skill"
                            value={selectedSkill}
                            onChange={setSelectedSkill}
                        >
                            <Option value="">All Skills</Option>
                            {getAllSkills().map((skill) => (
                                <Option key={skill} value={skill}>
                                    {skill}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div className="col-span-1">
                        <Select
                            label="Sort by"
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(value) => {
                                const [newSortBy, newSortOrder] = value.split("-");
                                setSortBy(newSortBy);
                                setSortOrder(newSortOrder);
                            }}
                        >
                            <Option value="name-asc">Name (A-Z)</Option>
                            <Option value="name-desc">Name (Z-A)</Option>
                            <Option value="skill-asc">Skill (A-Z)</Option>
                            <Option value="skill-desc">Skill (Z-A)</Option>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeTab === "freelancers"
                        ? filterAndSortData(freelancersData, "freelancers").map(
                            (freelancer) => (
                                <SmallFreelancerCard
                                    key={freelancer.user.id}
                                    freelancer={freelancer}
                                    onCardClick={handleFreelancerCardClick}
                                />
                            )
                        )
                        : filterAndSortData(projectsData, "projects").map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onCardClick={handleProjectCardClick}
                            />
                        ))}
                </div>

                {((activeTab === "freelancers" &&
                    filterAndSortData(freelancersData, "freelancers").length === 0) ||
                    (activeTab === "projects" &&
                        filterAndSortData(projectsData, "projects").length === 0)) && (
                        <div className="text-center py-12">
                            <Typography className="text-gray-500 text-xl">
                                No results found
                            </Typography>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default SearchPage;
