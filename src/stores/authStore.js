import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de tener este paquete instalado
/* import { getCurrentInstance } from 'vue'; // Importa getCurrentInstance
import Swal from 'sweetalert2'; */

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token');
    let userId = null;
    let roles = [];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        userId = decoded.usuario_id;
        roles = decoded.roles;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        localStorage.removeItem('token'); // Si el token es inválido, lo eliminamos
      }
    }

    return {
      token,
      userId,
      roles,
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    isSuperAdmin: (state) => state.roles.includes('super_administrador'),
    isAdmin: (state) => state.roles.includes('administrador', 'ejecutivo_ventas'),
  },

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);

      try {
        const decoded = jwtDecode(token);
        this.userId = decoded.usuario_id;
        this.roles = decoded.roles;
        // console.log('Token decodificado:', decoded);
      } catch (error) {
        console.error('Error al decodificar el token en setToken:', error);
        this.clearToken();
      }

      this.setAxiosAuthorizationHeader(token);
    },

    clearToken() {
      this.token = null;
      this.userId = null;
      this.roles = [];
      localStorage.removeItem('token');
      this.removeAxiosAuthorizationHeader();
    },

    setAxiosAuthorizationHeader(token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    removeAxiosAuthorizationHeader() {
      delete axios.defaults.headers.common['Authorization'];
    },

    configureAxiosInterceptors() {
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            console.warn('Sesión expirada o token inválido.');
            this.clearToken(); // Limpia el estado del store
            this.router.push('/login'); // Redirigir al login
          }
          return Promise.reject(error);
        }
      );
    },

    async login(email, password) {
      try {
        const { data } = await axios.post('/login', { email, password });
        this.setToken(data.token);
      } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
      }
    },

    logout() {
      // console.log('Cerrando sesión...');
      this.clearToken();
      /* console.log('Estado después de logout:', {
        token: this.token,
        userId: this.userId,
        roles: this.roles,
      }); */

    },
  },

  persist: true, // Si usas pinia-plugin-persistedstate
});
