<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Redes from '@/components/Redes.vue';

const actividades = ref([]);
const loading = ref(true);
const error = ref(null);
const pagination = ref({
  page: 1,
  limit: 12,
  total: 0,
});
const router = useRouter();

const getActividad = async () => {
  try {
    const noticiasResponse = await axios.get(
      `/empresas/1/noticiasEmpresa/`,
      //`https://v1backendcasasamilia-production.up.railway.app/empresas/1/noticiasEmpresa/`,
      {
        params: {
          page: pagination.value.page,
          limit: pagination.value.limit,
        },
      }
    );

    const { noticias, pagination: paginationData } = noticiasResponse.data;

    const noticiasConImagenes = await Promise.all(
      noticias.map(async (noticia) => {
        const imagenesResponse = await axios.get(
          `/empresas/1/noticiasEmpresa/${noticia.id}/imagenesNoticiasEmpresa/`
          //`https://v1backendcasasamilia-production.up.railway.app/empresas/1/noticiasEmpresa/${noticia.id}/imagenesNoticiasEmpresa/`
        );

        const imagenes = imagenesResponse.data.imagenes_noticia || [];
        return {
          ...noticia,
          imagenes: imagenes.length > 0 ? imagenes : [{ image: '/img/placeholder.png' }],
        };
      })
    );

    actividades.value = noticiasConImagenes;
    pagination.value = paginationData;
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = 'Error al cargar las actividades. Por favor, intente de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
};

const navigateToDetail = (id) => {
  router.push({ name: 'blog-detalle', params: { id: id } });
};

onMounted(getActividad);
</script>

<template>
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <img
      src="/img/fondo_madera_blog.png"
      class="hero-image"
      alt="Imagen de portada"
    />
    <div class="hero-content">
      <h1 class="hero-title">Proyectos y actividades</h1>
      <p class="hero-subtitle">Descubre nuestras últimas novedades e iniciativas</p>
    </div>
  </section>

  <div class="blog-view">
    <div class="container py-5">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Cargando contenido...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <p class="error-message">{{ error }}</p>
        <button class="retry-button" @click="getActividad">Intentar de nuevo</button>
      </div>

      <!-- Content -->
      <section v-else class="content-section">
        <div class="grid-container">
          <article 
            v-for="actividad in actividades" 
            :key="actividad.id" 
            class="card-wrapper"
            @click="navigateToDetail(actividad.id)"
          >
            <div class="card">
              <div class="card-image-wrapper">
                <img
                  :src="actividad.imagenes[0]?.image || '/img/placeholder.png'"
                  :alt="actividad.titulo_noticia"
                  class="card-image"
                />
              </div>
              <div class="card-content">
                <h2 class="card-title">{{ actividad.titulo_noticia }}</h2>
                <p class="card-description">{{ actividad.desarrollo_noticia }}</p>
                <div class="card-footer">
                  <span class="read-more">Leer más →</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <nav class="pagination-container" v-if="actividades.length">
          <button 
            class="pagination-button" 
            :disabled="pagination.page <= 1"
            @click="pagination.page > 1 && getActividad(--pagination.page)"
          >
            ← Anterior
          </button>
          <span class="pagination-info">
            Página {{ pagination.page }} de {{ Math.ceil(pagination.total / pagination.limit) }}
          </span>
          <button 
            class="pagination-button"
            :disabled="pagination.page * pagination.limit >= pagination.total"
            @click="pagination.page * pagination.limit < pagination.total && getActividad(++pagination.page)"
          >
            Siguiente →
          </button>
        </nav>
      </section>
    </div>
  </div>
  <Redes />
</template>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  height: 60vh;
  min-height: 400px;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  z-index: 1;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.1);
  animation: zoomEffect 20s infinite alternate;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
  width: 90%;
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease-out;
}

.hero-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease-out 0.2s backwards;
}

/* Main Content */
.blog-view {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.card-wrapper {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card-wrapper:hover {
  transform: translateY(-8px);
}

.card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-image-wrapper {
  position: relative;
  padding-top: 66%;
  overflow: hidden;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.card-description {
  color: #4a5568;
  line-height: 1.6;
  display: -webkit-box; /* Para navegadores basados en WebKit */
  display: box; /* Estándar (aunque aún no ampliamente soportado) */
  -webkit-line-clamp: 1; /* Limita a 1 línea */
  line-clamp: 1; /* Propiedad estándar */
  -webkit-box-orient: vertical; /* Necesario para WebKit */
  box-orient: vertical; /* Propiedad estándar */
  overflow: hidden; /* Oculta el texto excedente */
  margin-bottom: 1.5rem;
}

.card-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.read-more {
  color: #4299e1;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.card:hover .read-more {
  color: #2b6cb0;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  color: #2d3748;
  font-size: 1.1rem;
}

/* Error State */
.error-container {
  text-align: center;
  padding: 4rem 0;
  color: #2d3748;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.retry-button {
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #2b6cb0;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding: 1rem;
}

.pagination-button {
  background-color: white;
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:not(:disabled):hover {
  background-color: #4299e1;
  border-color: #4299e1;
  color: white;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #4a5568;
  font-weight: 500;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes zoomEffect {
  from { transform: scale(1.1); }
  to { transform: scale(1.2); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>