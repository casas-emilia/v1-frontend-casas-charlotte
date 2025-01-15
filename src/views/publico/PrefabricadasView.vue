<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const baseURL = "http://localhost:8080";
// const baseURL = "https://v1backendcasasamilia-production.up.railway.app";

// Estados reactivos
const prefabricadas = ref([]);
const categorias = ref([]);
const estilos = ref([]);
const tipos = ref([]);
const selectedCategoria = ref(null);
const selectedTipo = ref(null);
const selectedEstilo = ref(null);
const searchQuery = ref("");
const loading = ref(true);
const error = ref(null);
const page = ref(1);
const loadingMore = ref(false);

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Cargar datos iniciales
const loadInitialData = async () => {
  try {
    loading.value = true;
    const [prefabricadasRes, categoriasRes, estilosRes, tiposRes] = await Promise.all([
      axios.get(`${baseURL}/empresas/1/prefabricadas/?page=${page.value}`),
      axios.get(`${baseURL}/categorias/`).catch(() => ({ data: { categorias: [] } })),
      axios.get(`${baseURL}/estilos/`).catch(() => ({ data: { estilos: [] } })),
      axios.get(`${baseURL}/tipos/`).catch(() => ({ data: { tipos: [] } }))
    ]);

    if (prefabricadasRes.data?.prefabricadas) {
      prefabricadas.value = prefabricadasRes.data.prefabricadas.map(prefab => ({
        ...prefab,
        image: prefab.imagenes_prefabricadas?.[0]?.image || '/img/placeholder.png',
        precios: prefab.precios || []
      }));
    }

    categorias.value = categoriasRes.data?.categorias || [];
    estilos.value = estilosRes.data?.estilos || [];
    tipos.value = tiposRes.data?.tipos || [];
  } catch (err) {
    error.value = "Error al cargar los datos iniciales.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Cargar más prefabricadas
const loadMore = async () => {
  if (!loadingMore.value && !loading.value) {
    try {
      loadingMore.value = true;
      page.value += 1;
      const { data } = await axios.get(`${baseURL}/empresas/1/prefabricadas/?page=${page.value}`);
      
      if (data?.prefabricadas?.length) {
        const newPrefabricadas = data.prefabricadas.map(prefab => ({
          ...prefab,
          image: prefab.imagenes_prefabricadas?.[0]?.image || '/img/placeholder.png',
          precios: prefab.precios || []
        }));
        prefabricadas.value = [...prefabricadas.value, ...newPrefabricadas];
      }
    } catch (err) {
      console.error('Error al cargar más prefabricadas:', err);
    } finally {
      loadingMore.value = false;
    }
  }
};

// Filtrar prefabricadas
const filteredPrefabricadas = computed(() => {
  return prefabricadas.value.filter(prefab => {
    if (!prefab) return false;

    const categoriaMatch = !selectedCategoria.value || 
                         prefab.categoria_id === selectedCategoria.value;
    const tipoMatch = !selectedTipo.value || 
                     prefab.tipo_id === selectedTipo.value;
    const estiloMatch = !selectedEstilo.value || 
                       prefab.estilo_id === selectedEstilo.value;
    const searchMatch = !searchQuery.value || 
                       prefab.nombre_prefabricada?.toLowerCase()
                         .includes(searchQuery.value.toLowerCase());

    return categoriaMatch && tipoMatch && estiloMatch && searchMatch;
  });
});

// Navegación
const navigateToDetailPrefabricada = (id) => {
  if (id) {
    router.push({ name: "prefabricada-detalle", params: { id } });
  }
};

onMounted(loadInitialData);
</script>

<template>
  <div class="prefabricadas-view">
     <!-- Header con formas geométricas -->
     <header class="header">
      <div class="geometric-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
      <div class="container position-relative">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="display-4 fw-bold text-white animate__animated animate__fadeInLeft">Casas Charlotte</h1>
            <p class="lead text-white animate__animated animate__fadeInLeft animate__delay-1s">
              La calidad y la belleza no tienen por qué esperar años.
            </p>
          </div>
          <div class="col-md-6 text-end">
            <div class="image-container">
              <img src="/img/casas_prefabricadas_charlotte.jpg" alt="Casas prefabricadas Charlotte" class="img-fluid rounded">
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="container-fluid bg-gradient py-5">
      <!-- Filtros -->
      <div class="container mb-4">
        <div class="row g-3">
          <div class="col-md-6 col-lg-3">
            <div class="input-group">
              <span class="input-group-text bg-info text-white">
                <i class="fas fa-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Buscar por nombre..."
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <select v-model="selectedCategoria" class="form-select">
              <option :value="null">Todas las categorías</option>
              <option
                v-for="categoria in categorias"
                :key="categoria?.id"
                :value="categoria?.id"
              >
                {{ categoria?.nombre_categoria || 'Categoría sin nombre' }}
              </option>
            </select>
          </div>
          <div class="col-md-6 col-lg-3">
            <select v-model="selectedTipo" class="form-select">
              <option :value="null">Todos los tipos</option>
              <option
                v-for="tipo in tipos"
                :key="tipo?.id"
                :value="tipo?.id"
              >
                {{ tipo?.material_estructura || 'Tipo sin nombre' }}
              </option>
            </select>
          </div>
          <div class="col-md-6 col-lg-3">
            <select v-model="selectedEstilo" class="form-select">
              <option :value="null">Todos los estilos</option>
              <option
                v-for="estilo in estilos"
                :key="estilo?.id"
                :value="estilo?.id"
              >
                {{ estilo?.nombre_estilo || 'Estilo sin nombre' }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Estados de carga y error -->
      <div v-if="loading" class="text-center py-5">
        <i class="fas fa-circle-notch fa-spin fa-3x text-primary"></i>
        <p class="mt-3 text-dark">Cargando casas prefabricadas...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger mx-3">
        <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
      </div>

      <div v-else-if="filteredPrefabricadas.length === 0" 
           class="text-center text-dark py-5">
        <i class="fas fa-search fa-3x mb-3"></i>
        <p>No se encontraron Prefabricadas con los filtros aplicados.</p>
      </div>

      <!-- Lista de prefabricadas -->
      <div v-else class="row g-4 mx-3">
        <div
          v-for="prefabricada in filteredPrefabricadas"
          :key="prefabricada?.id"
          class="col-md-6 col-lg-4"
        >
          <div 
            class="card h-100 shadow-lg hover-card"
            @click="navigateToDetailPrefabricada(prefabricada?.id)"
          >

          <!-- Listones destacados y oferta -->
          <div class="ribbons">
            <span v-if="prefabricada?.destacada" class="ribbon ribbon-purple">Destacada</span>
            <span v-if="prefabricada?.oferta" class="ribbon ribbon-red">Oferta</span>
          </div>

            <div class="position-relative">
              <img
                :src="prefabricada?.image"
                class="card-img-top"
                :alt="prefabricada?.nombre_prefabricada || 'Casa prefabricada'"
              />
              <div class="card-img-overlay d-flex align-items-end">
                <span v-if="prefabricada?.m2" class="badge text-dark bg-info mb-2">
                  {{ prefabricada.m2 }} m²
                </span>
              </div>
            </div>
            
            <div class="card-body">
              <h5 class="card-title text-info">
                {{ prefabricada?.nombre_prefabricada || 'Sin nombre' }}
              </h5>
              <p v-if="prefabricada?.garantia" class="card-text">
                <i class="fas fa-shield-alt me-2"></i>
                Garantía: {{ prefabricada.garantia }}
              </p>
              
              <template v-if="prefabricada?.precios?.length">
                <h6 class="mt-4 mb-3 text-secondary">
                  <i class="fas fa-tag me-2"></i>Precios:
                </h6>
                <ul class="list-group list-group-flush">
                  <li 
                    v-for="precio in prefabricada.precios" 
                    :key="precio?.id"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {{ precio?.nombre_precio || 'Precio sin nombre' }}
                    <span class="badge bg-secondary rounded-pill">
                      ${{ formatPrice(precio?.valor_prefabricada || 0) }}
                    </span>
                  </li>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón "Ver más" -->
      <div 
        v-if="!loading && filteredPrefabricadas.length > 0" 
        class="text-center mt-4"
      >
        <button
          v-if="!loadingMore"
          @click="loadMore"
          class="btn btn-outline-dark"
        >
          Ver más
        </button>
        <div v-else class="text-dark">
          <i class="fas fa-spinner fa-spin"></i> Cargando más...
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

.header {
  background: linear-gradient(135deg, #23ccc8 0%, #097b7a 100%);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
  animation: fadeInDown 1s ease-in-out;
}

.geometric-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morphing 15s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -50px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 10%;
  animation-delay: -3s;
  background: rgba(255, 255, 255, 0.08);
}

.shape-3 {
  width: 250px;
  height: 250px;
  bottom: -50px;
  left: 20%;
  animation-delay: -6s;
  background: rgba(255, 255, 255, 0.05);
}

.shape-4 {
  width: 150px;
  height: 150px;
  top: 20%;
  left: 40%;
  animation-delay: -9s;
  background: rgba(255, 255, 255, 0.07);
}

@keyframes morphing {
  0% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
  25% {
    border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
  }
  50% {
    border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
  }
  75% {
    border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
  }
  100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
}

.image-container {
  overflow: hidden;
  border-radius: 10px;
}

.image-container img {
  animation: slowZoom 20s infinite;
}

@keyframes slowZoom {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.bg-gradient {
  background: linear-gradient(135deg, #0f2952 0%, #1a3a6e 100%);
  min-height: 100vh;
}

.hover-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
}

.card-img-top {
  height: 250px;
  object-fit: cover;
  transition: all 0.5s ease;
}

.hover-card:hover .card-img-top {
  transform: scale(1.1);
}

.input-group-text {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.form-control, .form-select {
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.form-control:focus, .form-select:focus {
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* esilos etiquetas destacada y oferta */
.ribbons {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ribbon {
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 0.2rem 1rem;
  text-transform: uppercase;
  clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
}

.ribbon-purple {
  background-color: #6a1b9a;
}

.ribbon-red {
  background-color: #d32f2f;
}

</style>