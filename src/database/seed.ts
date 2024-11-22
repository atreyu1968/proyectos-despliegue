import { v4 as uuidv4 } from 'uuid';

// Mock data for initial setup
const mockProjects = [
  {
    id: '1',
    title: 'Sistema de Monitorización IoT',
    description: 'Sistema de monitorización ambiental utilizando sensores IoT y análisis de datos en tiempo real.',
    category: {
      id: '1',
      name: 'Tecnología e Innovación',
      description: 'Proyectos tecnológicos innovadores',
      maxParticipants: 4,
      minCorrections: 2,
      requirements: ['Memoria técnica', 'Presupuesto', 'Video demostrativo'],
      cutoffScore: 7,
      totalBudget: 10000,
      rubric: {
        id: '1',
        sections: [
          {
            id: 's1',
            name: 'Innovación y Originalidad',
            description: 'Evaluación del grado de innovación y originalidad del proyecto',
            weight: 30,
            criteria: [
              {
                id: 'c1',
                name: 'Originalidad de la propuesta',
                description: 'Grado de originalidad y diferenciación respecto a soluciones existentes',
                maxScore: 10,
                sectionId: 's1',
                levels: [
                  { id: 'l1', score: 10, description: 'Propuesta altamente innovadora y única' },
                  { id: 'l2', score: 7, description: 'Propuesta innovadora con elementos diferenciadores' },
                  { id: 'l3', score: 4, description: 'Propuesta con algunos elementos innovadores' },
                  { id: 'l4', score: 1, description: 'Propuesta poco innovadora' }
                ]
              },
              {
                id: 'c2',
                name: 'Aplicación tecnológica',
                description: 'Uso adecuado y novedoso de la tecnología',
                maxScore: 10,
                sectionId: 's1',
                levels: [
                  { id: 'l1', score: 10, description: 'Uso excepcional y novedoso de la tecnología' },
                  { id: 'l2', score: 7, description: 'Buen uso de la tecnología' },
                  { id: 'l3', score: 4, description: 'Uso básico de la tecnología' },
                  { id: 'l4', score: 1, description: 'Uso limitado de la tecnología' }
                ]
              }
            ]
          },
          {
            id: 's2',
            name: 'Viabilidad y Desarrollo',
            description: 'Evaluación de la viabilidad técnica y nivel de desarrollo',
            weight: 40,
            criteria: [
              {
                id: 'c3',
                name: 'Viabilidad técnica',
                description: 'Factibilidad de implementación y recursos necesarios',
                maxScore: 10,
                sectionId: 's2',
                levels: [
                  { id: 'l1', score: 10, description: 'Proyecto completamente viable y bien planificado' },
                  { id: 'l2', score: 7, description: 'Proyecto viable con algunos desafíos menores' },
                  { id: 'l3', score: 4, description: 'Proyecto viable pero con desafíos significativos' },
                  { id: 'l4', score: 1, description: 'Proyecto con dudosa viabilidad' }
                ]
              },
              {
                id: 'c4',
                name: 'Nivel de desarrollo',
                description: 'Estado actual del desarrollo y prototipado',
                maxScore: 10,
                sectionId: 's2',
                levels: [
                  { id: 'l1', score: 10, description: 'Prototipo funcional completo' },
                  { id: 'l2', score: 7, description: 'Prototipo parcialmente funcional' },
                  { id: 'l3', score: 4, description: 'Prototipo básico o mockup' },
                  { id: 'l4', score: 1, description: 'Solo concepto sin prototipo' }
                ]
              }
            ]
          },
          {
            id: 's3',
            name: 'Impacto y Aplicabilidad',
            description: 'Evaluación del impacto potencial y aplicabilidad real',
            weight: 30,
            criteria: [
              {
                id: 'c5',
                name: 'Impacto social/educativo',
                description: 'Beneficios y mejoras aportadas al ámbito educativo',
                maxScore: 10,
                sectionId: 's3',
                levels: [
                  { id: 'l1', score: 10, description: 'Impacto significativo y demostrable' },
                  { id: 'l2', score: 7, description: 'Impacto positivo considerable' },
                  { id: 'l3', score: 4, description: 'Impacto moderado' },
                  { id: 'l4', score: 1, description: 'Impacto limitado' }
                ]
              },
              {
                id: 'c6',
                name: 'Aplicabilidad práctica',
                description: 'Facilidad de implementación en entornos reales',
                maxScore: 10,
                sectionId: 's3',
                levels: [
                  { id: 'l1', score: 10, description: 'Fácilmente aplicable en múltiples contextos' },
                  { id: 'l2', score: 7, description: 'Aplicable con adaptaciones menores' },
                  { id: 'l3', score: 4, description: 'Aplicable con adaptaciones significativas' },
                  { id: 'l4', score: 1, description: 'Difícilmente aplicable' }
                ]
              }
            ]
          }
        ],
        totalScore: 60
      }
    },
    center: 'IES Tecnológico',
    department: 'Informática',
    status: 'submitted',
    submissionDate: '2024-03-01',
    lastModified: '2024-03-15',
    presenters: ['1', '2'],
    reviewers: [],
    score: null,
    documents: [
      {
        id: '1',
        name: 'Memoria Técnica',
        type: 'pdf',
        url: '/documents/memoria.pdf',
        uploadDate: '2024-03-01',
        status: 'approved'
      }
    ],
    convocatoriaId: '1'
  },
  {
    id: '2',
    title: 'Plataforma de Aprendizaje Adaptativo',
    description: 'Sistema educativo que adapta el contenido según el progreso y necesidades del estudiante.',
    category: {
      id: '2',
      name: 'Educación Digital',
      description: 'Proyectos de innovación educativa',
      maxParticipants: 4,
      minCorrections: 2,
      requirements: ['Memoria técnica', 'Guía didáctica', 'Demo funcional'],
      cutoffScore: 7,
      totalBudget: 8000,
      rubric: {
        id: '2',
        sections: [
          {
            id: 's1',
            name: 'Innovación Pedagógica',
            description: 'Evaluación del enfoque pedagógico y metodológico',
            weight: 35,
            criteria: [
              {
                id: 'c1',
                name: 'Enfoque metodológico',
                description: 'Fundamentación y adecuación del enfoque pedagógico',
                maxScore: 10,
                sectionId: 's1',
                levels: [
                  { id: 'l1', score: 10, description: 'Enfoque innovador y bien fundamentado' },
                  { id: 'l2', score: 7, description: 'Enfoque adecuado con elementos innovadores' },
                  { id: 'l3', score: 4, description: 'Enfoque convencional pero correcto' },
                  { id: 'l4', score: 1, description: 'Enfoque poco desarrollado' }
                ]
              },
              {
                id: 'c2',
                name: 'Adaptabilidad',
                description: 'Capacidad de adaptación a diferentes niveles y necesidades',
                maxScore: 10,
                sectionId: 's1',
                levels: [
                  { id: 'l1', score: 10, description: 'Adaptación completa y personalizada' },
                  { id: 'l2', score: 7, description: 'Buena adaptabilidad' },
                  { id: 'l3', score: 4, description: 'Adaptabilidad básica' },
                  { id: 'l4', score: 1, description: 'Poca adaptabilidad' }
                ]
              }
            ]
          },
          {
            id: 's2',
            name: 'Tecnología y Usabilidad',
            description: 'Evaluación de aspectos técnicos y experiencia de usuario',
            weight: 35,
            criteria: [
              {
                id: 'c3',
                name: 'Usabilidad',
                description: 'Facilidad de uso e interfaz de usuario',
                maxScore: 10,
                sectionId: 's2',
                levels: [
                  { id: 'l1', score: 10, description: 'Interfaz intuitiva y excelente UX' },
                  { id: 'l2', score: 7, description: 'Buena usabilidad' },
                  { id: 'l3', score: 4, description: 'Usabilidad aceptable' },
                  { id: 'l4', score: 1, description: 'Problemas de usabilidad' }
                ]
              },
              {
                id: 'c4',
                name: 'Implementación técnica',
                description: 'Calidad de la implementación y tecnologías utilizadas',
                maxScore: 10,
                sectionId: 's2',
                levels: [
                  { id: 'l1', score: 10, description: 'Excelente implementación técnica' },
                  { id: 'l2', score: 7, description: 'Buena implementación' },
                  { id: 'l3', score: 4, description: 'Implementación básica' },
                  { id: 'l4', score: 1, description: 'Implementación deficiente' }
                ]
              }
            ]
          },
          {
            id: 's3',
            name: 'Impacto Educativo',
            description: 'Evaluación del impacto en el proceso de aprendizaje',
            weight: 30,
            criteria: [
              {
                id: 'c5',
                name: 'Mejora del aprendizaje',
                description: 'Contribución a la mejora del proceso de aprendizaje',
                maxScore: 10,
                sectionId: 's3',
                levels: [
                  { id: 'l1', score: 10, description: 'Mejora significativa demostrable' },
                  { id: 'l2', score: 7, description: 'Mejora notable' },
                  { id: 'l3', score: 4, description: 'Mejora moderada' },
                  { id: 'l4', score: 1, description: 'Mejora limitada' }
                ]
              },
              {
                id: 'c6',
                name: 'Evaluación y seguimiento',
                description: 'Herramientas de evaluación y seguimiento del progreso',
                maxScore: 10,
                sectionId: 's3',
                levels: [
                  { id: 'l1', score: 10, description: 'Sistema completo de evaluación' },
                  { id: 'l2', score: 7, description: 'Buen sistema de evaluación' },
                  { id: 'l3', score: 4, description: 'Sistema básico' },
                  { id: 'l4', score: 1, description: 'Sistema limitado' }
                ]
              }
            ]
          }
        ],
        totalScore: 60
      }
    },
    center: 'IES Innovación',
    department: 'Pedagogía',
    status: 'submitted',
    submissionDate: '2024-03-10',
    lastModified: '2024-03-10',
    presenters: ['4'],
    reviewers: [],
    documents: [
      {
        id: '2',
        name: 'Propuesta Pedagógica',
        type: 'pdf',
        url: '/documents/propuesta.pdf',
        uploadDate: '2024-03-10',
        status: 'pending'
      }
    ],
    convocatoriaId: '1'
  },
  {
    id: '3',
    title: 'Gestión de Residuos Inteligente',
    description: 'Sistema de optimización para la gestión y reciclaje de residuos en centros educativos.',
    category: {
      id: '3',
      name: 'Sostenibilidad',
      description: 'Proyectos enfocados en sostenibilidad y medio ambiente',
      maxParticipants: 4,
      minCorrections: 2,
      requirements: ['Memoria técnica', 'Estudio de impacto ambiental'],
      cutoffScore: 7,
      totalBudget: 12000,
      rubric: {
        id: '3',
        sections: [
          {
            id: 's1',
            name: 'Impacto Ambiental',
            description: 'Evaluación del impacto positivo en el medio ambiente',
            weight: 40,
            criteria: [
              {
                id: 'c1',
                name: 'Reducción de huella ambiental',
                description: 'Capacidad del proyecto para reducir el impacto ambiental',
                maxScore: 10,
                sectionId: 's1',
                levels: [
                  { id: 'l1', score: 10, description: 'Reducción significativa y medible' },
                  { id: 'l2', score: 7, description: 'Reducción notable' },
                  { id: 'l3', score: 4, description: 'Reducción moderada' },
                  { id: 'l4', score: 1, description: 'Reducción mínima' }
                ]
              },
              {
                id: 'c2',
                name: 'Eficiencia energética',
                description: 'Uso eficiente de recursos energéticos',
                maxScore: 10,
                sectionId: 's1',
                levels: [
                  { id: 'l1', score: 10, description: 'Altamente eficiente energéticamente' },
                  { id: 'l2', score: 7, description: 'Buena eficiencia energética' },
                  { id: 'l3', score: 4, description: 'Eficiencia energética moderada' },
                  { id: 'l4', score: 1, description: 'Baja eficiencia energética' }
                ]
              }
            ]
          },
          {
            id: 's2',
            name: 'Viabilidad y Escalabilidad',
            description: 'Evaluación de la viabilidad y potencial de crecimiento',
            weight: 30,
            criteria: [
              {
                id: 'c3',
                name: 'Viabilidad económica',
                description: 'Sostenibilidad económica del proyecto',
                maxScore: 10,
                sectionId: 's2',
                levels: [
                  { id: 'l1', score: 10, description: 'Modelo económico sólido y sostenible' },
                  { id: 'l2', score: 7, description: 'Modelo económico viable' },
                  { id: 'l3', score: 4, description: 'Viabilidad económica limitada' },
                  { id: 'l4', score: 1, description: 'Viabilidad económica dudosa' }
                ]
              },
              {
                id: 'c4',
                name: 'Potencial de escalabilidad',
                description: 'Capacidad de crecimiento y replicación',
                maxScore: 10,
                sectionId: 's2',
                levels: [
                  { id: 'l1', score: 10, description: 'Alto potencial de escalabilidad' },
                  { id: 'l2', score: 7, description: 'Buen potencial de escalabilidad' },
                  { id: 'l3', score: 4, description: 'Potencial de escalabilidad limitado' },
                  { id: 'l4', score: 1, description: 'Difícil de escalar' }
                ]
              }
            ]
          },
          {
            id: 's3',
            name: 'Innovación y Originalidad',
            description: 'Evaluación de aspectos innovadores en sostenibilidad',
            weight: 30,
            criteria: [
              {
                id: 'c5',
                name: 'Solución innovadora',
                description: 'Originalidad de la solución propuesta',
                maxScore: 10,
                sectionId: 's3',
                levels: [
                  { id: 'l1', score: 10, description: 'Solución altamente innovadora' },
                  { id: 'l2', score: 7, description: 'Solución innovadora' },
                  { id: 'l3', score: 4, description: 'Solución parcialmente innovadora' },
                  { id: 'l4', score: 1, description: 'Solución poco innovadora' }
                ]
              },
              {
                id: 'c6',
                name: 'Impacto social',
                description: 'Beneficios para la comunidad',
                maxScore: 10,
                sectionId: 's3',
                levels: [
                  { id: 'l1', score: 10, description: 'Impacto social significativo' },
                  { id: 'l2', score: 7, description: 'Buen impacto social' },
                  { id: 'l3', score: 4, description: 'Impacto social moderado' },
                  { id: 'l4', score: 1, description: 'Impacto social limitado' }
                ]
              }
            ]
          }
        ],
        totalScore: 60
      }
    },
    center: 'IES Tecnológico',
    department: 'Medio Ambiente',
    status: 'draft',
    lastModified: '2024-03-12',
    presenters: ['5', '6'],
    reviewers: [],
    documents: [
      {
        id: '3',
        name: 'Borrador Inicial',
        type: 'pdf',
        url: '/documents/borrador.pdf',
        uploadDate: '2024-03-12',
        status: 'pending'
      }
    ],
    convocatoriaId: '1'
  }
];

// Guardar los proyectos actualizados en localStorage
localStorage.setItem('projects', JSON.stringify(mockProjects));

// Limpiar las asignaciones de revisores
localStorage.setItem('project_reviewers', JSON.stringify({}));

// Limpiar las revisiones existentes
localStorage.setItem('project_reviews', JSON.stringify({}));

console.log('Base de datos reiniciada con éxito');