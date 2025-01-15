<script setup>
import { ref, onMounted, reactive } from 'vue'
import ClientesSatisfechosComponent from './ClientesSatisfechosComponent.vue';

const statistics = reactive([
  {
    number: 1000,
    displayNumber: 0,
    text: 'casas vendidas',
    icon: 'fa-home',
    suffix: '+',
  },
  {
    number: 10,
    displayNumber: 0,
    text: 'años de experiencia en el mercado inmobiliario',
    icon: 'fa-calendar-alt',
    prefix: 'Más de ',
  },
  {
    displayNumber: null,
    text: 'Felices en su nuevo hogar',
    icon: 'fa-users',
    prefix: 'Y muchos ',
    showHeart: true,
  }
])

const statCards = ref([])

const animateValue = (obj, start, end, duration) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.displayNumber = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const handleIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const index = statCards.value.indexOf(entry.target);
      if (index !== -1 && statistics[index].number !== undefined) {
        animateValue(statistics[index], 0, statistics[index].number, 2000);
      }
      observer.unobserve(entry.target);
    }
  });
}

onMounted(() => {
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.1
  });

  statCards.value.forEach((card) => {
    observer.observe(card);
  });
})
</script>

<template>
  <section class="statistics-section py-5">
    <div class="container">
      <h2 class="section-title">Nuestros Números</h2>
      <div class="row g-4">
        <div v-for="(stat, index) in statistics" 
             :key="index" 
             class="col-md-4">
          <div ref="statCards"
               class="stat-card"
               :style="{ animationDelay: `${index * 0.2}s` }">
            <div class="card-content">
              <i :class="['stat-icon fas', stat.icon]"></i>
              <h3 class="stat-title">
                <span v-if="stat.prefix">{{ stat.prefix }}</span>
                <span v-if="stat.showHeart" class="heart-icon">❤️</span>
                <span v-if="stat.displayNumber !== null" 
                      class="number">{{ stat.displayNumber }}</span>
                <span v-if="stat.suffix">{{ stat.suffix }}</span>
              </h3>
              <p class="stat-text">{{ stat.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section>
    <ClientesSatisfechosComponent />
  </section>
</template>

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

.statistics-section {
  background: linear-gradient(210deg, #1a1a1a 0%, #2c3e50 100%);
  color: white;
  padding: 4rem 0;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.stat-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.card-content {
  text-align: center;
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #4299e1, #667eea);
  -webkit-background-clip: text; /* Para navegadores basados en WebKit */
  background-clip: text; /* Propiedad estándar */
  -webkit-text-fill-color: transparent; /* Hace que solo se muestre el gradiente */
  display: inline-block;
}

.stat-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff, #e2e8f0);
  -webkit-background-clip: text; /* Para navegadores basados en WebKit */
  background-clip: text; /* Propiedad estándar */
  -webkit-text-fill-color: transparent; /* Hace que solo se muestre el gradiente */
}

.number {
  font-family: 'Arial', sans-serif;
  font-weight: 800;
}

.stat-text {
  font-size: 1.1rem;
  color: #e2e8f0;
  margin: 0;
  line-height: 1.6;
}

.heart-icon {
  font-size: 2.5rem;
  color: red !important; /* Forzar el color */
  background: none !important; /* Eliminar cualquier fondo heredado */
  -webkit-text-fill-color: initial !important; /* Evitar estilos que afecten al relleno */
  visibility: visible !important; /* Asegurar que sea visible */
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .stat-title {
    font-size: 2rem;
  }
  
  .stat-text {
    font-size: 1rem;
  }
  
  .stat-icon {
    font-size: 2.5rem;
  }
}
</style>