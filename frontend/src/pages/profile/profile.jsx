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
import { SkillsSection, GitButton, ExperienceSection } from "@/widgets/custom";
import { EditExperiencePopup, EditProfilePopUp, EditSkillsPopup } from "@/widgets/popUp";
import { useCompany, useUser } from "@/hooks";
import { userExample, freelancerExample, profile_pic } from "@/data/placeholder";
import { addFreelancerSkill, deleteFreelancerExperience, deleteFreelancerSkill, editFreelancerExperience, editFreelancerSkill, editWorkerProfile } from "@/services";
import { useQueryClient } from "@tanstack/react-query";


export function Profile() {
    const queryClient = useQueryClient();
    const { data: userData, isLoading: isUserLoading, refetch: userRefetch } = useUser();
    const { data: companyData, isLoading: isCompanyLoading, refetch: companyRefetch } = useCompany();

    const [isFreelancer, setIsFreelancer] = useState(true);
    const [projectsToUse, setProjectsToUse] = useState([]);
    const [isEditable, setIsEditable] = useState(true);
    const [showProfilePopUp, setShowProfilePopUp] = useState(false);
    const [showExperiencePopUp, setShowExperiencePopUp] = useState(false);
    const [showSkillsPopUp, setShowSkillsPopUp] = useState(false);

    const role = sessionStorage.getItem("role");

    const userToUse = (userData?.user || userData || userExample);
    const { first_name, last_name, email, phone_number } = userToUse;
    const { description, country, city, portfolio, skills, experience_set, projects } = userData || freelancerExample;

    console.log("User", userData)
    console.log("Company", companyData)
    console.log("portfolio", portfolio)


    // ----------------------- User information -----------------------

    useEffect(() => {
        if (userData) {
            setIsFreelancer(sessionStorage.getItem("role") === "Freelancer");
        }
    }, [userData]);

    useEffect(() => {
        if (isFreelancer) {
            setProjectsToUse(projects);
        } else {
            setProjectsToUse(companyData.at(0).projects);
        }
    }, [isFreelancer, projects, companyData]);


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


    return (
        <div className="w-full h-full">
            <div className="mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100 h-2/3">
                <Card className="h-full">
                    <CardBody className="h-full p-4">
                        {/* Seccion de identifiacion y tabs de herramientas */}
                        <div className="mb-10 flex items-center justify-between flex-wrap gap-6 h-auto">
                            <div className="flex items-center gap-6">
                                <Avatar
                                    src={(isFreelancer && !isUserLoading) ? (userData?.user?.profile_picture || profile_pic) : (userData?.profile_picture || profile_pic)}
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
                        </div >
                        {/* Aquí va la fila de cards tipo columna --->*/}
                        <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3 h-2/3">
                            <div>
                                {!isUserLoading && <ProfileInfoCard
                                    title="Profile Information"
                                    description={isFreelancer ? description : companyData.at(0).description}
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
                                            <div className="space-y-6 h-full overflow-y-auto no-scrollbar">
                                                {companyData.at(0).freelancers.map((freelancer) => (
                                                    <MessageCard
                                                        key={freelancer.user.name}
                                                        img={freelancer.user.img}
                                                        name={freelancer.user.name}
                                                        message={freelancer.description}
                                                        action={
                                                            <VscAccount />
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>)
                                }
                            </div>

                            <div className="h-96">
                                {isFreelancer ?
                                    (isUserLoading ? <Spinner /> :
                                        <SkillsSection sectionName={"Skills"} skills={skills} editable={isEditable} onEdit={handleSkillsPopUp} />)
                                    :
                                    (isCompanyLoading ? <Spinner /> :
                                        <SkillsSection sectionName={"Tech Stack"} skills={companyData.at(0).skills} editable={false} />)
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
                                <CustomListItem key={project.id} title={project.name} tag={`$${project.budget}`} description={project.description} img={"https://images.unsplash.com/photo-1518770660439-4636190af475"} route={"/project/detail"} />
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
                    <EditProfilePopUp open={showProfilePopUp} onOpen={setShowProfilePopUp} profile={userToUse} onChange={handleEditWorkerProfile} />
                    <EditExperiencePopup open={showExperiencePopUp} onOpen={setShowExperiencePopUp} experiences={experience_set} editExperience={handleEditExperience} addExperience={{}} deleteExperience={handleDeleteExperience} />
                    <EditSkillsPopup open={showSkillsPopUp} onOpen={setShowSkillsPopUp} skills={skills} editSkill={handleEditSkill} addSkill={handleAddSkill} deleteSkill={handleDeleteSkill} />
                </>
            }
        </div>
    );
}

export default Profile;

