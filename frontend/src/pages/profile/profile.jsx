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

import { ProfileInfoCard } from "@/widgets/cards";
import { projectsData } from "@/data";
import { CustomList } from "@/widgets/horList";
import { CustomListItem } from "@/widgets/horList";
import { ExperienceSection } from "@/widgets/custom";
import { SkillsSection } from "@/widgets/custom";
import { GitButton } from "@/widgets/custom";

export function Profile() {
    return (
        <div className="w-full h-full">
            <div className="mx-3 mt-4 mb-2 lg:mx-4 border border-blue-gray-100 h-2/3">
                <Card className="h-full">
                    <CardBody className="h-full p-4">
                        {/* Seccion de identifiacion y tabs de herramientas */}
                        <div className="mb-10 flex items-center justify-between flex-wrap gap-6 h-auto">
                            <div className="flex items-center gap-6">
                                <Avatar
                                    src="/img/bruce-mars.jpeg"
                                    alt="bruce-mars"
                                    size="xl"
                                    variant="rounded"
                                    className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                                />
                                <div>
                                    <Typography variant="h5" color="blue-gray" className="mb-1">
                                        Richard Davis
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        className="font-normal text-blue-gray-600"
                                    >
                                        CEO / Co-Founder
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
                                />
                                <GitButton />
                            </div>
                            <div className="h-96 mb-2">
                                <ExperienceSection />
                            </div>
                            <div>
                                <SkillsSection />
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
