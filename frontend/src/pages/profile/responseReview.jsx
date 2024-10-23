import {
    Card,
    CardBody,
    Avatar,
    Rating,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    Spinner,
} from "@material-tailwind/react";

import {
    HomeIcon,
    ChatBubbleLeftEllipsisIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/solid";

import { VscAccount } from "react-icons/vsc";
import { useState, useEffect } from "react";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { CustomList, CustomListItem } from "@/widgets/horList";
import { SkillsSection, GitButton, ExperienceSection, ReviewSection } from "@/widgets/custom";
import { EditExperiencePopup, EditProfilePopUp, EditSkillsPopup } from "@/widgets/popUp";
import { useCompany, useQueryParams, useUser } from "@/hooks";
import { userExample, freelancerExample, profile_pic } from "@/data/placeholder";
import { addFreelancerSkill, deleteFreelancerExperience, deleteFreelancerSkill, editFreelancerExperience, editFreelancerSkill, editWorkerProfile, getCompany, getFreelancer } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { reviews } from "@/data";

export function Profile() {
    const queryClient = useQueryClient();
    const { data: userData, isLoading: isUserLoading, refetch: userRefetch } = useUser();
    const { data: companyData, isLoading: isCompanyLoading, refetch: companyRefetch } = useCompany();
    const [isFreelancer, setIsFreelancer] = useState(true);
    const [projectsToUse, setProjectsToUse] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
    const [showProfilePopUp, setShowProfilePopUp] = useState(false);
    const [showExperiencePopUp, setShowExperiencePopUp] = useState(false);
    const [showSkillsPopUp, setShowSkillsPopUp] = useState(false);

    const role = sessionStorage.getItem("role");

    // ----------------------- User information -----------------------

    const externalFreelancerId = useQueryParams().getParams().get("freelancer");
    const externalCompanyId = useQueryParams().getParams().get("company");

    // Estados locales para almacenar los datos de freelancer y compañía externos
    const [externalFreelancerData, setExternalFreelancerData] = useState(null);
    const [externalCompanyData, setExternalCompanyData] = useState(null);
    const [isLoadingExternalFreelancer, setIsLoadingExternalFreelancer] = useState(true);
    const [isLoadingExternalCompany, setIsLoadingExternalCompany] = useState(true);

    useEffect(() => {
        async function fetchExternalFreelancer() {
            if (externalFreelancerId) {
                setIsLoadingExternalFreelancer(true);
                try {
                    const data = await getFreelancer({ id: externalFreelancerId });
                    setExternalFreelancerData(data);
                } catch (error) {
                    console.error("Error fetching freelancer data:", error);
                } finally {
                    setIsLoadingExternalFreelancer(false);
                }
            }
        }

        async function fetchExternalCompany() {
            if (externalCompanyId) {
                setIsLoadingExternalCompany(true);
                try {
                    const data = await getCompany({ id: externalCompanyId });
                    setExternalCompanyData(data);
                } catch (error) {
                    console.error("Error fetching company data:", error);
                } finally {
                    setIsLoadingExternalCompany(false);
                }
            }
        }

        // Llamadas a las APIs
        fetchExternalFreelancer();
        fetchExternalCompany();
    }, [externalFreelancerId, externalCompanyId]);


    const userToUse = (externalFreelancerData?.user || userData?.user || userData || userExample);
    const { first_name, last_name, email, phone_number, profile_picture } = userToUse;
    const { description, country, city, portfolio, skills, experience_set, projects } = externalFreelancerData || userData || freelancerExample;

    console.log("User", userData)
    console.log("Company", companyData)
    console.log("portfolio", portfolio)
    console.log("externalFreelancerData", externalFreelancerData)
    console.log("externalCompanyData", externalCompanyData)

    useEffect(() => {
        if (userData && !externalFreelancerId) {
            setIsFreelancer(sessionStorage.getItem("role") === "Freelancer");
        }

        if (externalFreelancerData) {
            setIsFreelancer(true);
        } else if (externalCompanyData) {
            setIsFreelancer(false);
        }

    }, [userData, externalFreelancerId, externalFreelancerData, externalCompanyData]);


    return (
        <div className="w-full h-full">
            <div className="mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100 h-2/3">
                <Card className="h-full">
                    <CardBody className="h-full p-4">
                        {/* Seccion de identifiacion y tabs de herramientas */}
                        {!externalCompanyData ? <div className="mb-10 flex items-center justify-between flex-wrap gap-6 h-auto">
                            <div className="flex items-center gap-6">
                                <Avatar
                                    src={((isFreelancer && !isUserLoading) || externalFreelancerData) ? (profile_picture || profile_pic) : (profile_picture || profile_pic)}
                                    alt="bruce-mars"
                                    size="xl"
                                    variant="circular"
                                    className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                                />
                                <div>
                                    <Typography variant="h5" color="blue-gray" className="mb-1">
                                        {isUserLoading ? <Spinner /> : `${first_name} ${last_name}`}
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        className="font-normal text-blue-gray-600"
                                    >
                                        {!isUserLoading && role}
                                    </Typography>
                                    <Rating value={0} />
                                </div>
                            </div>
                            {/* Quien soy yo */}

                            <div className="w-96">
                                <Tabs value="app">
                                    <TabsHeader>
                                        <Tab value="app">
                                            <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                                            App
                                        </Tab>
                                        <Tab value="message">
                                            <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                                            Message
                                        </Tab>
                                        <Tab value="settings">
                                            <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                                            Settings
                                        </Tab>
                                    </TabsHeader>
                                </Tabs>
                            </div>
                            {/* tabs de config */}
                        </div > :
                            <div className="mb-10 flex items-center justify-between flex-wrap gap-6 h-auto">
                                {/* Avatar e información básica de la empresa */}
                                <div className="flex items-center gap-6">
                                    <Avatar
                                        src={externalCompanyData?.image || profile_pic} // Puedes agregar la imagen o logo de la empresa aquí
                                        alt={externalCompanyData?.name || "Company Logo"}
                                        size="xl"
                                        variant="circular"
                                        className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                                    />
                                    <div>
                                        {/* Nombre de la empresa */}
                                        <Typography variant="h5" color="blue-gray" className="mb-1">
                                            {externalCompanyData?.name || "Company Name"}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className="font-normal text-blue-gray-600"
                                        >
                                            {externalCompanyData.industry} Company
                                        </Typography>
                                        <Rating value={5} />
                                    </div>
                                </div>

                                {/* Tabs de navegación o acciones */}
                                <div className="w-96">
                                    <Tabs value="overview">
                                        <TabsHeader>
                                            <Tab value="overview">
                                                <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                                                Overview
                                            </Tab>
                                            <Tab value="contact">
                                                <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                                                Contact
                                            </Tab>
                                            <Tab value="settings">
                                                <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                                                Settings
                                            </Tab>
                                        </TabsHeader>
                                    </Tabs>
                                </div>
                            </div>
                        }
                        {/* Aquí va la fila de cards tipo columna --->*/}
                        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3 h-2/3">





                        </div>
                    </CardBody>
                </Card>
            </div>


        </div >
    );
}

export default Profile;