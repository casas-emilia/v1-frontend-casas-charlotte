<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import "animate.css";

// Datos
const features = ref([
  {
    title: "Rápida Construcción",
    description:
      "Nuestras casas se construyen en tiempo récord, ahorrándote tiempo y molestias.",
    icon: "fas fa-stopwatch",
    bgColor: "bg-primary",
    isVisible: false,
  },
  {
    title: "Eco-Friendly",
    description:
      "Utilizamos materiales sostenibles y procesos que respetan el medio ambiente.",
    icon: "fas fa-leaf",
    bgColor: "bg-success",
    isVisible: false,
  },
  {
    title: "Costo-Eficiente",
    description:
      "Obtén una casa de calidad a un precio más accesible que la construcción tradicional.",
    icon: "fas fa-piggy-bank",
    bgColor: "bg-warning",
    isVisible: false,
  },
]);

const advantages = ref([
  {
    title: "Construcción Rápida",
    description:
      "Reduce el tiempo de construcción comparado con métodos tradicionales.",
    icon: "fas fa-tachometer-alt",
    bgColor: "bg-info",
    isVisible: false,
  },
  {
    title: "Ahorro de Costos",
    description:
      "Precios más competitivos debido a la eficiencia en la producción y construcción.",
    icon: "fas fa-dollar-sign",
    bgColor: "bg-success",
    isVisible: false,
  },
  {
    title: "Sostenibilidad",
    description:
      "Menor impacto ambiental y uso más eficiente de los materiales de construcción.",
    icon: "fas fa-recycle",
    bgColor: "bg-primary",
    isVisible: false,
  },
  {
    title: "Calidad Controlada",
    description:
      "Fabricación en ambientes controlados que garantizan alta calidad y precisión.",
    icon: "fas fa-tools",
    bgColor: "bg-warning",
    isVisible: false,
  },
]);

const featureCards = ref([]);
const advantageCards = ref([]);

const observeVisibility = (cards, data) => {
  const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = cards.value.indexOf(entry.target);
        if (index !== -1) {
          data.value[index].isVisible = true;
          entry.target.classList.add("is-visible");
        }
      }
    });
  },
  { threshold: 0.8 }  // Asegúrate de que más del 80% de la tarjeta esté visible
);



  cards.value.forEach((card) => observer.observe(card));
};



onMounted(() => {
  // Establecer las tarjetas como visibles inicialmente para probar si la animación funciona
  features.value.forEach((feature, index) => {
    feature.isVisible = true;
  });
  advantages.value.forEach((advantage, index) => {
    advantage.isVisible = true;
  });
});
</script>

<template>
  <section id="caracteristicas-ventajas" class="py-5 bg-pattern">
    <div class="container position-relative">
      <!-- <h2 class="text-center mb-5 section-title"> -->
      <h2 class="text-center mb-5 section-title">
        ¿Por qué elegir nuestras casas?
      </h2>
      <div class="content-wrapper p-8">
        <div class="row g-4">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="col-md-4"
          >
            <div
              ref="featureCards[index]"
              class="feature-card text-center"
              :class="{
                'animate__animated animate__fadeInUp': feature.isVisible,
              }"
              :style="{ animationDelay: feature.isVisible ? `${index * 0.2}s` : '' }"
            >
              <div :class="['icon-wrapper', feature.bgColor]">
                <i :class="feature.icon"></i>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container position-relative py-5">
      <h2 class="text-center mb-5 section-title">
        Ventajas de las Casas Prefabricadas
      </h2>
      <div class="content-wrapper p-8">
        <div class="row g-4">
          <div
            v-for="(advantage, index) in advantages"
            :key="advantage.title"
            class="col-md-6 col-lg-3"
          >
            <div
              ref="advantageCards[index]"
              class="advantage-card text-center"
              :class="{
                'animate__animated animate__fadeInUp': advantage.isVisible,
              }"
              :style="{ animationDelay: advantage.isVisible ? `${index * 0.2}s` : '' }"
            >
              <div :class="['icon-wrapper', advantage.bgColor]">
                <i :class="advantage.icon"></i>
              </div>
              <h3>{{ advantage.title }}</h3>
              <p>{{ advantage.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
:root {
  --primary-color: #23ccc8;
  --secondary-color: #097b7a;
  --accent-color: #ef6e01;
  --text-color: #333333;
  --light-bg: #f8f9fa;
  --dark-bg: #343a40;
}
</style>

<style scoped>
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.bg-pattern {
  background: linear-gradient(
      rgba(0, 0, 0, 0.5), 
      rgba(0, 0, 0, 0.5)
    ), 
    url("/img/arboles_medio_ambiente.jpg") no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh; /* Usa min-height para garantizar que el fondo cubra toda la pantalla */
  position: relative;
}

.feature-card,
.advantage-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 30px;
  transition: all 0.3s ease;
  height: auto; /* Permite que las tarjetas tengan altura automática según el contenido */
  max-height: 100%; /* Asegura que no se desborden */
  box-shadow: 0 10px 20px rgba(9, 123, 122, 0.1);
  overflow: hidden; /* Evita que el contenido desborde fuera de la tarjeta */
  position: relative;
  opacity: 0;
  transform: translateY(50px); /* Empuja las tarjetas hacia abajo inicialmente */
}

.feature-card.is-visible,
.advantage-card.is-visible {
  opacity: 1;
  transform: translateY(0); /* Mueve las tarjetas hacia su posición original */
  transition: opacity 0.5s, transform 0.5s ease-out; /* Animación suave */
}

/* Asegura que los márgenes y el padding de las tarjetas no causen desbordamiento */
/* .content-wrapper {
  overflow: hidden;
} */

/* .container {
  position: relative;
  padding: 0 15px;
} */

.feature-card::before,
.advantage-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.2) 40%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0.2) 100%
  );
  transform: rotate(30deg);
  transition: all 0.5s ease;
  opacity: 0;
}

.feature-card:hover::before,
.advantage-card:hover::before {
  transform: rotate(0deg);
  opacity: 1;
}

.feature-card:hover,
.advantage-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(9, 123, 122, 0.2);
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 15px rgba(9, 123, 122, 0.2);
  transition: all 0.3s ease;
}

.icon-wrapper i {
  font-size: 32px;
  color: #ffffff;
  transition: all 0.3s ease;
}

.feature-card:hover .icon-wrapper,
.advantage-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.feature-card:hover .icon-wrapper i,
.advantage-card:hover .icon-wrapper i {
  transform: scale(1.2);
}

.feature-card h3,
.advantage-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.feature-card:hover h3,
.advantage-card:hover h3 {
  color: var(--primary-color);
}

.feature-card p,
.advantage-card p {
  font-size: 1rem;
  color: var(--text-color);
  line-height: 1.6;
}

/* Animación para las tarjetas cuando son visibles */
.feature-card.is-visible,
.advantage-card.is-visible {
  animation: fadeInUp 0.8s ease-in-out forwards;
}

/* Animación personalizada para fadeInUp */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .feature-card,
  .advantage-card {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 2rem;
  }
}

/* Custom background colors */
.bg-primary {
  background-color: var(--primary-color) !important;
}

.bg-success {
  background-color: var(--secondary-color) !important;
}

.bg-warning {
  background-color: var(--accent-color) !important;
}

.bg-info {
  background-color: var(--primary-color) !important;
}
</style>