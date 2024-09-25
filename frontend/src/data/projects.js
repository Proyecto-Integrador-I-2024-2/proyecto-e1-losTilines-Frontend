
export const projectsDataDashboard= [
    {
      id: 1, // Clave única para el proyecto
      project: "Create profile with authentication from Auth0",
      quantity: "15",
      budget: "$1.250.000",
      milestones: [
        {
          id: 1, // Clave única para el hito
          milestoneName: "Set up Auth0 account and configurations",
          status: "done",
          worker: "Kevin Steven Nieto Curaca",
        },
        {
          id: 2,
          milestoneName: "Integrate Auth0 with frontend application",
          status: "in progress",
          worker: "Julian Alvares Cuchitini",
        },
        {
          id: 3,
          milestoneName: "Implement user role management",
          status: "in progress",
          worker: "Sofia Isabel Torres",
        },
      ],
    },
    {
      id: 2, // Clave única para el proyecto
      project: "Develop E-commerce Platform",
      quantity: "25",
      budget: "$3.500.000",
      milestones: [
        {
          id: 4,
          milestoneName: "Design database schema for products and users",
          status: "done",
          worker: "Andrea Gomez Martinez",
        },
        {
          id: 5,
          milestoneName: "Implement shopping cart functionality",
          status: "in progress",
          worker: "Carlos Eduardo Lopez",
        },
        {
          id: 6,
          milestoneName: "Set up payment gateway integration",
          status: "in progress",
          worker: "Valentina Sofia Morales",
        },
        {
          id: 7,
          milestoneName: "Optimize website performance and SEO",
          status: "in progress",
          worker: "Luis Miguel Hernandez",
        },
      ],
    },
    {
      id: 3, // Clave única para el proyecto
      project: "Mobile App Development for Fitness Tracking",
      quantity: "18",
      budget: "$2.800.000",
      milestones: [
        {
          id: 8,
          milestoneName: "Create wireframes and UI/UX designs",
          status: "done",
          worker: "Maria Fernanda Diaz",
        },
        {
          id: 9,
          milestoneName: "Develop user authentication module",
          status: "in progress",
          worker: "Jorge Luis Martinez",
        },
        {
          id: 10,
          milestoneName: "Implement activity tracking features",
          status: "in progress",
          worker: "Natalia Andrea Ruiz",
        },
        {
          id: 11,
          milestoneName: "Conduct beta testing and feedback analysis",
          status: "in progress",
          worker: "Diego Fernando Ramirez",
        },
      ],
    },
    {
      id: 4, // Clave única para el proyecto
      project: "Data Analytics Dashboard Implementation",
      quantity: "12",
      budget: "$1.750.000",
      milestones: [
        {
          id: 12,
          milestoneName: "Gather requirements and define KPIs",
          status: "done",
          worker: "Carla Daniela Perez",
        },
        {
          id: 13,
          milestoneName: "Set up data pipelines and ETL processes",
          status: "in progress",
          worker: "Julian Alvares Cuchitini",
        },
        {
          id: 14,
          milestoneName: "Design and develop dashboard interfaces",
          status: "in progress",
          worker: "Sofia Isabel Torres",
        },
        {
          id: 15,
          milestoneName: "Integrate real-time data visualization tools",
          status: "in progress",
          worker: "Luis Miguel Hernandez",
        },
      ],
    },
  ];
  
  export default projectsDataDashboard;
  