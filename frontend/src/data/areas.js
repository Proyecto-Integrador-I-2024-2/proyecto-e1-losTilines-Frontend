// src/data/workerData.js

export const areasData = [
    {
      id: 1, // Clave única para el área
      area: "Logistic and Supply Chain",
      admin: "Elisa Maria Vargas",
      quantity: "15",
      budget: "$1.250.000",
      projects: [
        {
          id: 1, // Clave única para el proyecto
          projectName: "Containerization of Oracle Databases",
          status: "done",
          worker: "Kevin Steven Nieto Curaca",
        },
        {
          id: 2,
          projectName: "Architectural Design of the Coffee Machine",
          status: "in progress",
          worker: "Julian Alvares Cuchitini",
        },
      ],
    },
    {
      id: 2,
      area: "Marketing and Communications",
      admin: "Laura Fernanda Reyes",
      quantity: "20",
      budget: "$2.000.000",
      projects: [
        {
          id: 3,
          projectName: "Social Media Campaign for Q4",
          status: "in progress",
          worker: "Andrea Gomez Martinez",
        },
        {
          id: 4,
          projectName: "Rebranding Initiative",
          status: "done",
          worker: "Carlos Eduardo Lopez",
        },
        {
          id: 5,
          projectName: "Market Research Analysis",
          status: "in progress",
          worker: "Sofia Isabel Torres",
        },
      ],
    },
    {
      id: 3,
      area: "Research and Development",
      admin: "Miguel Alejandro Soto",
      quantity: "10",
      budget: "$3.500.000",
      projects: [
        {
          id: 6,
          projectName: "AI Integration in Product Line",
          status: "in progress",
          worker: "Diego Fernando Ramirez",
        },
        {
          id: 7,
          projectName: "Sustainable Materials Research",
          status: "done",
          worker: "Valentina Sofia Morales",
        },
        {
          id: 8,
          projectName: "Prototype Development for New Gadget",
          status: "in progress",
          worker: "Luis Miguel Hernandez",
        },
      ],
    },
    {
      id: 4,
      area: "Human Resources",
      admin: "Kevin Sreven Nieto Curaca ",
      quantity: "8",
      budget: "$800.000",
      projects: [
        {
          id: 9,
          projectName: "Employee Engagement Program",
          status: "done",
          worker: "Maria Fernanda Diaz",
        },
        {
          id: 10,
          projectName: "Recruitment Drive for Q3",
          status: "in progress",
          worker: "Jorge Luis Martinez",
        },
        {
          id: 11,
          projectName: "Training and Development Workshops",
          status: "in progress",
          worker: "Natalia Andrea Ruiz",
        },
      ],
    },
  ];
  
  export default areasData;
  