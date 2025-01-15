<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import EjecutivosVentas from "@/components/EjecutivosVentas.vue";

const prefabricada = ref(null);
const loading = ref(true);
const error = ref(null);
const lightboxOpen = ref(false);
const currentImageIndex = ref(0);
const currentPlanoIndex = ref(0);
const isPlanoLightbox = ref(false); 
const touchStartX = ref(0);
const touchEndX = ref(0);

const route = useRoute();
const router = useRouter();
const baseURL = "http://localhost:8080/empresas/1";

// Computed properties para separar imágenes normales y planos
const regularImages = computed(() => 
  prefabricada.value?.imagenes_prefabricadas?.filter(img => !img.plano) || []
);

const planoImages = computed(() => 
  prefabricada.value?.imagenes_prefabricadas?.filter(img => img.plano) || []
);

const hasRegularImages = computed(() => regularImages.value.length > 0);
const hasPlanoImages = computed(() => planoImages.value.length > 0);

const currentRegularImage = computed(() => 
  hasRegularImages.value ? regularImages.value[currentImageIndex.value].image : null
);

const currentPlanoImage = computed(() => 
  hasPlanoImages.value ? planoImages.value[currentPlanoIndex.value].image : null
);

// Función para manejar errores de carga de imágenes
const handleImageError = (event) => {
  event.target.src = '/img/placeholder.png';
};

// Add this new ref for managing accordion state
const openAccordions = ref(new Set());

// Add these new functions for accordion management
const toggleAccordion = (id) => {
  if (openAccordions.value.has(id)) {
    openAccordions.value.delete(id);
  } else {
    openAccordions.value.add(id);
  }
};

const isAccordionOpen = (id) => openAccordions.value.has(id);

onMounted(async () => {
  const prefabricadaId = route.params.id;
  try {
    loading.value = true;
    const { data } = await axios.get(`${baseURL}/prefabricadas/${prefabricadaId}`);
    
    if (data?.prefabricada) {
      prefabricada.value = data.prefabricada;
    } else {
      throw new Error('No se encontró la casa prefabricada');
    }
  } catch (err) {
    error.value = "No se pudo cargar la información de la casa prefabricada.";
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
});

// Funciones de navegación para imágenes regulares
const navigateRegularCarousel = (direction) => {
  if (!hasRegularImages.value) return;
  
  const length = regularImages.value.length;
  if (direction === 'next') {
    currentImageIndex.value = (currentImageIndex.value + 1) % length;
  } else {
    currentImageIndex.value = (currentImageIndex.value - 1 + length) % length;
  }
};

// Funciones de navegación para planos
const navigatePlanoCarousel = (direction) => {
  if (!hasPlanoImages.value) return;
  
  const length = planoImages.value.length;
  if (direction === 'next') {
    currentPlanoIndex.value = (currentPlanoIndex.value + 1) % length;
  } else {
    currentPlanoIndex.value = (currentPlanoIndex.value - 1 + length) % length;
  }
};

const prevImage = () => navigateRegularCarousel('prev');
const nextImage = () => navigateRegularCarousel('next');
const prevPlano = () => navigatePlanoCarousel('prev');
const nextPlano = () => navigatePlanoCarousel('next');

// Mejorado el manejo táctil para ambos carruseles
const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX;
};

