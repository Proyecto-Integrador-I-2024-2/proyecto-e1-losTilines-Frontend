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
import { useState } from "react";

import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { projectsData, freelancersData } from "@/data";
import { CustomList } from "@/widgets/horList";
import { CustomListItem } from "@/widgets/horList";
import { ExperienceSection } from "@/widgets/custom";
import { SkillsSection } from "@/widgets/custom";
import { GitButton } from "@/widgets/custom";

export function Profile() {

    const [isFreelancer, setIsFreelancer] = useState(false)

    return (
        <div className="w-full h-full">
            <div className="mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100 h-2/3">
                <Card className="h-full">
                    <CardBody className="h-full p-4">
                        {/* Seccion de identifiacion y tabs de herramientas */}
                        <div className="mb-10 flex items-center justify-between flex-wrap gap-6 h-auto">
                            <div className="flex items-center gap-6">
                                {isFreelancer ? <Avatar
                                    src="/img/bruce-mars.jpeg"
                                    alt="bruce-mars"
                                    size="xl"
                                    variant="rounded"
                                    className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                                /> :
                                    <Avatar
                                        src="/img/company/icesi.png"
                                        alt="icesi"
                                        size="xl"
                                        className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                                    />}
                                <div>
                                    {isFreelancer ? <>
                                        <Typography variant="h5" color="blue-gray" className="mb-1">
                                            Richard Davis
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className="font-normal text-blue-gray-600"
                                        >
                                            CEO / Co-Founder
                                        </Typography>
                                    </> :
                                        <>
                                            <Typography variant="h5" color="blue-gray" className="mb-1">
                                                Universidad Icesi
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="font-normal text-blue-gray-600"
                                            >
                                                Institución de Educación Superior
                                            </Typography>
                                        </>
                                    }

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
                                {isFreelancer ?
                                    <ProfileInfoCard
                                        title="Profile Information"
                                        description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                                        details={{
                                            "first name": "Alec M. Thompson",
                                            mobile: "(44) 123 1234 123",
                                            email: "alecthompson@mail.com",
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
                                    /> :
                                    <ProfileInfoCard
                                        title="Profile Information"
                                        description="La Universidad Icesi forma profesionales en 26 programas de pregrado, 31 maestrías, 14 especializaciones, 23 especializaciones médico-quirúrgicas y 2 doctorados, todos ellos aprobados por el Ministerio de Educación Nacional."
                                        details={{
                                            "name": "Universidad Icesi",
                                            mobile: "(44) 123 1234 123",
                                            email: "icesi@mail.edu.com.co",
                                            location: "CO",
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
                                    <ExperienceSection />
                                    :
                                    <div className="h-full">
                                        <Typography variant="h6" color="blue-gray" className="mb-4">
                                            Freelancers that have worked here
                                        </Typography>
                                        <div className="space-y-6 h-full overflow-y-auto">
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
                                    <SkillsSection sectionName={"Skills"} /> :
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
