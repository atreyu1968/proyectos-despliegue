import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wand2 } from 'lucide-react';
import ProjectsList from '../components/projects/ProjectsList';
import ProjectWizard from '../components/projects/ProjectWizard';
import { Project } from '../types/project';
import { useAuth } from '../hooks/useAuth';

// Mock data for initial projects
const initialProjects: Project[] = [
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
  }
];

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Load projects from localStorage or use initial mock data
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      // Use initial mock projects
      setProjects(initialProjects);
      localStorage.setItem('projects', JSON.stringify(initialProjects));
    }
  }, []);

  const handleEditProject = (id: string) => {
    navigate(`/projects/edit/${id}`);
  };

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  const handleSaveProject = async (projectData: Partial<Project>, status: string) => {
    // TODO: Implement API call
    console.log('Saving project:', projectData, status);
    setShowWizard(false);
  };

  // Mock convocatoria data - Replace with API call
  const mockConvocatoria = {
    id: '1',
    title: 'Convocatoria 2024',
    categories: [
      {
        id: '1',
        name: 'Tecnología e Innovación',
        description: 'Proyectos tecnológicos innovadores',
        requirements: ['Memoria técnica', 'Presupuesto', 'Video demostrativo']
      }
    ]
  };

  const canUseWizard = user?.role === 'presenter' || user?.role === 'admin' || user?.role === 'coordinator';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
        <div className="flex items-center space-x-4">
          {canUseWizard && (
            <button
              onClick={() => setShowWizard(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Wand2 size={20} />
              <span>Asistente de presentación</span>
            </button>
          )}
          <button
            onClick={handleNewProject}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo proyecto</span>
          </button>
        </div>
      </div>

      <ProjectsList
        projects={projects}
        onEditProject={handleEditProject}
        onNewProject={handleNewProject}
      />

      {showWizard && (
        <ProjectWizard
          convocatoria={mockConvocatoria}
          onClose={() => setShowWizard(false)}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};

export default ProjectsPage;