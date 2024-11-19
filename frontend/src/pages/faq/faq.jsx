import React, { useState } from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
    Button,
    Textarea,
    Select,
    Option,
    Typography,
} from "@material-tailwind/react";
import { TextInputLabel } from "@/widgets/textInputs";
import { postQuestion } from "@/services";

export function FAQPage() {
    const [openAccordion, setOpenAccordion] = useState(0);
    const [newQuestion, setNewQuestion] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [subject, setSubject] = useState("");
    const [email, setEmail] = useState("");
    const [request_type, setRequestType] = useState("question");

    const handleOpen = (value) => {
        setOpenAccordion(openAccordion === value ? 0 : value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newQuestion.trim() && subject.trim() && email.trim()) {

            const body = {
                subject,
                user_email: email,
                request_type,
                message: newQuestion,
            }

            try {
                const { data, status } = await postQuestion({ body });
                console.log(data, status);
                if (status == 200) {
                    setSubmitted(true);
                    setNewQuestion("");
                    setSubject("");
                    setEmail("");
                    setRequestType("question");
                    setTimeout(() => setSubmitted(false), 3000);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
                setTimeout(() => setError(null), 3000);
            }

        }
    };

    const faqs = [
        {
            question: "¿Puedo trabajar en proyectos de diferentes industrias?",
            answer:
                "Sí, nuestra plataforma abarca una variedad de industrias, desde tecnología y diseño hasta marketing y consultoría. Puedes filtrar proyectos según tus habilidades e intereses.",
        },
        {
            question:
                "¿Cómo puedo encontrar proyectos que se adapten a mis habilidades?",
            answer:
                "Puedes usar nuestros filtros avanzados de búsqueda para encontrar proyectos específicos por categoría, presupuesto, nivel de experiencia requerido y ubicación, si aplica.",
        },
        {
            question: "¿Qué pasa si un proyecto requiere trabajo en equipo?",
            answer:
                "Nuestra plataforma está diseñada para vincular freelancers a proyectos individuales. Sin embargo, planeamos incluir funcionalidades que permitan la creación de equipos de trabajo en el futuro.",
        },
        {
            question:
                "¿Cómo puedo garantizar que mi proyecto reciba propuestas de alta calidad?",
            answer:
                "Te recomendamos describir tu proyecto con claridad, especificar los requisitos y expectativas, y detallar el presupuesto y cronograma. Esto ayudará a atraer freelancers calificados y con experiencia.",
        },
        {
            question: "¿Cómo se asegura la seguridad de los datos en la plataforma?",
            answer:
                "Utilizamos protocolos de cifrado avanzados y seguimos estándares internacionales para proteger la información de clientes y freelancers. Además, tenemos controles de acceso estrictos y auditorías regulares.",
        },
        {
            question: "¿Qué tipo de soporte técnico ofrece la plataforma?",
            answer:
                "Nuestro equipo de soporte está disponible 24/7 para ayudarte con problemas técnicos, consultas sobre funcionalidades o cualquier otra necesidad relacionada con el uso de la plataforma.",
        },
        {
            question: "¿Puedo hacer cambios a mi perfil una vez publicado?",
            answer:
                "Sí, puedes actualizar tu perfil en cualquier momento. Esto incluye tu foto, descripción, habilidades, y portafolio, asegurándote de que refleje tus capacidades más recientes.",
        },
        {
            question: "¿Cómo se seleccionan los freelancers verificados?",
            answer:
                "Los freelancers verificados pasan por un proceso de validación que incluye la revisión de su identidad, certificaciones, experiencia previa y pruebas de habilidades en su área de expertise.",
        },
        {
            question:
                "¿Qué herramientas de gestión de proyectos ofrece la plataforma?",
            answer:
                "Contamos con herramientas como tableros de tareas, calendarios de entregas, mensajería integrada, y notificaciones en tiempo real para facilitar la colaboración y el seguimiento del progreso del proyecto.",
        },
        {
            question: "¿La plataforma permite proyectos con entregas por fases?",
            answer:
                "Sí, puedes dividir tu proyecto en hitos o entregas parciales, estableciendo objetivos y fechas específicas para cada fase del trabajo. Esto ayuda a estructurar el proyecto de manera más eficiente.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Preguntas Frecuentes
                    </h1>
                    <p className="text-lg text-gray-600">
                        Encuentra respuestas a las preguntas más comunes sobre nuestra
                        plataforma
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    {faqs.map((faq, idx) => (
                        <Accordion
                            key={idx}
                            open={openAccordion === idx + 1}
                            className="mb-2 rounded-lg border border-gray-200 px-4"
                        >
                            <AccordionHeader
                                onClick={() => handleOpen(idx + 1)}
                                className="transition-colors hover:text-blue-500"
                            >
                                {faq.question}
                            </AccordionHeader>
                            <AccordionBody className="text-base text-gray-700">
                                {faq.answer}
                            </AccordionBody>
                        </Accordion>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        ¿No encontraste lo que buscabas?
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="question"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Envíanos tu pregunta
                            </label>
                            <TextInputLabel
                                id="subject"
                                label="Subject"
                                placeholder="FAQ subject"
                                value={subject}
                                onValueChange={setSubject}
                            />
                            <TextInputLabel
                                id="email"
                                label="Email"
                                placeholder="Email"
                                value={email}
                                onValueChange={setEmail}
                            />
                            <div className="mb-1 flex flex-col gap-4">

                                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                                    Request type
                                </Typography>
                                <Select
                                    value={request_type}
                                    onChange={(value) => setRequestType(value)}
                                >
                                    <Option value="complaint">Complaint</Option>
                                    <Option value="question">Question</Option>
                                </Select>
                            </div>
                            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium my-2">
                                Message
                            </Typography>
                            <Textarea
                                id="question"
                                rows={4}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Escribe tu pregunta aquí..."
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" color="blue" onSubmit={handleSubmit} disabled={!email || !subject || !newQuestion || !email.includes("@")}>
                            Enviar Pregunta
                        </Button>
                    </form>

                    {submitted && (
                        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                            ¡Gracias por tu pregunta! Te responderemos pronto.
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            Hubo un error al enviar tu pregunta. Por favor, inténtalo de nuevo. Lo que sucedió fue {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
