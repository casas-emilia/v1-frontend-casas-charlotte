<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const prefabricadas = ref([]);
const randomPrefabricadas = ref([]);
const intervalId = ref(null);
const loading = ref(true);
const error = ref(null);

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
      prefabricadas.value = prefabricadasData.prefabricadas.map((prefab) => ({
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
      updateRandomPrefabricadas();
    }
  } catch (err) {
    error.value = "Error al cargar las casas prefabricadas";
    console.error("Error al cargar las prefabricadas:", err);
  } finally {
    loading.value = false;
  }
};

const updateRandomPrefabricadas = () => {
  if (prefabricadas.value?.length > 0) {
    randomPrefabricadas.value = [...prefabricadas.value]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }
};

const startInterval = () => {
  if (prefabricadas.value?.length > 3) {
    intervalId.value = setInterval(updateRandomPrefabricadas, 3000);
  }
};

const stopInterval = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

const verTodasPrefabricadas = () => {
  router.push({ name: 'prefabricadas' });    
};

const navigateToDetailPrefabricada = (id) => {
  if (id) {
    router.push({ name: "prefabricada-detalle", params: { id } });
  }
};

onMounted(async () => {
  await getPrefabricadas();
  startInterval();
});

onUnmounted(stopInterval);
</script>

<template>
  <div class="animated-gradient py-5">
    <header class="text-white text-center py-5 animate__animated animate__fadeIn">
      <div class="container">
        <h1 class="display-4 fw-bold mb-3">Casas Prefabricadas de Ensueño</h1>
        <p class="lead mb-4">Descubre la comodidad y eficiencia de nuestras casas prefabricadas</p>
      </div>
    </header>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <i class="fas fa-circle-notch fa-spin fa-3x text-white"></i>
      <p class="mt-3 text-white">Cargando casas prefabricadas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container">
      <div class="alert alert-danger text-center" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!randomPrefabricadas.length" class="text-center text-white">
      <i class="fas fa-home fa-3x mb-3"></i>
      <p>No hay casas prefabricadas disponibles en este momento.</p>
    </div>

    <!-- Content -->
    <div v-else class="container">
      <div class="row justify-content-center g-4">
        <div
          v-for="prefabricada in randomPrefabricadas"
          :key="prefabricada?.id"
          class="col-12 col-md-6 col-lg-4 d-flex justify-content-center"
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
                :alt="prefabricada?.nombre_prefabricada"
              />
              <div class="card-img-overlay d-flex align-items-end">
                <span v-if="prefabricada?.m2" class="badge bg-primary mb-2">
                  {{ prefabricada.m2 }} m²
                </span>
              </div>
            </div>

            <div class="card-body">
              <h5 class="card-title text-primary">
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
          Ver Catálogo
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animated-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
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
  color: #23a6d5;
  font-weight: 600;
  padding: 0.75rem 2rem;
  transition: all 0.3s ease;
}

.btn-light:hover {
  background-color: #23a6d5;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.badge {
  font-weight: 500;
  padding: 0.5em 1em;
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