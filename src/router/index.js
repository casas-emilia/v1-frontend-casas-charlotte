import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/publico/HomeView.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/nosotros',
    name: 'nosotros',
    component: () => import('../views/publico/NosotrosView.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/prefabricadas',
    name: 'prefabricadas',
    component: () => import('../views/publico/PrefabricadasView.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/prefabricadas/:id',
    name: 'prefabricada-detalle',
    component: () => import('../views/publico/PrefabricadaDetalleView.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/contactos',
    name: 'contactos',
    component: () => import('../views/publico/ContactoView.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/publico/BlogView.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/blog/:id',
    name: 'blog-detalle',
    component: () => import('../views/publico/BlogDetalleView.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/:pathMatch(.*)*', // Captura cualquier ruta no encontrada
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { isPublic: true }
  },

  // Login y gestion de contraseña
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/publico/LoginView.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/recuperar-contrasena',
    name: 'PasswordRecoveryRequest',
    component: () => import('../components/PasswordRecoveryRequest.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('../components/ResetPassword.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../views/publico/UnauthorizedView.vue'),
    meta: { isPublic: true }
  },

  //Administración
  {
    path: '/administracion',
    name: 'administracion',
    component: () => import('../views/Administracion/PanelAdministracion.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/administracionTipos',
    name: 'administracionTipos',
    component: () => import('../views/Administracion/AdministracionTiposView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/administracionCategorias',
    name: 'administracionCategorias',
    component: () => import('../views/Administracion/AdministracionCategoriasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/administracionEstilos',
    name: 'administracionEstilos',
    component: () => import('../views/Administracion/AdministracionEstilosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/administracionEmpresa',
    name: 'administracionEmpresa',
    component: () => import('../views/Administracion/AdministracionEmpresaView.vue'),
    meta: { requiresAuth: true, requiredRoles: ['super_administrador']  }
  },
  {
    path: '/administracionPrefabricadasManager',
    name: 'administracionPrefabricadasManager',
    component: () => import('../views/Administracion/PrefabricadasManager.vue'),
    meta: { requiresAuth: true }
    // meta: { requiresAuth: true, requiresSuperAdmin: true },
  },
  {
    path: '/administracionPortadas',
    name: 'administracionPortadas',
    component: () => import('../views/Administracion/AdministracionPortadasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/administracionServicios',
    name: 'administracionServicios',
    component: () => import('../views/Administracion/AdministracionServiciosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/administracionRedes',
    name: 'administracionRedes',
    component: () => import('../views/Administracion/AdministracionRedesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/administracionUsuarios',
    name: 'administracionUsuarios',
    component: () => import('../views/Administracion/AdministracionUsuariosView.vue'),
    meta: { requiresAuth: true, requiredRoles: ['super_administrador'] }
  },
  {
    path: '/administracionRoles',
    name: 'administracionRoles',
    component: () => import('../views/Administracion/AdministracionRolesView.vue'),
    meta: { requiresAuth: true, requiredRoles: ['super_administrador']  }
  },
  {
    path: '/administracionRolesUsuarios',
    name: 'administracionRolesUsuarios',
    component: () => import('../views/Administracion/AdministracionRolesUsuariosView.vue'),
    meta: { requiresAuth: true, requiredRoles: ['super_administrador']  }
  },
  {
    path: '/administracionNoticias',
    name: 'administracionNoticias',
    component: () => import('../views/Administracion/AdministracionNoticiasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/administracionDatosUsuario',
    name: 'administracionDatosUsuario',
    component: () => import('../views/Administracion/AdministracionDatosUsuarioView.vue'),
    meta: { requiresAuth: true }
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Utility function to check roles
const hasRequiredRole = (userRoles, requiredRoles) => {
  return requiredRoles.some(role => userRoles.includes(role))
}

// Role-based access control middleware
const checkRoleAccess = (to) => {
  const authStore = useAuthStore()
  // console.log('Current user roles:', authStore.roles)
  // console.log('Required roles for route:', to.meta.requiredRoles)

  if (!authStore.isAuthenticated) {
    // console.log('User is not authenticated')
    return '/login'
  }

  if (to.meta.requiredRoles && !hasRequiredRole(authStore.roles, to.meta.requiredRoles)) {
    // console.log('User does not have required roles')
    return '/unauthorized'
  }

  console.log('Access granted')
  return true
}

// Define routes and required roles
const routeRoles = {
  adminRoutes: {
    roles: ['super_administrador', 'administrador', 'ejecutivo_ventas'],
    routes: ['administracion', 'administracionTipos', 'administracionCategorias', 'administracionEstilos', 'administracionEmpresa', 'administracionPortadas', 'administracionServicios', 'administracionRedes', 'administracionNoticias']
  },
  superAdminRoutes: {
    roles: ['super_administrador'],
    routes: ['administracionPrefabricadasManager', 'administracionUsuarios', 'administracionRoles', 'administracionRolesUsuarios']
  }
}

// Assign required roles to routes
routes.forEach(route => {
  if (routeRoles.adminRoutes.routes.includes(route.name)) {
    route.meta = {
      ...route.meta,
      requiresAuth: true,
      requiredRoles: routeRoles.adminRoutes.roles
    }
  } else if (routeRoles.superAdminRoutes.routes.includes(route.name)) {
    route.meta = {
      ...route.meta,
      requiresAuth: true,
      requiredRoles: routeRoles.superAdminRoutes.roles
    }
  }
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  // SOLO PARA DESARROLLO!
  // console.log(`Navigating to: ${to.name}`)
  // console.log('Route meta:', to.meta)
  
  if (to.meta.isPublic) {
    next()
  } else if (to.meta.requiresAuth) {
    const accessCheck = checkRoleAccess(to)
    if (accessCheck === true) {
      next()
    } else {
      next(accessCheck)
    }
  } else {
    next()
  }
})

export default router