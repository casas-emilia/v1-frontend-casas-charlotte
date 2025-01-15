<template>
  <div class="login-container">
    <div class="login-card animate__animated animate__fadeIn">
      <div class="login-header">
        <h2><i class="fas fa-user-shield"></i> Acceso Seguro</h2>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">
            <i class="fas fa-envelope"></i>
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Correo electrónico"
            autocomplete="email"
          >
        </div>
        <div class="form-group">
          <label for="password">
            <i class="fas fa-lock"></i>
          </label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            required
            placeholder="Contraseña"
            autocomplete="current-password"
          >
          <button type="button" class="toggle-password" @click="togglePassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          <span class="button-text">{{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
          <i class="fas fa-sign-in-alt"></i>
        </button>
      </form>
      <div v-if="error" class="error-message animate__animated animate__shakeX">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>
      <div class="forgot-password">
        <router-link to="/recuperar-contrasena">
          ¿Olvidaste tu contraseña?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    await authStore.login(email.value, password.value);

    if (authStore.isSuperAdmin || authStore.isAdmin) {
      router.push('/administracionPrefabricadasManager');
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permiso para acceder a esta área.',
        showConfirmButton: false,
        timer: 3000,
      });
      router.push('/');
    }
  } catch (err) {
    error.value = err.message || 'Error inesperado. Verifica tu conexión.';
  } finally {
    isLoading.value = false;
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
@import 'animate.css/animate.min.css';
</style>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: white;
  padding: 20px;
  text-align: center;
}

.login-header h2 {
  margin: 0;
  font-size: 24px;
}

.login-form {
  padding: 30px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-group label {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #3a7bd5;
}

.form-group input {
  width: 100%;
  padding: 12px 20px 12px 40px;
  border: 1px solid #d1d9e6;
  border-radius: 25px;
  font-size: 16px;
  background-color: #e8f0fe;
  transition: all 0.3s ease;
  color: #333;
}

.form-group input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3a7bd5;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #3a7bd5;
  cursor: pointer;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(to right, #2980b9, #3a7bd5);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-text {
  margin-right: 10px;
}

.error-message {
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
}

.forgot-password {
  text-align: center;
  margin-top: 20px;
  padding-bottom: 20px;
}

.forgot-password a {
  color: #3a7bd5;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password a:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    border-radius: 0;
  }
}
</style>