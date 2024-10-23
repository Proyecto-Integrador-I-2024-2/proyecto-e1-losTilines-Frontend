export const userExample = {
    id: null,
    email: "email not provided",
    first_name: "first name not provided",
    last_name: "last name not provided",
    phone_number: "phone not provided",
}

export default userExample;


// Company Hook
// [
//     {
//         "id": 3,
//         "name": "Empresa 3",
//         "tax_id": "TAXID3",
//         "email": "empresa3@example.com",
//         "description": "Descripción de la empresa 3",
//         "industry": "Industria 3",
//         "freelancers": [
//             {
//                 "user": {
//                     "name": "Freelancer1 Apellido1",
//                     "img": null
//                 },
//                 "description": "Descripción para Freelancer1",
//                 "portfolio": null
//             }
//         ],
//         "projects": [
//             {
//                 "id": 3,
//                 "name": "Proyecto 3",
//                 "description": "Descripción del proyecto 3",
//                 "start_date": "2024-10-18",
//                 "budget": "13000.00",
//                 "status": {
//                     "id": 3,
//                     "name": "Estado 3"
//                 }
//             }
//         ],
//         "skills": [
//             {
//                 "skill_id": 3,
//                 "skill_name": "Habilidad 3",
//                 "project_count": 1,
//                 "average_level": 70
//             }
//         ]
//     }
// ]
//
// Worker User Object
//     {
//         "id": 7,
//         "email": "business_manager3@example.com",
//         "first_name": "BusinessManager3",
//         "last_name": "Apellido3",
//         "phone_number": "2222",
//         "created_at": "2024-10-18T05:58:14.027014Z",
//         "profile_picture": null,
//         "is_active": true,
//         "is_staff": false,
//         "role": "Business Manager",
//         "company": 3,
//         "area": 3,
//         "related_projects": [
//             {
//                 "id": 3,
//                 "name": "Proyecto 3",
//                 "status": 3,
//                 "project_manager": "ProjectManager3 Apellido3"
//             }
//         ]
//     }
// Freelancer User Object
// {
//     "user": {
//         "id": 2,
//         "email": "freelancer1@example.com",
//         "first_name": "Freelancer1",
//         "last_name": "Apellido1",
//         "phone_number": null,
//         "created_at": "2024-10-18T05:58:12.591530Z",
//         "profile_picture": null,
//         "is_active": true,
//         "is_staff": false
//     },
//     "description": "Descripción para Freelancer1",
//     "country": "País",
//     "city": "Ciudad",
//     "portfolio": null,
//     "skills": [
//         {
//             "id": 1,
//             "freelancer": 2,
//             "skill_name": "Habilidad 1",
//             "skill": 1,
//             "level": 50
//         },
//         {
//             "id": 2,
//             "freelancer": 2,
//             "skill_name": "Habilidad 2",
//             "skill": 2,
//             "level": 60
//         },
//         {
//             "id": 3,
//             "freelancer": 2,
//             "skill_name": "Habilidad 3",
//             "skill": 3,
//             "level": 70
//         }
//     ],
//     "experience_set": [
//         {
//             "id": 1,
//             "start_date": "2024-10-18",
//             "final_date": null,
//             "occupation": "Ocupación 1",
//             "company": "Compañía 1",
//             "description": "Descripción de la experiencia 1",
//             "freelancer": 2
//         },
//         {
//             "id": 2,
//             "start_date": "2024-10-18",
//             "final_date": null,
//             "occupation": "Ocupación 2",
//             "company": "Compañía 2",
//             "description": "Descripción de la experiencia 2",
//             "freelancer": 2
//         },
//         {
//             "id": 3,
//             "start_date": "2024-10-18",
//             "final_date": null,
//             "occupation": "Ocupación 3",
//             "company": "Compañía 3",
//             "description": "Descripción de la experiencia 3",
//             "freelancer": 2
//         }
//     ],
//     "projects": []
// }