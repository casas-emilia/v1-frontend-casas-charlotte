<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const prefabricadas = ref([]);
const featuredPrefabricadas = ref([]);
const loading = ref(true);
const error = ref(null);
const progressValue = ref(0);

const baseURL = "https://v1-backend-casas-charlotte-production.up.railway.app";
// const baseURL = "https://v1backendcasasamilia-production.up.railway.app";
const router = useRouter();

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const getPrefabricadas = async () => {
  try {
    loading.value = true;
    const { data: prefabricadasData } = await axios.get(`${baseURL}/empresas/1/prefabricadas`);
    
    if (prefabricadasData?.prefabricadas) {
      prefabricadas.value = prefabricadasData.prefabricadas
        .filter(prefab => prefab.destacada)
        .map((prefab) => ({
          ...prefab,
          id: prefab?.id,
          nombre_prefabricada: prefab?.nombre_prefabricada || 'Casa sin nombre',
          m2: prefab?.m2 || 'N/A',
          garantia: prefab?.garantia || 'No especificada',
          image: prefab?.imagenes_prefabricadas?.[0]?.image || '/img/placeholder.png',
          precios: Array.isArray(prefab?.precios) ? prefab.precios.map(precio => ({
            id: precio?.id,
            nombre_precio: precio?.nombre_precio || 'Precio base',
            valor_prefabricada: precio?.valor_prefabricada || 0
          })) : []
        }));
      updateFeaturedPrefabricadas();
    }
  } catch (err) {
    error.value = "Error al cargar las casas prefabricadas";
    console.error("Error al cargar las prefabricadas:", err);
  } finally {
    loading.value = false;
  }
};

const updateFeaturedPrefabricadas = () => {
  const shuffled = [...prefabricadas.value].sort(() => 0.5 - Math.random());
  featuredPrefabricadas.value = shuffled.slice(0, 3);
};

const verTodasPrefabricadas = () => {
  router.push({ name: 'prefabricadas' });    
};

const navigateToDetailPrefabricada = (id) => {
  if (id) {
    router.push({ name: "prefabricada-detalle", params: { id } });
  }
};

let intervalId;
let progressIntervalId;

const startIntervals = () => {
  intervalId = setInterval(() => {
    updateFeaturedPrefabricadas();
    progressValue.value = 0;
  }, 10000);

  progressIntervalId = setInterval(() => {
    progressValue.value += 1;
  }, 100);
};

onMounted(async () => {
  await getPrefabricadas();
  startIntervals();
});

onUnmounted(() => {
  clearInterval(intervalId);
  clearInterval(progressIntervalId);
});

const progressPercentage = computed(() => {
  return (progressValue.value / 100) * 100;
});
</script>

<template>
  <div class="animated-gradient py-5">
    <header class="text-white text-center py-5 animate__animated animate__fadeIn">
      <div class="container">
        <!-- <h1 class="display-4 fw-bold mb-3">Casas Prefabricadas <span style="color: #ef6e01;">Destacadas</span></h1> -->
        <h1 class="display-4 fw-bold mb-3">Casas Prefabricadas Destacadas</h1>
        <p class="lead mb-4">Descubre nuestras mejores opciones en casas prefabricadas</p>
      </div>
    </header>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <i class="fas fa-circle-notch fa-spin fa-3x text-white"></i>
      <p class="mt-3 text-white">Cargando casas prefabricadas destacadas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container">
      <div class="alert alert-danger text-center" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!featuredPrefabricadas.length" class="text-center text-white">
      <i class="fas fa-home fa-3x mb-3"></i>
      <p>No hay casas prefabricadas destacadas disponibles en este momento.</p>
    </div>

    <!-- Content -->
    <div v-else class="container">
      <div class="row justify-content-center g-4">
        <div
          v-for="prefabricada in featuredPrefabricadas"
          :key="prefabricada?.id"
          class="col-12 col-md-6 col-lg-4 d-flex justify-content-center"
        >
          <div
            class="card h-100 shadow-lg hover-card"
            @click="navigateToDetailPrefabricada(prefabricada?.id)"
          >
            <!-- Listones destacados y oferta -->
            <div class="ribbons">
              <span class="ribbon ribbon-purple">Destacada</span>
              <span v-if="prefabricada?.oferta" class="ribbon ribbon-red">Oferta</span>
            </div>

            <div class="position-relative">
              <img
                :src="prefabricada?.image"
                class="card-img-top"
                :alt="prefabricada?.nombre_prefabricada"
              />
              <div class="card-img-overlay d-flex align-items-end">
                <span v-if="prefabricada?.m2" class="badge text-dark bg-info mb-2">
                  {{ prefabricada.m2 }} m²
                </span>
              </div>
            </div>

            <div class="card-body">
              <h5 class="card-title text-info">
                {{ prefabricada?.nombre_prefabricada }}
              </h5>
              <p class="card-text">
                <i class="fas fa-shield-alt me-2"></i>
                Garantía: {{ prefabricada?.garantia }}
              </p>
              
              <template v-if="prefabricada?.precios?.length">
                <ul class="list-group list-group-flush">
                  <li
                    v-for="precio in prefabricada.precios"
                    :key="precio?.id"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {{ precio?.nombre_precio }}
                    <span class="badge bg-secondary rounded-pill">
                      ${{ formatPrice(precio?.valor_prefabricada) }}
                    </span>
                  </li>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button @click="verTodasPrefabricadas" class="btn btn-light btn-lg">
          Ver Catálogo Completo
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="progress mt-4">
        <div 
          class="progress-bar" 
          role="progressbar" 
          :style="{ width: progressPercentage + '%' }" 
          :aria-valuenow="progressValue" 
          aria-valuemin="0" 
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animated-gradient {
  /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); */
  background: linear-gradient(
    -45deg,
    #23ccc8, /* Color principal 1 */
    #4de6e2, /* Color más claro */
    #1ca39f, /* Intermedio */
    #097b7a, /* Color principal 2 */
    #045c5b, /* Más oscuro */
    #11b2af  /* Saturado */
  );
  background-size: 400% 400%;
  animation: gradient 13s ease infinite;
  min-height: 100vh;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.card {
  transition: all 0.3s ease;
  overflow: hidden;
  width: 100%;
  max-width: 30rem;
  background-color: rgba(255, 255, 255, 0.95);
  border: none;
}

.hover-card {
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
}

.card-img-top {
  height: 250px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hover-card:hover .card-img-top {
  transform: scale(1.1);
}

.btn-light {
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  color: #ef6e01;
  font-weight: 600;
  padding: 0.75rem 2rem;
  transition: all 0.3s ease;
}

.btn-light:hover {
  background-color: darkslategrey;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.badge {
  font-weight: 500;
  padding: 0.5em 1em;
}

/* estilos etiquetas destacada y oferta */
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

.progress {
  height: 5px;
  background-color: rgba(255, 255, 255, 0.3);
}

.progress-bar {
  background-color: #23a6d5;
  transition: width 0.1s linear;
}
</style>