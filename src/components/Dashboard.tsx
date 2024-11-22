import React from 'react';
import { FileText, Building2, Folder, Star, Calendar, Award, Users, CheckSquare, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderGuestDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Proyectos Activos</p>
              <p className="text-2xl font-semibold mt-1">15</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <Calendar size={16} className="mr-1" />
            <span>Convocatoria actual</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Centros Participantes</p>
              <p className="text-2xl font-semibold mt-1">8</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Building2 className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <Users size={16} className="mr-1" />
            <span>De toda la comunidad</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Categorías</p>
              <p className="text-2xl font-semibold mt-1">5</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Folder className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <Award size={16} className="mr-1" />
            <span>Diferentes áreas</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Proyectos Destacados</h3>
          <div className="space-y-4">
            {[
              { name: 'Sistema IoT', category: 'Tecnología', score: 9.5 },
              { name: 'App Educativa', category: 'Educación', score: 9.2 },
              { name: 'Gestión Sostenible', category: 'Medio Ambiente', score: 9.0 },
            ].map((project, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <Star className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.category}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  {project.score}/10
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Últimas Convocatorias</h3>
          <div className="space-y-4">
            {[
              { name: 'FP Innova 2024', projects: 15, status: 'active' },
              { name: 'FP Innova 2023', projects: 12, status: 'closed' },
              { name: 'FP Innova 2022', projects: 10, status: 'archived' },
            ].map((conv, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded">
                    <Calendar className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{conv.name}</p>
                    <p className="text-sm text-gray-500">{conv.projects} proyectos</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  conv.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : conv.status === 'closed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {conv.status === 'active' ? 'Activa' : conv.status === 'closed' ? 'Cerrada' : 'Archivada'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Usuarios Activos</p>
              <p className="text-2xl font-semibold mt-1">124</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <span>+12% este mes</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Proyectos Totales</p>
              <p className="text-2xl font-semibold mt-1">89</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <FileText className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <span>23 pendientes de revisión</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Revisiones Completadas</p>
              <p className="text-2xl font-semibold mt-1">45</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckSquare className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>78% completado</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Configuraciones</p>
              <p className="text-2xl font-semibold mt-1">12</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Settings className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600">
            <span>3 pendientes de revisar</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {[
              { action: 'Nuevo usuario registrado', user: 'María García', time: '10:30' },
              { action: 'Proyecto actualizado', user: 'Juan Pérez', time: '09:45' },
              { action: 'Revisión completada', user: 'Ana Martínez', time: '09:15' },
              { action: 'Convocatoria creada', user: 'Carlos López', time: '08:30' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">por {activity.user}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Estado del Sistema</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Uso de Almacenamiento</span>
                <span className="text-sm text-gray-500">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Rendimiento del Sistema</span>
                <span className="text-sm text-gray-500">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Carga del Servidor</span>
                <span className="text-sm text-gray-500">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderCoordinatorDashboard = () => (
    <div>Coordinator Dashboard</div>
  );

  const renderPresenterDashboard = () => (
    <div>Presenter Dashboard</div>
  );

  const renderReviewerDashboard = () => (
    <div>Reviewer Dashboard</div>
  );

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        {user.role === 'admin' && 'Panel de Administración'}
        {user.role === 'coordinator' && 'Panel de Coordinación'}
        {user.role === 'presenter' && 'Mis Proyectos'}
        {user.role === 'reviewer' && 'Panel de Revisión'}
        {user.role === 'guest' && 'Panel de Visualización'}
      </h1>

      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'coordinator' && renderCoordinatorDashboard()}
      {user.role === 'presenter' && renderPresenterDashboard()}
      {user.role === 'reviewer' && renderReviewerDashboard()}
      {user.role === 'guest' && renderGuestDashboard()}
    </div>
  );
};

export default Dashboard;