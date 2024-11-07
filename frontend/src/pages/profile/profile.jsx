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
    Button,
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
import { SkillsSection, GitButton, ExperienceSection } from "@/widgets/custom";
import { CompanyInterestPopUp, EditExperiencePopup, EditProfilePopUp, EditSkillsPopup } from "@/widgets/popUp";
import { useCompany, useQueryParams, useUser } from "@/hooks";
import { userExample, freelancerExample, profile_pic } from "@/data/placeholder";
import { addFreelancerSkill, deleteFreelancerExperience, deleteFreelancerSkill, editFreelancerExperience, editFreelancerSkill, editWorkerProfile, getCompany, getFreelancer, postCompanyInterest } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import ReviewSection from "@/widgets/custom/reviews";
import { reviews } from "@/data/reviews-data";

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
    const [companyInterestPopUp, setCompanyInterestPopUp] = useState(false);

    const role = sessionStorage.getItem("role");

    // ----------------------- User information -----------------------

    const externalFreelancerId = useQueryParams().getParams().get("freelancer");
    const externalCompanyId = useQueryParams().getParams().get("company");

    // Estados locales para almacenar los datos de freelancer y compañía externos
    const [externalFreelancerData, setExternalFreelancerData] = useState(null);
    const [externalCompanyData, setExternalCompanyData] = useState(null);
    const [isLoadingExternalFreelancer, setIsLoadingExternalFreelancer] = useState(true);
    const [isLoadingExternalCompany, setIsLoadingExternalCompany] = useState(true);

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

    useEffect(() => {
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

    useEffect(() => {
        if (isFreelancer) {
            setProjectsToUse(projects);

        } else {
            setProjectsToUse(externalCompanyData?.projects || companyData?.at(0)?.projects || []);
        }
    }, [isFreelancer, projects, companyData]);

    useEffect(() => {
        if (userData && !externalFreelancerId && !externalCompanyId) {
            setIsEditable((userData?.user?.id == sessionStorage.getItem("id")) || (userData?.id == sessionStorage.getItem("id")));
        }
        if (externalFreelancerId) {
            setIsEditable(false);
        }
    }, [userData, externalFreelancerId, externalCompanyId])

    useEffect(() => {
        if (!externalCompanyId) {
            setExternalCompanyData(null);
        }
        if (!externalFreelancerId) {
            setExternalFreelancerData(null);
        }
    }, [externalFreelancerId, externalCompanyId])


    // ----------------------- API consumption -----------------------

    // Worker/Freelancer User Data
    function handleEditWorkerProfile(body) {
        editWorkerProfile({ body })
        queryClient.invalidateQueries(['User']);
        userRefetch()
    }

    // Freelancer Experience Data
    function handleEditExperience(id, body) {
        console.log("ID", id);
        console.log("Body", body);
        editFreelancerExperience({ id, body })
        queryClient.invalidateQueries(['User']);
        userRefetch()
    }

    function handleDeleteExperience(id) {
        console.log("ID", id);
        deleteFreelancerExperience({ id })
        queryClient.invalidateQueries(['User']);
        userRefetch()
    }

    // Freelancer Skill Data
    function handleAddSkill(body) {
        console.log("Body", body);
        addFreelancerSkill({ body })
        queryClient.invalidateQueries(['User']);
        userRefetch()
    }

    function handleEditSkill(id, body) {
        console.log("ID", id);
        editFreelancerSkill({ id, body })
        queryClient.invalidateQueries(['User']);
        userRefetch()
    }

    function handleDeleteSkill(id) {
        console.log("ID", id);
        deleteFreelancerSkill({ id })
        queryClient.invalidateQueries(['User']);
        userRefetch()
    }

    // ----------------------- Company interest -----------------------

    function handleInterest(projectId) {
        const body = {
            project: projectId,
            freelancer: externalFreelancerId,
            status: "company_interested"
        }
        postCompanyInterest(body);
        fetchExternalFreelancer();
    }

    // ----------------------- PopUp Handlers -----------------------

    function handleProfilePopup() {
        setShowProfilePopUp(pop => !pop);
    }
    function handleExperiencePopUp() {
        setShowExperiencePopUp(pop => !pop);
    }
    function handleSkillsPopUp() {
        setShowSkillsPopUp(pop => !pop);
    }
    function handleCompanyInterestPopUp() {
        setCompanyInterestPopUp(pop => !pop);
    }


    return (
        <div className="w-full h-full">
            <div className="mx-3 mt-4 mb-2 lg:mx-4 h-2/3">
                <Card className="h-full border border-blue-gray-100">
                    <CardBody className="h-full p-4">
                        {/* Seccion de identifiacion y tabs de herramientas */}
                        {!externalCompanyData ?
                            <div className="mb-10 flex items-center justify-between flex-wrap gap-6 h-auto">
                                <div className="flex items-center justify-between flex-row gap-6 h-auto w-full">
                                    <div className="flex items-center gap-6">
                                        <Avatar
                                            src={((isFreelancer && !isUserLoading) || externalFreelancerData) ? (profile_picture?.replace(/\s+/g, '') || profile_pic) : (profile_picture?.replace(/\s+/g, '') || profile_pic)}
                                            alt="bruce-mars"
                                            size="xl"
                                            onError={(e) => { e.target.onerror = null; e.target.src = profile_pic }}
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
                                                {!isUserLoading && !externalCompanyData && !externalFreelancerData && role}
                                            </Typography>
                                            <Rating value={0} aria-disabled />
                                        </div>
                                    </div>
                                    <Button onClick={handleCompanyInterestPopUp} color="light-blue">
                                        Invite
                                    </Button>

                                </div>

                                {/* Quien soy yo */}
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
                                        <Rating value={5} aria-disabled />
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
                            <div>
                                {(!isUserLoading && !externalCompanyData) ? <ProfileInfoCard
                                    title="Profile Information"
                                    description={isFreelancer ? description : companyData?.at(0)?.description || "Company Description not provided"}
                                    details={isFreelancer ? {
                                        "first name": first_name,
                                        "last name": last_name,
                                        mobile: phone_number,
                                        email: email,
                                        location: `${city}, ${country}`,
                                        social: (
                                            <div className="flex items-center gap-4">
                                                <i className="fa-brands fa-facebook text-blue-700" />
                                                <i className="fa-brands fa-twitter text-blue-400" />
                                                <i className="fa-brands fa-instagram text-purple-500" />
                                            </div>
                                        ),
                                    } :
                                        {
                                            "first name": first_name,
                                            "last name": last_name,
                                            mobile: phone_number,
                                            email: email,
                                        }}
                                    editable={isEditable}
                                    onEdit={handleProfilePopup}
                                /> :
                                    <ProfileInfoCard
                                        title="Company Information"
                                        description={externalCompanyData?.description || "No description provided"}
                                        details={
                                            {
                                                name: externalCompanyData?.name || "No name provided",
                                                industry: externalCompanyData?.industry || "No industry provided",
                                                email: externalCompanyData?.email || "No email provided",
                                            }
                                        }
                                        editable={false}
                                        onEdit={{}}
                                    />}
                                {
                                    isFreelancer && (isUserLoading ? <Spinner /> : (portfolio !== "Not provided" && <GitButton url={portfolio} />))
                                }

                            </div>

                            <div className="h-96">
                                {isFreelancer ?
                                    (isUserLoading ?
                                        <Spinner />
                                        :
                                        <ExperienceSection experiences={experience_set} editable={isEditable} onEdit={handleExperiencePopUp} />)
                                    :
                                    (isCompanyLoading ?
                                        <Spinner />
                                        :
                                        <div className="h-full">
                                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                                Freelancers that have worked here
                                            </Typography>
                                            {!externalCompanyData && companyData ? <div className="space-y-6 h-full overflow-y-auto no-scrollbar">
                                                {companyData?.at(0)?.freelancers.map((freelancer) => (
                                                    <MessageCard
                                                        key={freelancer.user.name}
                                                        img={freelancer.user.img || profile_pic}
                                                        name={freelancer.user.name}
                                                        message={freelancer.description}
                                                        action={
                                                            <VscAccount />
                                                        }
                                                    />
                                                ))}
                                            </div>
                                                :
                                                <div className="space-y-6 h-full overflow-y-auto no-scrollbar">
                                                    {externalCompanyData.freelancers.map((freelancer) => (
                                                        <MessageCard
                                                            key={freelancer.user.name}
                                                            img={freelancer.user.img || profile_pic}
                                                            name={freelancer.user.name}
                                                            message={freelancer.description}
                                                            action={
                                                                <VscAccount />
                                                            }
                                                        />
                                                    ))}
                                                </div>}
                                        </div>)
                                }
                            </div>

                            <div className="h-96">
                                {isFreelancer ?
                                    (isUserLoading ? <Spinner /> :
                                        <SkillsSection sectionName={"Skills"} skills={skills} editable={isEditable} onEdit={handleSkillsPopUp} />)
                                    :
                                    (isCompanyLoading ? <Spinner /> :
                                        !externalCompanyData && (companyData && <SkillsSection sectionName={"Tech Stack"} skills={companyData?.at(0)?.skills || []} editable={false} />))
                                }
                                {
                                    externalCompanyData && <SkillsSection sectionName={"Tech Stack"} skills={externalCompanyData?.skills || []} editable={false} />
                                }
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Card className="mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100">
                <CardBody>
                    {Array.isArray(projectsToUse) && projectsToUse.length > 0 ?
                        <CustomList
                            sectionTitle={"Projects"}
                            sectionSubtitle={"Associated Projects"}
                        >
                            {projectsToUse.map((project) => (
                                <CustomListItem key={project.id} title={project.name} tag={`$${project.budget}`} description={project.description} img={"https://images.unsplash.com/photo-1518770660439-4636190af475"} route={`/project/detail/${project.id}`} />
                            ))}
                        </CustomList>
                        :
                        <Typography variant="h6" color="blue-gray" className="text-center">
                            No projects added yet
                        </Typography>
                    }
                </CardBody>
            </Card>
            {isUserLoading ? <Spinner /> :
                <>
                    {(isEditable) &&
                        <>
                            <EditProfilePopUp open={showProfilePopUp} onOpen={setShowProfilePopUp} profile={userToUse} onChange={handleEditWorkerProfile} />
                            <EditExperiencePopup open={showExperiencePopUp} onOpen={setShowExperiencePopUp} experiences={experience_set || []} editExperience={handleEditExperience} addExperience={{}} deleteExperience={handleDeleteExperience} />
                            <EditSkillsPopup open={showSkillsPopUp} onOpen={setShowSkillsPopUp} skills={skills || []} editSkill={handleEditSkill} addSkill={handleAddSkill} deleteSkill={handleDeleteSkill} />
                        </>
                    }
                    <ReviewSection reviews={reviews} />
                    {userData?.company && <CompanyInterestPopUp open={companyInterestPopUp} onOpen={setCompanyInterestPopUp} companyId={userData.company} handleInterest={handleInterest} />}
                </>
            }
        </div >
    );
}

export default Profile;