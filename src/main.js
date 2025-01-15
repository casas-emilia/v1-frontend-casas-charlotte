import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import { useRouter } from 'vue-router';
import createPersistedState from 'pinia-plugin-persistedstate';
import axios from 'axios';
import Vue3TouchEvents from 'vue3-touch-events';
import { useAuthStore } from '@/stores/authStore';
import 'animate.css'

// Importaciones de estilos
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.vue';
import router from './router';

const pinia = createPinia();

// Configurar router en pinia
pinia.use(({ store }) => {
  store.router = markRaw(useRouter());
});
pinia.use(createPersistedState);

// Configuración global de axios
// axios.defaults.baseURL = 'http://localhost:8080/';
axios.defaults.baseURL = 'v1-backend-casas-charlotte-production.up.railway.app';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Crear la aplicación
const app = createApp(App);

// Usar Pinia antes de montar la app
app.use(pinia);
app.use(router);
app.use(Vue3TouchEvents, {
  disableClick: false, // Habilita clics además de gestos
});

// Recupera el token JWT del localStorage
const token = localStorage.getItem('token');

// Si el token existe, se agrega al encabezado Authorization de todas las solicitudes
if (token) {
//   console.log('Token encontrado en localStorage:', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
//   console.log('No se encontró un token en localStorage.');
}

// Montar la aplicación
app.mount('#app');

// Ahora, accede al store y configura los interceptores
const authStore = useAuthStore();
authStore.configureAxiosInterceptors(); // Configurar interceptores de Axios
