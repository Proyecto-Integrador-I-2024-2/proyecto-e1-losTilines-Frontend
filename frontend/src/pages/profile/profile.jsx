import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    List,
    ListItem,
    ListItemSuffix,
    IconButton,
    Avatar,
    Rating,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
    Switch,
    Tooltip,
    Button,
    Spinner,
} from "@material-tailwind/react";

import {
    HomeIcon,
    ChatBubbleLeftEllipsisIcon,
    Cog6ToothIcon,
    PencilIcon,
} from "@heroicons/react/24/solid";

import { VscAccount } from "react-icons/vsc";
import { useState, useEffect } from "react";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { projectsData, freelancersData } from "@/data";
import { CustomList } from "@/widgets/horList";
import { CustomListItem } from "@/widgets/horList";
import { ExperienceSection } from "@/widgets/custom";
import { SkillsSection } from "@/widgets/custom";
import { GitButton } from "@/widgets/custom";
import { useAddFreelancerSkill, useCompany, useDeleteFreelancerExperience, useDeleteFreelancerSkill, useEditFreelancerExperience, useEditFreelancerSkill, useEditWorkerProfile, useFreelancer, useUser } from "@/hooks";
import { EditButton } from "@/widgets/buttons";
import { EditExperiencePopup, EditProfilePopUp, EditSkillsPopup } from "@/widgets/popUp";
import { defaultExperiences, defaultSkills } from "@/data";


export function Profile() {
    const imgFreeSrc = "/img/bruce-mars.jpeg"
    const imgSrc = "/img/company/icesi.png";
    const { data: userData, isLoading: isUserLoading, refetch: userRefetch } = useUser();
    const { data: freelancerData, isLoading: isFreelancerLoading, refetch: freelancerRefetch } = useFreelancer();
    const { data: companyData, isLoading: isCompanyLoading, refetch: companyRefetch } = useCompany();

    console.log("User", userData)
    console.log("Freelancer", freelancerData)
    console.log("Company", companyData)

    // User Information

    const userExample = {
        id: null,
        email: "email not provided",
        first_name: "first name not provided",
        last_name: "last name not provided",
        phone_number: "phone not provided",
    }

    const { id, email, first_name, last_name, phone_number } = userData || userExample;
    const role = sessionStorage.getItem("role");
    // Freelancer Information

    const freelancerExample = {
        description: "Not provided",
        country: "Not provided",
        city: "Not provided",
        portfolio: [],
        skills: [],
        experience_set: [],
        projects: []
    }

    const {
        description,
        country,
        city,
        portfolio,
        skills,
        experience_set,
        projects
    } = freelancerData || freelancerExample;

    // ----------------------- Company Information -----------------------

    const companyExample = {
        id: null,
        name: "Company not provided",
        tax_id: "Tax ID not provided",
        email: "Email not provided",
        description: "Description not provided",
        industry: "Industry not provided",
        freelancers: [],
        projects: [],
        skills: []
    }



    // ----------------------- State information -----------------------

    const [isFreelancer, setIsFreelancer] = useState(true);
    const [projectsToUse, setProjectsToUse] = useState([]);
    const [isEditable, setIsEditable] = useState(true);
    const [showProfilePopUp, setShowProfilePopUp] = useState(false);
    const [showExperiencePopUp, setShowExperiencePopUp] = useState(false);
    const [showSkillsPopUp, setShowSkillsPopUp] = useState(false);

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

    // ----------------------- Mutations -----------------------

    // Worker/Freelancer User Data
    const updateWorker = useEditWorkerProfile();
    function handleEditWorkerProfile(body) {
        updateWorker.mutate(body, {
            onSuccess: () => {
                userRefetch();
            },
        });
    }

    // Freelancer Experience Data
    const updateExperience = useEditFreelancerExperience();
    function handleEditExperience(id, body) {
        console.log("ID", id);
        console.log("Body", body);
        updateExperience.mutate({ id, body }, {
            onSuccess: () => {
                freelancerRefetch();
            },
        });
    }
    const deleteExperience = useDeleteFreelancerExperience();
    function handleDeleteExperience(id) {
        console.log("ID", id);
        deleteExperience.mutate({ id }, {
            onSuccess: () => {
                freelancerRefetch();
            },
        });
    }
    // Freelancer Skill Data
    const addSkill = useAddFreelancerSkill();
    function handleAddSkill(body) {
        console.log("BODY DE LA BENDITA SKILL A AÑADIR", body);
        addSkill.mutate({ body }, {
            onSuccess: () => {
                freelancerRefetch();
            },
        });
    }
    const updateSkill = useEditFreelancerSkill();
    function handleEditSkill(id, body) {
        console.log("ID", id);
        console.log("BODY DE LA BENDITA SKILL", body);
        updateSkill.mutate({ id, body }, {
            onSuccess: () => {
                freelancerRefetch();
            },
        });
    }
    const deleteSkill = useDeleteFreelancerSkill();
    function handleDeleteSkill(id) {
        console.log("ID", id);
        deleteSkill.mutate({ id }, {
            onSuccess: () => {
                freelancerRefetch();
            },
        });
    }



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
                                    src={isFreelancer ? imgFreeSrc : imgSrc}
                                    alt="bruce-mars"
                                    size="xl"
                                    variant={isFreelancer ? "rounded" : "circular"}
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
                                        mobile: phone_number || "Not provided",
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
                                            mobile: phone_number || "Not provided",
                                            email: email,
                                        }}
                                    editable={isEditable}
                                    onEdit={handleProfilePopup}
                                />}
                                {
                                    isFreelancer && (isFreelancerLoading ? <Spinner /> : portfolio && <GitButton url={portfolio} />)
                                }

                            </div>

                            <div className="h-96">
                                {isFreelancer ?
                                    (isFreelancerLoading ?
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
                                    (isFreelancerLoading ? <Spinner /> :
                                        <SkillsSection sectionName={"Skills"} skills={skills} editable={isEditable} onEdit={handleSkillsPopUp} />)
                                    // <SkillsSection sectionName={"Skills"} skills={skillsData} editable={isEditable} onEdit={handleSkillsPopUp} />)
                                    // <SkillsSection sectionName={"skills"} />)
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
            {isFreelancerLoading ? <Spinner /> :
                <>
                    <EditProfilePopUp open={showProfilePopUp} onOpen={setShowProfilePopUp} profile={userData || userExample} onChange={handleEditWorkerProfile} />
                    <EditExperiencePopup open={showExperiencePopUp} onOpen={setShowExperiencePopUp} experiences={experience_set} editExperience={handleEditExperience} addExperience={{}} deleteExperience={handleDeleteExperience} />
                    <EditSkillsPopup open={showSkillsPopUp} onOpen={setShowSkillsPopUp} skills={skills} editSkill={handleEditSkill} addSkill={handleAddSkill} deleteSkill={handleDeleteSkill} />
                </>
            }
        </div>
    );
}

export default Profile;

