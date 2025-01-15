<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import { Carousel } from 'bootstrap'

const images = ref([])
const loading = ref(true)
const error = ref(null)
let carouselInstance = null

const fetchImages = async () => {
    try {
        const response = await axios.get('/empresas/1/portadas/')
        images.value = response.data.portadas
    } catch (err) {
        console.error('Error al obtener las imágenes:', err)
        error.value = 'Hubo un error al cargar las imágenes. Por favor, intenta de nuevo más tarde.'
    } finally {
        loading.value = false
    }
}

const initCarousel = () => {
    const carouselElement = document.getElementById('mainCarousel')
    if (carouselElement) {
        carouselInstance?.dispose()
        carouselInstance = new Carousel(carouselElement, {
            interval: 5000,
            wrap: true,
            fade: true,
            pause: 'hover'
        })
    }
}

const handleImageClick = (link) => {
    if (link) {
        window.location.href = link
    }
}

// Función para manejar el lazy loading
const handleImageLoad = (event) => {
    event.target.classList.add('loaded')
}

onMounted(() => {
    fetchImages()
    window.addEventListener('resize', initCarousel)
})

watch(images, () => {
    if (images.value.length > 0) {
        nextTick(initCarousel)
    }
})
</script>

<template>
    <div class="carousel-container">
        <div v-if="loading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
        
        <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
        </div>
        
        <div v-else-if="images.length > 0" 
             id="mainCarousel" 
             class="carousel slide carousel-fade" 
             data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button 
                    v-for="(img, index) in images" 
                    :key="'indicator-' + img.id" 
                    type="button"
                    :data-bs-target="'#mainCarousel'" 
                    :data-bs-slide-to="index" 
                    :class="{ active: index === 0 }"
                    :aria-current="index === 0" 
                    :aria-label="'Slide ' + (index + 1)">
                </button>
            </div>
            
            <div class="carousel-inner">
                <div 
                    v-for="(img, index) in images" 
                    :key="img.id" 
                    class="carousel-item"
                    :class="{ active: index === 0, 'cursor-pointer': img.link }"
                    @click="handleImageClick(img.link)"
                >
                    <img 
                        :src="img.image"
                        class="d-block w-100" 
                        :alt="img.alt || img.nombre_portada"
                        @error="img.error = true"
                        @load="handleImageLoad"
                        loading="lazy"
                    >
                    
                    <div 
                        v-if="!img.error" 
                        class="carousel-caption"
                    >
                        <!-- <h5>{{ img.nombre_portada }}</h5>
                        <p v-if="img.link" class="link-hint">
                            Click para más información
                            <span class="arrow">→</span>
                        </p> -->
                    </div>
                    <div 
                        v-else 
                        class="carousel-caption"
                    >
                        <h5>Error al cargar la imagen</h5>
                    </div>
                </div>
            </div>
            
            <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
            </button>
        </div>
        
        <div v-else class="alert alert-info" role="alert">
            No hay imágenes disponibles para mostrar.
        </div>
    </div>
</template>

<style scoped>
.carousel-container {
    width: 100%;
    max-width: 100vw;
    position: relative;
    overflow: hidden;
}

.carousel-item {
    position: relative;
    width: 100%;
    height: calc(100vw * 9 / 16); /* Aspect ratio 16:9 */
    background-color: #f8f9fa;
}

.carousel-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.carousel-item img.loaded {
    opacity: 1;
}

.cursor-pointer {
    cursor: pointer;
}

.carousel-caption {
    background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
    left: 0;
    right: 0;
    bottom: 0;
    padding: 2rem;
    text-align: left;
}

.link-hint {
    font-size: 0.9rem;
    margin-top: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.arrow {
    transition: transform 0.3s ease;
}

.cursor-pointer:hover .arrow {
    transform: translateX(5px);
}

/* Controles del carrusel */
.carousel-control-prev,
.carousel-control-next {
    width: 10%;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.carousel-container:hover .carousel-control-prev,
.carousel-container:hover .carousel-control-next {
    opacity: 0.8;
}

/* Indicadores */
.carousel-indicators {
    margin-bottom: 2rem;
}

.carousel-indicators button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0 5px;
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
}

.carousel-indicators button.active {
    background-color: white;
}

/* Animación de fade */
.carousel-fade .carousel-item {
    opacity: 0;
    transition: opacity 0.6s ease-in-out;
}

.carousel-fade .carousel-item.active {
    opacity: 1;
}
</style>


