<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Redes from '@/components/Redes.vue';
import CarruselPortada from '@/components/CarruselPortada.vue';
import Ubicacion from '@/components/Ubicacion.vue';
import EjecutivosVentas from '@/components/EjecutivosVentas.vue';
import RandomPrefabricadas from '@/components/RandomPrefabricadas.vue';
import VentajasCaracteristicas from '@/components/VentajasCaracteristicas.vue';
import Numeros from '@/components/Numeros.vue';
import PrefabricadasDestacadas  from '@/components/PrefabricadasDestacadas.vue';

const noticias = ref([]);
const loadingNoticias = ref(true);
const errorNoticias = ref(null);
const router = useRouter();

const getUltimasNoticias = async () => {
  try {
    const response = await axios.get('/empresas/1/noticiasEmpresa/');
    // const response = await axios.get('https://v1backendcasasamilia-production.up.railway.app/empresas/1/noticiasEmpresa/');
    const noticiasData = response.data.noticias || [];

    const noticiasOrdenadas = noticiasData
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);

    const noticiasConImagenes = await Promise.all(
      noticiasOrdenadas.map(async (noticia) => {
        const imagenResponse = await axios.get(
          `/empresas/1/noticiasEmpresa/${noticia.id}/imagenesNoticiasEmpresa/`
          //`https://v1backendcasasamilia-production.up.railway.app/empresas/1/noticiasEmpresa/${noticia.id}/imagenesNoticiasEmpresa/`
        );
        const imagenes = imagenResponse.data.imagenes_noticia || [];
        return {
          ...noticia,
          imagenes: imagenes.length > 0 ? imagenes : [{ image: '/img/placeholder.png' }],
        };
      })
    );

    noticias.value = noticiasConImagenes;
  } catch (error) {
    console.error('Error al cargar las noticias:', error);
    errorNoticias.value = 'No se pudieron cargar las noticias. Intente nuevamente más tarde.';
  } finally {
    loadingNoticias.value = false;
  }
};

const verMasBlog = () => router.push({ name: 'blog' });
const navigateToDetailBlog = (id) => router.push({ name: 'blog-detalle', params: { id } });

onMounted(getUltimasNoticias);
</script>

<template>
  <div class="home-container">
    <CarruselPortada />
    <PrefabricadasDestacadas />
    <EjecutivosVentas />
    <VentajasCaracteristicas />
    <Ubicacion />

    <!-- Video Section -->
    <section class="video-section py-5">
      <div class="container">
        <h2 class="section-title">Casas Charlotte</h2>
        <div class="video-container">
          <iframe 
            src="https://www.youtube.com/embed/q5PPNZiu52w?si=a5H_wn6CNmF0XJXW"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <Numeros></Numeros>

    <!-- Latest Projects Section -->
    <section id="noticias" class="projects-section">
      <div class="container">
        <h2 class="section-title">Últimos proyectos y actividades</h2>

        <!-- Loading State -->
        <div v-if="loadingNoticias" class="loading-state">
          <div class="loader"></div>
          <p>Cargando proyectos...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="errorNoticias" class="error-state">
          <div class="error-icon">⚠️</div>
          <p>{{ errorNoticias }}</p>
        </div>

        <!-- Projects Grid -->
        <div v-else class="projects-grid">
          <article 
            v-for="noticia in noticias" 
            :key="noticia.id" 
            class="project-card"
            @click="navigateToDetailBlog(noticia.id)"
          >
            <div class="card-image">
              <img :src="noticia.imagenes[0]?.image" :alt="noticia.titulo_noticia">
              <div class="card-overlay">
                <span class="read-more">Ver más</span>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ noticia.titulo_noticia }}</h3>
              <p>{{ noticia.desarrollo_noticia }}</p>
            </div>
          </article>
        </div>

        <!-- View More Button -->
        <div class="view-more">
          <button @click="verMasBlog" class="btn-view-more">
            Ver todos los proyectos
            <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </section>

    <Redes />
  </div>
</template>

<style scoped>
/* Video Section */
.video-section {
  background: linear-gradient(60deg, #1a1a1a 0%, #2c3e50 100%);
  padding: 5rem 0;
  color: white;
}

.video-container {
  position: relative;
  padding-top: 56.25%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Projects Section */
.projects-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3436 100%);
  padding: 5rem 0;
  color: white;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  /* color: #0056b3; */
  color: lightblue;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #4299e1, #667eea);
  border-radius: 2px;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.project-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-image {
  position: relative;
  padding-top: 66%;
  overflow: hidden;
}

.card-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .card-image img {
  transform: scale(1.1);
}

.project-card:hover .card-overlay {
  opacity: 1;
}

.read-more {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid white;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.card-content {
  padding: 1.5rem;
  background: white;
}

.card-content h3 {
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.card-content p {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1; /* Propiedad estándar */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 0;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 3rem 0;
  color: #fc8181;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* View More Button */
.view-more {
  text-align: center;
  margin-top: 3rem;
}

.btn-view-more {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-view-more:hover {
  background: white;
  color: #2d3748;
  transform: translateY(-2px);
}

.arrow {
  transition: transform 0.3s ease;
}

.btn-view-more:hover .arrow {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.75rem;
  }

  .btn-view-more {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}
</style>