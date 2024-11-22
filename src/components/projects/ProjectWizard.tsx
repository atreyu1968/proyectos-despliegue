// ... (previous imports remain the same)

const ProjectWizard: React.FC<ProjectWizardProps> = ({
  project,
  convocatoria,
  onClose,
  onSave,
}) => {
  // ... (previous state declarations remain the same)

  const checkCenterLimit = async () => {
    // Get all projects from localStorage
    const projectsData = localStorage.getItem('projects');
    if (!projectsData) return true;

    const allProjects = JSON.parse(projectsData);
    const centerProjects = allProjects.filter((p: any) => 
      p.center === formData.center && 
      p.convocatoriaId === convocatoria.id &&
      p.status !== 'draft'
    );

    if (centerProjects.length >= convocatoria.maxProjectsPerCenter) {
      const confirmResult = await new Promise<boolean>((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
          <div class="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Límite de proyectos alcanzado
            </h3>
            <p class="text-gray-600 mb-6">
              El centro ${formData.center} ya ha alcanzado el límite de ${convocatoria.maxProjectsPerCenter} proyectos 
              para esta convocatoria. No es posible presentar más proyectos.
            </p>
            <div class="flex justify-end">
              <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300" id="closeModal">
                Entendido
              </button>
            </div>
          </div>
        `;

        document.body.appendChild(modal);
        const closeBtn = modal.querySelector('#closeModal');
        closeBtn?.addEventListener('click', () => {
          document.body.removeChild(modal);
          resolve(false);
        });
      });

      return confirmResult;
    }

    return true;
  };

  const handleSave = async (submit: boolean) => {
    if (submit) {
      const canSubmit = await checkCenterLimit();
      if (!canSubmit) return;
    }

    try {
      setIsSaving(true);
      await onSave(formData, submit ? 'submitted' : 'draft');
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto');
    } finally {
      setIsSaving(false);
    }
  };

  // ... (rest of the component remains the same)
};

export default ProjectWizard;