<template>
    <div class="testimonials-section bg-dark text-white py-5">
      <div class="container">
        <h2 class="text-center animate__animated animate__fadeIn section-title">
          <i class="fas fa-award text-primary me-2"></i>
          Clientes Satisfechos
        </h2>
  
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div v-for="(testimonial, index) in testimonials" 
                     :key="index"
                     class="carousel-item animate__animated animate__fadeIn"
                     :class="{ active: index === activeSlide }">
                  <div class="card bg-dark-subtle border-0 shadow-lg">
                    <div class="card-body text-center p-5">
                      <div class="mb-4">
                        <img :src="testimonial.avatar" 
                             :alt="'Cliente ' + (index + 1)"
                             class="rounded-circle border border-3 border-primary mb-3"
                             style="width: 100px; height: 100px; object-fit: cover;">
                        <div class="ratings mb-2">
                          <i v-for="star in 5" 
                             :key="star"
                             class="fas fa-star"
                             :class="star <= testimonial.rating ? 'text-warning' : 'text-muted'">
                          </i>
                        </div>
                      </div>
                      <p class="testimonial-text mb-4">{{ testimonial.comment }}</p>
                      <h5 class="client-name mb-1">{{ testimonial.name }}</h5>
                      <!-- <small class="text-muted">{{ testimonial.date }}</small> -->
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="carousel-controls mt-4">
                <button class="carousel-control-prev" type="button" @click="prevSlide">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-control-next" type="button" @click="nextSlide">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import 'animate.css'
  
  const testimonials = ref([
    {
      name: 'Cliente Satisfecho',
      avatar: '/img/logo_casas_charlotte.png',
      rating: 5,
      comment: 'Excelente calidad en los paneles, totalmente recomendables. La diferencia es notable.',
    //   date: 'Enero 2025'
    },
    {
      name: 'Cliente Verificado',
      avatar: '/img/logo_casas_charlotte.png',
      rating: 5,
      comment: 'Muchas gracias, todos nos calzó al 100% muy bueno todo, nos cuadró bien, los recomendaré al 100%.',
    //   date: 'Enero 2025'
    },
    {
      name: 'Cliente Feliz',
      avatar: '/img/logo_casas_charlotte.png',
      rating: 5,
      comment: '¡Sí!, gracias todo perfecto. Las costaneras le alcanzaron bien.',
    //   date: 'Enero 2025'
    }
  ])
  
  const activeSlide = ref(0)
  const autoplayInterval = ref(null)
  
  const nextSlide = () => {
    activeSlide.value = (activeSlide.value + 1) % testimonials.value.length
  }
  
  const prevSlide = () => {
    activeSlide.value = (activeSlide.value - 1 + testimonials.value.length) % testimonials.value.length
  }
  
  const startAutoplay = () => {
    autoplayInterval.value = setInterval(nextSlide, 5000)
  }
  
  const stopAutoplay = () => {
    if (autoplayInterval.value) {
      clearInterval(autoplayInterval.value)
    }
  }
  
  onMounted(() => {
    startAutoplay()
  })
  
  </script>
  
  <style scoped>
 
 .section-title {
  font-size: 2.5rem;
  font-weight: 700;
  /* color: #0056b3; */
  color: lightblue;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
 }  

  .testimonials-section {
    background: linear-gradient(145deg, #1a1a1a 0%, #2c3e50 100%);
  }
  
  .card {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease;
  }
  
  .card:hover {
    transform: translateY(-5px);
  }
  
  .testimonial-text {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #e2e2e2;
  }
  
  .carousel-control-prev,
  .carousel-control-next {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border: none;
    color: white;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .carousel-control-prev {
    left: -50px;
  }
  
  .carousel-control-next {
    right: -50px;
  }
  
  .carousel-control-prev:hover,
  .carousel-control-next:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    .carousel-control-prev,
    .carousel-control-next {
      display: none;
    }
  }
  </style>