const handleTouchEnd = (event, isPlano = false) => {
  touchEndX.value = event.changedTouches[0].clientX;
  const swipeDistance = touchEndX.value - touchStartX.value;
  
  if (Math.abs(swipeDistance) > 50) {
    if (isPlano) {
      if (swipeDistance > 0) {
        prevPlano();
      } else {
        nextPlano();
      }
    } else {
      if (swipeDistance > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }
  }
};

const openLightbox = (index, isPlano = false) => {
  if (isPlano && hasPlanoImages.value) {
    currentPlanoIndex.value = index;
    isPlanoLightbox.value = true;
    lightboxOpen.value = true;
  } else if (!isPlano && hasRegularImages.value) {
    currentImageIndex.value = index;
    isPlanoLightbox.value = false;
    lightboxOpen.value = true;
  }
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  isPlanoLightbox.value = false;
  document.body.style.overflow = '';
};

const lightboxNext = () => {
  if (isPlanoLightbox.value) {
    nextPlano();
  } else {
    nextImage();
  }
};

const getFeatureIcon = (clave) => {
  const iconMap = {
    'Dormitorios': 'fas fa-bed',
    'dormitorios': 'fas fa-bed',
    'Baños': 'fas fa-bath',
    'baños': 'fas fa-bath',
    'Cocina': 'fas fa-utensils',
    'cocina': 'fas fa-utensils',
    'Sala': 'fas fa-couch',
    'sala': 'fas fa-couch',
    'Living': 'fas fa-couch',
    'Living-Comedor': 'fas fa-couch',
    'living': 'fas fa-couch',
    'Sala de estar': 'fas fa-couch',
    'sala de estar': 'fas fa-couch',
    'Comedor': 'fas fa-chair',
    'comedor': 'fas fa-chair',
    'Eficiencia energética': 'fas fa-leaf',
    'Materiales': 'fas fa-hard-hat',
    'materiales': 'fas fa-hard-hat',
    'Material': 'fas fa-hard-hat',
    'material': 'fas fa-hard-hat',
    'Diseño': 'fas fa-pencil-ruler',
    'Bodega' : 'fas fa-warehouse',
    'bodega' : 'fas fa-warehouse'
  };
  return iconMap[clave] || 'fas fa-check';
};

const goBack = () => {
    router.go(-1);
};

</script>

<template>
  <div class="prefabricada-details">
      <!-- Header -->
      <header class="detail-header">
            <div class="container">
                <nav class="breadcrumb-nav">
                    <button class="back-button" @click="goBack">
                        <span class="back-icon">←</span>
                        <span>Volver</span>
                    </button>
                </nav>
            </div>
      </header>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <i class="fas fa-circle-notch fa-spin fa-3x text-primary"></i>
      <p class="mt-3">Cargando detalles...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger m-4">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>
    

    <!-- Content -->
    <div v-else-if="prefabricada" class="animate__animated animate__fadeIn">
      <!-- Hero Section -->
      <section class="hero-section py-5 bg-light">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-4 fw-bold text-info mb-3">
                {{ prefabricada.nombre_prefabricada }}
              </h1>
              <p class="lead mb-4 animate__animated animate__fadeInLeft animate__delay-1s">
                {{ prefabricada.eslogan }}
              </p>
              <div class="d-flex align-items-center mb-4">
                <i class="fas fa-ruler-combined fa-2x text-info me-3"></i>
                <div>
                  <h5 class="mb-0">Espacio</h5>
                  <p class="mb-0">{{ prefabricada.m2 }} m2</p>
                </div>
              </div>
              <div class="d-flex align-items-center mb-4">
                <i class="fas fa-shield-alt fa-2x text-info me-3"></i>
                <div>
                  <h5 class="mb-0">Garantía</h5>
                  <p class="mb-0">{{ prefabricada.garantia }}</p>
                </div>
              </div>
              <a v-if="prefabricada.precios?.length" 
                 href="#precios" 
                 class="btn btn-info btn-lg">
                Ver Opciones de Precios
              </a>
            </div>

            <!-- Regular Images Carousel -->
            <div v-if="hasRegularImages" class="col-lg-6">
              <div id="imageCarousel" 
                   class="carousel slide shadow-lg rounded" 
                   @touchstart="handleTouchStart"
                   @touchend="handleTouchEnd">
                <!-- Indicators -->
                <div class="carousel-indicators">
                  <button v-for="(_, index) in regularImages"
                          :key="index"
                          type="button"
                          :class="{ active: index === currentImageIndex }"
                          :aria-current="index === currentImageIndex"
                          @click="currentImageIndex = index">
                  </button>
                </div>

                <!-- Carousel Items -->
                <div class="carousel-inner">
                  <div v-for="(imagen, index) in regularImages" 
                       :key="index"
                       class="carousel-item"
                       :class="{ active: currentImageIndex === index }">
                    <img :src="imagen.image" 
                         :alt="`Vista ${index + 1}`"
                         class="d-block w-100"
                         @error="handleImageError"
                         @click="openLightbox(index)">
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <button class="carousel-control-prev" @click.prevent="prevImage">
                  <span class="carousel-control-prev-icon"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" @click.prevent="nextImage">
                  <span class="carousel-control-next-icon"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

       <!-- Description Section with Planos Carousel -->
       <section v-if="prefabricada.descripcion?.trim()" class="py-5 bg-white">
        <div class="container">
          <div class="row">
            <div class="col-lg-6">
              <h2 class="mb-4 fw-bold text-info">Descripción</h2>
              <p class="text-muted">{{ prefabricada.descripcion }}</p>
            </div>
            
            <!-- Planos Carousel -->
            <div v-if="hasPlanoImages" class="col-lg-6">
              <h2 class="mb-4 fw-bold text-info">Planos</h2>
              <div id="planosCarousel" 
                   class="carousel slide" 
                   @touchstart="handleTouchStart"
                   @touchend="(e) => handleTouchEnd(e, true)">
                <!-- Indicators -->
                <div class="carousel-indicators">
                  <button v-for="(_, index) in planoImages"
                          :key="index"
                          type="button"
                          :class="{ active: index === currentPlanoIndex }"
                          :aria-current="index === currentPlanoIndex"
                          @click="currentPlanoIndex = index">
                  </button>
                </div>

                <!-- Carousel Items -->
                <div class="carousel-inner">
                  <div v-for="(plano, index) in planoImages" 
                       :key="index"
                       class="carousel-item"
                       :class="{ active: currentPlanoIndex === index }">
                    <img :src="plano.image" 
                         :alt="`Plano ${index + 1}`"
                         class="d-block w-100"
                         @error="handleImageError"
                         @click="openLightbox(index, true)">
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <button class="carousel-control-prev" @click.prevent="prevPlano">
                  <span class="carousel-control-prev-icon"></span>
                  <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" @click.prevent="nextPlano">
                  <span class="carousel-control-next-icon"></span>
                  <span class="visually-hidden">Siguiente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section v-if="prefabricada.caracteristicas?.length" class="features-section py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-5 fw-bold text-info">Características Destacadas</h2>
          <div class="row row-cols-2 row-cols-md-3 g-4">
            <div v-for="(caracteristica, index) in prefabricada.caracteristicas" 
                :key="index"
                class="col">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                  <div class="feature-icon mb-3">
                    <i :class="getFeatureIcon(caracteristica.clave)" class="fa-2x text-info"></i>
                  </div>
                  <h5 class="card-title">{{ caracteristica.clave }}</h5>
                  <p class="card-text">{{ caracteristica.valor }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



    <!-- Pricing Section -->
  <section v-if="prefabricada.precios?.length"
           id="precios" 
           class="pricing-section py-5">
    <div class="container">
      <h2 class="text-center mb-5 fw-bold section-title">Precios Disponibles</h2>
      <div class="pricing-cards">
        <div v-for="precio in prefabricada.precios" 
             :key="precio.id" 
             class="pricing-card-wrapper mb-4">
          <div class="card h-100 pricing-card">
            <div class="card-header text-center py-4">
              <h3 class="card-title mb-0">{{ precio.nombre_precio }}</h3>
            </div>
            <div class="card-body d-flex flex-column">
              <div class="price-container mb-4">
                <span class="period">Desde: </span>
                <span class="currency">$</span>
                <span class="price">{{ Math.floor(precio.valor_prefabricada).toLocaleString() }}</span>
              </div>
              <p class="text-center mb-4">{{ precio.descripcion_precio }}</p>
              <ul v-if="precio.incluyes?.length" class="list-unstyled mb-4 flex-grow-1">
                <li v-for="incluye in precio.incluyes" 
                    :key="incluye.id" 
                    class="mb-3">
                  <i class="fas fa-circle me-2 text-dark"></i>
                  {{ incluye.nombre_incluye }}
                </li>
              </ul>
            </div>
            <div class="accordion mt-4" :id="'accordion-' + precio.id">
              <div class="accordion-item" v-if="precio.adicionales?.length">
                <h2 class="accordion-header" :id="'heading-' + precio.id">
                  <button 
                    class="accordion-button collapsed w-100 text-left"
                    type="button" 
                    @click="toggleAccordion(precio.id)"
                    :aria-expanded="isAccordionOpen(precio.id)"
                    :aria-controls="'collapse-' + precio.id">
                    <i class="fas fa-plus-circle me-2"></i>
                    Adicionales que puedes agregar
                  </button>
                </h2>
                <div 
                  :id="'collapse-' + precio.id" 
                  class="accordion-collapse collapse"
                  :class="{ 'show': isAccordionOpen(precio.id) }"
                  :aria-labelledby="'heading-' + precio.id">
                  <div class="accordion-body">
                    <div v-for="adicional in precio.adicionales" 
                         :key="adicional.id"
                         class="adicional-item d-flex justify-content-between align-items-center">
                      <span>{{ adicional.nombre_adicional }}</span>
                      <span class="fw-bold text-success">${{ adicional.valor_adicional.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

      <!-- Contact Section -->
      <EjecutivosVentas />

        <!-- Footer Banner Section -->
  <section class="footer-banner">
        <div class="banner-overlay">
          <h2 class="banner-text animate__animated animate__fadeIn animate__delay-1s">
            Casas Charlotte
          </h2>
        </div>
    </section>


      <!-- Lightbox -->
      <Transition name="fade">
    <div v-if="lightboxOpen" 
         class="lightbox"
         @click="closeLightbox"
         @touchstart="handleTouchStart"
         @touchend="(e) => handleTouchEnd(e, isPlanoLightbox)">
      <button class="close-button" @click.stop="closeLightbox">
        <i class="fas fa-times"></i>
      </button>
      <button class="nav-button prev" @click.stop="lightboxPrev">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="nav-button next" @click.stop="lightboxNext">
        <i class="fas fa-chevron-right"></i>
      </button>
      <img :src="isPlanoLightbox ? currentPlanoImage : currentRegularImage"
           :alt="`Vista ampliada ${isPlanoLightbox ? 'plano' : 'imagen'}`"
           class="lightbox-image"
           @error="handleImageError">
    </div>
  </Transition>
    </div>
  </div>

</template>

<style scoped>
.prefabricada-details {
  font-family: 'Arial', sans-serif;
}

.hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.pricing-section {
  background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 123, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.close-button,
.nav-button {
  position: absolute;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 1rem;
  z-index: 1001;
}

.close-button:hover,
.nav-button:hover {
  color: #007bff;
}

.close-button {
  top: 20px;
  right: 20px;
}

.nav-button {
  top: 50%;
  transform: translateY(-50%);
}

.prev { left: 20px; }
.next { right: 20px; }

.carousel {
  touch-action: pan-y pinch-zoom;
}

.carousel-indicators {
  margin-bottom: 0;
  bottom: -2.5rem;
}

.carousel-indicators button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #dee2e6;
  opacity: 0.5;
  transition: all 0.3s ease;
  margin: 0 5px;
  border: none;
}

.carousel-indicators button.active {
  background-color: #007bff;
  opacity: 1;
  transform: scale(1.2);
}

/* Add styles for planos carousel */
#planosCarousel {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

#planosCarousel .carousel-inner {
  border-radius: 8px;
}

#planosCarousel img {
  max-height: 400px;
  object-fit: contain;
  background-color: white;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* seccion de precios */

/* Updated styles for pricing section */
.pricing-section {
  background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
  padding: 4rem 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
}

.pricing-cards {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pricing-card-wrapper {
  width: 100%;
  max-width: 800px;
}

.pricing-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.pricing-card .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  padding: 1.5rem;
}

.pricing-card .card-title {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.pricing-card .card-body {
  padding: 2rem;
}

.price-container {
  text-align: center;
  color: #097b7a;
}

.currency {
  font-size: 1.5rem;
  font-weight: 600;
  vertical-align: top;
  line-height: 1;
}

.price {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}

.period {
  font-size: 1rem;
  color: #666;
}

.pricing-card ul li {
  color: #555;
  font-size: 1rem;
}

/* Accordion styles */
.accordion-item {
  border: none;
  margin-bottom: 0.5rem;
}

.accordion-button {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0c63e4;
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: rgba(0,0,0,.125);
}

.accordion-button::after {
  background-size: 1rem;
  transition: transform 0.3s ease;
}

.accordion-button:not(.collapsed)::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%230c63e4'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
  transform: rotate(-180deg);
}

.accordion-body {
  background-color: #ffffff;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 1rem 1.25rem;
}

.adicional-item {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;
}

.adicional-item:hover {
  background-color: #e9ecef;
}

.adicional-item .fw-bold {
  font-size: 0.9rem;
}


@media (max-width: 991px) {
  .pricing-card-wrapper {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    text-align: center;
  }

  .hero-section .btn {
    width: 100%;
    margin-top: 2rem;
  }

  .carousel {
    margin-top: 2rem;
  }

  .nav-button {
    font-size: 1.5rem;
    padding: 0.5rem;
  }

  .lightbox-image {
    max-width: 95%;
    max-height: 95%;
  }

  .section-title {
    font-size: 2rem;
  }
  
  .pricing-card .card-body {
    padding: 1.5rem;
  }
  
  .price {
    font-size: 2.5rem;
  }
}

/* footer banner final */
.footer-banner {
  position: relative;
  width: 100%;
  height: 300px;
  background-image: url('/img/casas_charlotte_3.jpg'); /* Replace with your image path */
  background-size: cover;
  background-position: center;
  margin-top: 4rem;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-text {
  color: white;
  font-size: 3.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .footer-banner {
    height: 200px;
  }
  
  .banner-text {
    font-size: 2.5rem;
  }
}

/* Header Styles */
.detail-header {
    background: white;
    padding: 1.5rem 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.breadcrumb-nav {
    display: flex;
    align-items: center;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    color: #4a5568;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.back-button:hover {
    color: #2d3748;
    transform: translateX(-4px);
}

.back-icon {
    font-size: 1.2rem;
}
</style>