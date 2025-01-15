<template>
  <section id="redes-sociales" class="py-5 text-white">
    <div class="container">
      <h2 class="text-center mb-5 text-white">Síguenos en Redes Sociales</h2>
      <div class="row justify-content-center">
        <div 
          v-for="red in redesSociales" 
          :key="red.id" 
          class="col-md-3 col-sm-6 mb-4 animate__animated animate__bounceIn"
          :style="{ 'animation-delay': `${red.id * 0.2}s` }"
        >
          <a :href="red.link" target="_blank" rel="noopener noreferrer" class="text-white text-decoration-none">
            <div class="card" :style="{ backgroundColor: getBackgroundColor(red.red_social) }">
              <div class="card-body text-center">
                <i :class="getIconClass(red.red_social)" class="fs-1 mb-3"></i>
                <h3 class="card-title h5 fw-bold">{{ red.red_social }}</h3>
                <p class="card-text text-light">{{ getDescription(red.red_social) }}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const redesSociales = ref([]);

    const fetchRedesSociales = async () => {
      try {
        const response = await axios.get('/empresas/1/redes/');
        //const response = await axios.get('https://v1backendcasasamilia-production.up.railway.app/empresas/1/redes/');
        redesSociales.value = response.data.redes_sociales;
      } catch (error) {
        console.error('Error fetching social media data:', error);
      }
    };

    onMounted(fetchRedesSociales);

    const getBackgroundColor = (redSocial) => {
      switch (redSocial.toLowerCase()) {
        case 'instagram': return 'darkorchid';
        case 'tiktok': return '#00f2ea';
        case 'youtube': return '#FF0000';
        default: return '#6c757d';
      }
    };

    const getIconClass = (redSocial) => {
      switch (redSocial.toLowerCase()) {
        case 'instagram': return 'bi bi-instagram';
        case 'tiktok': return 'bi bi-tiktok';
        case 'youtube': return 'bi bi-youtube';
        default: return 'bi bi-share';
      }
    };

    const getDescription = (redSocial) => {
      switch (redSocial.toLowerCase()) {
        case 'instagram': return 'Descubre nuestras fotos más inspiradoras';
        case 'tiktok': return 'Mantente al día con nuestras actualizaciones';
        case 'youtube': return 'Mira nuestros videos de proyectos y testimonios';
        default: return 'Síguenos en nuestras redes sociales';
      }
    };

    return {
      redesSociales,
      getBackgroundColor,
      getIconClass,
      getDescription,
    };
  },
};
</script>

<style scoped>
#redes-sociales .card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

#redes-sociales .card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

#redes-sociales {
  background-image: url('/img/fondo_redes_sociales_2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

#redes-sociales::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
  pointer-events: none;
}

#redes-sociales .container {
  position: relative;
  z-index: 2;
}
</style>

