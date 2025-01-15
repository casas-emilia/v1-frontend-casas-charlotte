<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow animate__animated animate__fadeIn">
            <div class="card-body">
              <h2 class="text-center mb-4">
                <i class="fas fa-lock"></i> Cambiar Contraseña
              </h2>
              <form @submit.prevent="handleResetPassword">
                <div class="mb-3">
                  <label for="newPassword" class="form-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    id="newPassword"
                    v-model="newPassword"
                    required
                    minlength="8"
                  >
                </div>
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    required
                    minlength="8"
                  >
                </div>
                <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                  <i class="fas fa-save me-2"></i>
                  {{ isLoading ? 'Cambiando...' : 'Cambiar Contraseña' }}
                </button>
              </form>
              <div v-if="message" class="alert alert-success mt-3 animate__animated animate__fadeIn">
                {{ message }}
              </div>
              <div v-if="error" class="alert alert-danger mt-3 animate__animated animate__shakeX">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRoute, useRouter } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  
  const token = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const message = ref('')
  const error = ref('')
  const isLoading = ref(false)
  
  onMounted(() => {
    token.value = route.params.token
    if (!token.value) {
      error.value = 'Token inválido'
    }
  })
  
  const handleResetPassword = async () => {
    message.value = ''
    error.value = ''
    isLoading.value = true
  
    if (newPassword.value !== confirmPassword.value) {
      error.value = 'Las contraseñas no coinciden'
      isLoading.value = false
      return
    }
  
    try {
      const response = await axios.post('http://localhost:8080/reset-password', {
      // const response = await axios.post('https://v1backendcasasamilia-production.up.railway.app/reset-password', {  
        token: token.value,
        nueva_clave: newPassword.value,
        confirm_clave: confirmPassword.value
      })
  
      message.value = response.data.message || 'Contraseña actualizada correctamente'
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      if (err.response) {
        error.value = err.response.data.error || 'Ocurrió un error al cambiar la contraseña'
      } else {
        error.value = 'Error de red. Por favor, intenta nuevamente.'
      }
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  @import 'bootstrap/dist/css/bootstrap.min.css';
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  @import 'animate.css/animate.min.css';
  
  .card {
    border-radius: 1rem;
    overflow: hidden;
  }
  
  .card-body {
    padding: 2rem;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
  </style>