<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const nombre_empresa = ref('');
const descripcion_empresa = ref('');
const historia_empresa = ref('');
const servicios_empresa = ref([]);

const fetchNosotrosData = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/empresas/1`);
        const empresa = response.data.empresa;

        nombre_empresa.value = empresa.nombre_empresa;
        descripcion_empresa.value = empresa.descripcion_empresa;
        historia_empresa.value = empresa.historia_empresa;
        servicios_empresa.value = empresa.servicios;
    } catch (error) {
        console.error('Error al obtener los datos de Empresa:', error);
    }
};

onMounted(fetchNosotrosData);
</script>

<template>
  <div class="about-us">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-text">
          <h1>{{ nombre_empresa }}</h1>
          <p>{{ descripcion_empresa }}</p>
        </div>
        <div class="services-preview">
          <h2>Nuestros Servicios</h2>
          <div class="services-preview-grid">
            <div v-for="servicio in servicios_empresa.slice(0, 4)" 
                 :key="servicio.id" 
                 class="service-preview-item">
              <i class="fas fa-plus"></i>
              <span>{{ servicio.nombre_servicio }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="historia-section">
      <div class="container">
        <div class="historia-content">
          <div class="gradient-circle left"></div>
          <div class="historia-box">
            <h2>Nuestra Historia</h2>
            <p>{{ historia_empresa }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-us {
  --primary: #23ccc8;
  --primary-dark: #097b7a;
  --accent: #ef6e01;
  --white: #ffffff;

  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #333;
}

.hero-section {
  position: relative;
  min-height: 100vh;
  background-image: url('/img/casas_prefabricadas_charlotte_nosotros.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: var(--white);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-text {
  flex: 0 0 50%;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--white);
}

.hero-text p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--white);
}

.services-preview {
  flex: 0 0 40%;
  background-color: var(--accent);
  padding: 2rem;
  border-radius: 10px;
}

.services-preview h2 {
  color: var(--white);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.services-preview-grid {
  display: grid;
  gap: 1rem;
}

.service-preview-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--white);
  font-size: 1.1rem;
}

.service-preview-item i {
  font-size: 1.5rem;
}

.historia-section {
  padding: 5rem 0;
  background-color: var(--white);
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.historia-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.historia-box {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.historia-content h2 {
  color: var(--primary-dark);
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.gradient-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.6;
}

.gradient-circle.left {
  left: -150px;
  top: 50%;
  transform: translateY(-50%);
  background: radial-gradient(circle, var(--primary) 0%, rgba(255,255,255,0) 70%);
}

@media (max-width: 992px) {
  .hero-content {
    flex-direction: column;
    gap: 2rem;
  }

  .hero-text, .services-preview {
    flex: 0 0 100%;
  }

  .hero-text h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>