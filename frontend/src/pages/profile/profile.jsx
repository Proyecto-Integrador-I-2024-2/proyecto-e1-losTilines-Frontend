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
import { useFreelancer, useUser } from "@/hooks";
import { EditButton } from "@/widgets/buttons";
import { EditExperiencePopup, EditProfilePopUp, EditSkillsPopup } from "@/widgets/popUp";
import { defaultExperiences, defaultSkills } from "@/data";


export function Profile() {
    const imgFreeSrc = "/img/bruce-mars.jpeg"
    const imgSrc = "/img/company/icesi.png";
    const { data: userData, isLoading: isUserLoading } = useUser();
    const { data: freelancerData, isLoading: isFreelancerLoading } = useFreelancer();
    // const { data: skillsData, isLoading: isSkillsLoading } = useSkills(userData.id);
    // const { data: experiencesData, isLoading: isExperiencesLoading } = useExperiences(userData.id);
    // const { data: portfolioData, isLoading: isPortfolioLoading } = usePortfolio(userData.id);

    // const userData = {}
    const skillsData = {}
    const experiencesData = {}
    const portfolioData = {}

    // const isUserLoading = false;
    const isSkillsLoading = false;
    const isExperiencesLoading = false;
    const isPortfolioLoading = false;


    console.log("Portofolio", portfolioData)
    console.log("User", userData)
    console.log("Freelancer", freelancerData)
    console.log("Skills data", skillsData)

    const userExample = {
        id: 1,
        email: "email.com",
        first_name: "first",
        last_name: "last",
        phone_number: null,
        role: "Freelancer",
        description: "Happy to find a new job using Freelance Now!",
    }

    const { id, email, first_name, last_name, phone_number, role } = userData || userExample;
    const {
        description,
        country,
        city,
        portfolio,
        skills,
        experience_set,
        projects
    } = freelancerData || { description: "", country: "", city: "", portfolio: [], skills: [], experience_set: [], projects: [] };



    // ----------------------- 

    const [isFreelancer, setIsFreelancer] = useState(false);
    const [isEditable, setIsEditable] = useState(true);
    const [showProfilePopUp, setShowProfilePopUp] = useState(false);
    const [showExperiencePopUp, setShowExperiencePopUp] = useState(false);
    const [showSkillsPopUp, setShowSkillsPopUp] = useState(false);

    useEffect(() => {
        if (userData) {
            setIsFreelancer(sessionStorage.getItem("role") === "Freelancer");
            // setIsFreelancer(true);
        }
    }, [userData]);

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
                                    <Rating value={4} />
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
                                    description={description}
                                    details={{
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
                                    }}
                                    editable={isEditable}
                                    onEdit={handleProfilePopup}
                                />}
                                {
                                    isPortfolioLoading ? "Loading..." : <GitButton url={portfolioData[0]?.Url} />
                                }

                            </div>

                            <div className="h-96">
                                {isFreelancer ?
                                    isExperiencesLoading ?
                                        "Loading.." :
                                        <>
                                            <ExperienceSection experiences={experiencesData} editable={isEditable} onEdit={handleExperiencePopUp} />
                                        </>
                                    :
                                    <div className="h-full">
                                        <Typography variant="h6" color="blue-gray" className="mb-4">
                                            Freelancers that have worked here
                                        </Typography>
                                        <div className="space-y-6 h-full overflow-y-auto no-scrollbar">
                                            {freelancersData.map((props) => (
                                                <MessageCard
                                                    key={props.name}
                                                    {...props}
                                                    action={
                                                        <VscAccount />
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="h-96">
                                {isFreelancer ?
                                    (isSkillsLoading ? "Loading..." :
                                        <SkillsSection sectionName={"Skills"} skills={skills} editable={isEditable} onEdit={handleSkillsPopUp} />)
                                    // <SkillsSection sectionName={"Skills"} skills={skillsData} editable={isEditable} onEdit={handleSkillsPopUp} />)
                                    // <SkillsSection sectionName={"skills"} />)
                                    :
                                    <SkillsSection sectionName={"Tech Stack"} editable={false} />
                                }
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Card className="mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100">
                <CardBody>
                    {/* Aquí va la fila scrollable img, title, tag, description, members, route --->*/}
                    <CustomList
                        sectionTitle={"Projects"}
                        sectionSubtitle={"Associated Projects"}
                    >
                        {projectsData.map((project) => (
                            <CustomListItem key={project.title} {...project} route={"/project/detail"} />
                        ))}
                    </CustomList>
                </CardBody>
            </Card>
            <EditProfilePopUp open={showProfilePopUp} onOpen={setShowProfilePopUp} profile={userExample} onChange={{}} />
            <EditExperiencePopup open={showExperiencePopUp} onOpen={setShowExperiencePopUp} experiences={defaultExperiences} setExperiences={{}} />
            <EditSkillsPopup open={showSkillsPopUp} onOpen={setShowSkillsPopUp} skills={defaultSkills} setSkills={{}} />
        </div>
    );
}

export default Profile;
