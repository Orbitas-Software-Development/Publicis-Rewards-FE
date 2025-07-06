export interface Page {
  label: string;
  path: string;
  children?: Page[];
}

export type RoleKey = 'administrador' | 'supervisor' | 'manager' | 'colaborador';

export const menuConfig: Record<RoleKey, Page[]> = {
  administrador: [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Colaboradores', path: '/colaboradores' },
    {
      label: 'Huellas',
      path: '/huellas',
      children: [
        { label: 'Asignar Huellas', path: '/huellas/asignar' },
        { label: 'Categorías', path: '/huellas/categorias' },
      ],
    },
    { label: 'Premios', path: '/premios' },
    { label: 'Reportes', path: '/reportes' },
    { label: 'Configuración', path: '/configuracion' },
  ],
  supervisor: [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Mi Equipo', path: '/equipo' },
    { label: 'Reportes', path: '/reportes' },
  ],
  manager: [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Mi Equipo', path: '/equipo' },
    { label: 'Asignar Huellas', path: '/huellas' },
    { label: 'Reportes', path: '/reportes' },
  ],
  colaborador: [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Mis Huellas', path: '/mis-huellas' },
    { label: 'Catálogo', path: '/catalogo' },
    { label: 'Historial', path: '/historial' },
  ],
};
