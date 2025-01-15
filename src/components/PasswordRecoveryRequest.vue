<template>
  <div class="recovery-container">
    <div class="recovery-card animate__animated animate__fadeIn">
      <div class="recovery-header">
        <h2><i class="fas fa-key"></i> Recuperar Contraseña</h2>
      </div>
      <form @submit.prevent="handleRecoveryRequest" class="recovery-form">
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
        <button type="submit" class="recovery-button" :disabled="isLoading">
          <span class="button-text">{{ isLoading ? 'Enviando...' : 'Enviar Solicitud' }}</span>
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
      <div v-if="message" class="success-message animate__animated animate__fadeIn">
        <i class="fas fa-check-circle"></i> {{ message }}
      </div>
      <div v-if="error" class="error-message animate__animated animate__shakeX">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>
      <div class="back-to-login">
        <router-link to="/login">
          Volver al Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const message = ref('')
const error = ref('')
const isLoading = ref(false)

const handleRecoveryRequest = async () => {
  message.value = ''
  error.value = ''
  isLoading.value = true

  try {
    const response = await axios.post('http://localhost:8080/password-recovery', {
      email: email.value
    })

    message.value = response.data.message || 'Se ha enviado un email con las instrucciones para recuperar tu contraseña.'
    email.value = ''
  } catch (err) {
    if (err.response) {
      error.value = err.response.data.error || 'Ocurrió un error al procesar tu solicitud'
    } else {
      error.value = 'Error de red. Por favor, intenta nuevamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
@import 'animate.css/animate.min.css';
</style>

<style scoped>
.recovery-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  padding: 20px;
}

.recovery-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.recovery-header {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: white;
  padding: 20px;
  text-align: center;
}

.recovery-header h2 {
  margin: 0;
  font-size: 24px;
}

.recovery-form {
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

.recovery-button {
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

.recovery-button:hover:not(:disabled) {
  background: linear-gradient(to right, #2980b9, #3a7bd5);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recovery-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-text {
  margin-right: 10px;
}

.success-message,
.error-message {
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
}

.success-message {
  background-color: #28a745;
  color: white;
}

.error-message {
  background-color: #e74c3c;
  color: white;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
  padding-bottom: 20px;
}

.back-to-login a {
  color: #3a7bd5;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-to-login a:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .recovery-card {
    border-radius: 0;
  }
}
</style>