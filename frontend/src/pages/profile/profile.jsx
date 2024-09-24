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
    Switch,
    Tooltip,
    Button,
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
import { useUser } from "@/hooks";
import useSkills from "@/hooks/useSkills";
import useExperiences from "@/hooks/useExperiences";



function Profile() {
    const { data: userData, isLoading: isUserLoading } = useUser();
    const { data: skillsData, isLoading: isSkillsLoading } = useSkills(userData.id);
    const { data: experiencesData, isLoading: isExperiencesLoading } = useExperiences(userData.id);

    const [isFreelancer, setIsFreelancer] = useState(false);


    console.log(skillsData)

    useEffect(() => {
        if (userData && userData.role) {
            setIsFreelancer(userData.role === "Freelancer");
        }
    }, [userData]);

    console.log(userData)

    const imgSrc = "/img/company/icesi.png";
    const imgFreeSrc = "/img/bruce-mars.jpeg"

    const { id, email, first_name, last_name, phone_number, role } = userData;







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
                                        {isUserLoading ? "Loading..." : `${first_name} ${last_name}`}
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
                                    description="Happy to find a new job using Freelance Now!"
                                    details={{
                                        "first name": first_name,
                                        "last name": last_name,
                                        mobile: phone_number,
                                        email: email,
                                        location: "USA",
                                        social: (
                                            <div className="flex items-center gap-4">
                                                <i className="fa-brands fa-facebook text-blue-700" />
                                                <i className="fa-brands fa-twitter text-blue-400" />
                                                <i className="fa-brands fa-instagram text-purple-500" />
                                            </div>
                                        ),
                                    }}
                                    action={
                                        <Tooltip content="Edit Profile">
                                            <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                                        </Tooltip>
                                    }
                                />}
                                <GitButton />
                            </div>

                            <div className="h-96 mb-2">
                                {isFreelancer ?
                                    isExperiencesLoading ? "Loading.." : <ExperienceSection experiences={experiencesData} />
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
                                        <SkillsSection sectionName={"Skills"} skills={skillsData} />) :
                                    <SkillsSection sectionName={"Tech Stack"} />
                                }
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Card className="mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100">
                <CardBody>
                    {/* Aquí va la fila scrollable img, title, tag, description, members, route --->*/}
                    <CustomList sectionTitle={"Projects"} sectionSubtitle={"FreelancerProjects"} >
                        {projectsData.map(project => (
                            <CustomListItem key={project.title} {...project} />
                        ))}
                    </CustomList>
                </CardBody>
            </Card>
        </div>
    );
}

export default Profile;
