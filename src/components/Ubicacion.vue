<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const empresas = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchUbicacion = async () => {
  try {
    const response = await axios.get('http://localhost:8080/empresas/1');
    console.log('Respuesta del servidor:', response);
    empresas.value = response.data.empresa || {};
    loading.value = false;
  } catch (err) {
    console.error('Error al obtener Ubicación:', err);
    error.value =
      err.response && err.response.status
        ? `Error ${err.response.status}: ${err.response.statusText}`
        : 'No se pudo conectar al servidor.';
    loading.value = false;
  }
};

onMounted(() => {
  fetchUbicacion();
});
</script>

<template>
  <section id="ubicacion" class="py-5 bg-pattern">
    <div class="container mb-5">
      <h2 class="text-center mb-5 section-title">
        Nuestra Ubicación
      </h2>
      <div v-if="loading" class="text-center loading-spinner">
        <div class="spinner"></div>
        <p>Cargando...</p>
      </div>
      <div v-else-if="error" class="text-center text-danger error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
      </div>
      <div v-else class="row align-items-center content-wrapper">
        <div class="col-md-6 map-container">
          <div class="ratio ratio-16x9 map-frame">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3292.403868421637!2d-71.2568022!3d-29.8916354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691b54c4fd2da83%3A0x1888324f0c8e5d30!2sCASAS%20PREFABRICADAS%20CHARLOTTE!5e1!3m2!1ses-419!2scl!4v1736632643386!5m2!1ses-419!2scl" 
              width="600" height="450" style="border:0;"  allowfullscreen="true"
              loading="lazy" referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          </div>
        </div>
        <div class="col-md-6 info-container">
          <div class="info-card">
            <h3 class="mb-4" style="color: #ef6e01;">
              Visítanos en nuestro sitio de exhibición
            </h3>
            <p v-if="empresas && empresas.ubicacion_empresa" class="info-item">
              <i class="fas fa-map-marker-alt text-primary me-2"></i>
              {{ empresas.ubicacion_empresa }}
            </p>
            <p v-else class="info-item loading">
              <i class="fas fa-spinner fa-spin text-primary"></i> Cargando ubicación...
            </p>
            <p v-if="empresas && empresas.celular_empresa" class="info-item">
              <i class="fas fa-phone-alt text-primary me-2"></i>{{ empresas.celular_empresa }}
            </p>
            <p v-if="empresas && empresas.email_empresa" class="info-item">
              <i class="fas fa-envelope text-primary me-2"></i>{{ empresas.email_empresa }}
            </p>
            <p>
              De Lunes a Viernes de 09:00 a 18:00 hrs.
            </p>
            <p>
              Sábados de 09:00 a 14:00 hrs.
            </p>
            <p>
              Domingos y feriados Cerrado
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
:root {
  --primary-color: #23ccc8;
  --secondary-color: #097b7a;
  --accent-color: #ef6e01;
  --text-color: #333333;
  --light-bg: #f8f9fa;
  --dark-bg: #343a40;
}
</style>

<style scoped>
.bg-pattern {
  background: linear-gradient(90deg, #ffffff, #f9ffff);
  /* background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2323ccc8' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); */
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.content-wrapper {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(9, 123, 122, 0.1);
  overflow: hidden;
}

.map-container {
  padding: 20px;
}

.map-frame {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(9, 123, 122, 0.1);
}

.info-container {
  padding: 20px;
}

.info-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(9, 123, 122, 0.05);
}

.info-item {
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateX(5px);
  color: var(--primary-color);
}

.info-item i {
  width: 25px;
  text-align: center;
  color: var(--primary-color);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  border: 4px solid rgba(35, 204, 200, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #ffe6e6;
  border: 1px solid #ff9999;
  border-radius: 5px;
  padding: 20px;
  margin-top: 20px;
}

.error-message i {
  font-size: 2rem;
  color: var(--accent-color);
  margin-bottom: 10px;
}

.text-primary {
  color: var(--primary-color) !important;
}

.text-danger {
  color: var(--accent-color) !important;
}
</style>