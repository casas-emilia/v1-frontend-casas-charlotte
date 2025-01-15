<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // Importa el store
import Footer from '@/components/Footer.vue';
import NavSuperAdmin from './components/Administracion/NavSuperAdminComponent.vue';
import NavAdmin from './components/Administracion/NavAdminComponent.vue';
import NavDefault from './components/Nav.vue'; // Navegación para usuarios públicos

const route = useRoute();
const authStore = useAuthStore();

const isRouteLoaded = ref(false);
const currentNav = ref(NavDefault); // Predeterminado a público

const updateNav = () => {
  const isPublicRoute = route.meta?.isPublic ?? false;

  if (isPublicRoute) {
    currentNav.value = NavDefault;
  } else if (authStore.isAuthenticated) {
    if (authStore.isSuperAdmin) {
      currentNav.value = NavSuperAdmin;
    } else if (authStore.isAdmin) {
      currentNav.value = NavAdmin;
    } else {
      currentNav.value = NavDefault; // Usuario autenticado pero sin rol autorizado
    }
  } else {
    currentNav.value = NavDefault; // Navegación pública
  }
  isRouteLoaded.value = true;
};


// Actualiza el estado cuando el usuario cierra sesión
const handleLogout = () => {
  authStore.logout();
  updateNav(); // Asegúrate de actualizar la navegación
};

// Inicializa la navegación al montar el componente
onMounted(() => {
  updateNav();
});

// Observa los cambios en la autenticación y roles
watch(
  () => [authStore.isAuthenticated, authStore.isSuperAdmin, authStore.isAdmin],
  () => {
    updateNav();
  },
  { deep: true }
);

// Observa cambios en la ruta
watch(
  () => route.name,
  () => {
    updateNav();
  }
);
</script>


<template>
  <div>
    <div v-if="!isRouteLoaded" class="loader-container">
      <div class="spinner"></div>
    </div>

    <div v-else>
      <!-- Render dinámico del nav -->
      <component :is="currentNav" :key="currentNav.name" />
      <RouterView />
      <Footer />
    </div>
  </div>
</template>



<style scoped>
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.unauthorized-message {
  text-align: center;
  padding: 2rem;
}
</style>
