<template>
    <section class="separator-section">
      <div class="wave-container">
        <!-- Onda superior -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="wave">
          <path
            fill="#ffffff"
            fill-opacity="1"
            d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,96C672,139,768,213,864,218.7C960,224,1056,160,1152,122.7C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div class="separator-content">
        <h3 class="text-center">¡Haz realidad tu sueño de casa propia!</h3>
        <p class="text-center">Elige calidad, rapidez y diseño en un solo lugar.</p>
      </div>
      <div class="wave-container reverse">
        <!-- Onda inferior -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="wave">
          <path
            fill="#ffffff"
            fill-opacity="1"
            d="M0,160L48,154.7C96,149,192,139,288,128C384,117,480,107,576,122.7C672,139,768,181,864,165.3C960,149,1056,75,1152,64C1248,53,1344,107,1392,133.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  </template>
  
  <script setup>
  // Este componente no necesita lógica adicional, solo sirve como separador visual
  </script>
  
  <style scoped>
  .separator-section {
    position: relative;
    background-color: var(--primary-color, #31ca71);
    color: #ffffff;
    text-align: center;
    padding: 40px 20px;
    overflow: hidden;
  }
  
  .wave-container {
    position: absolute;
    width: 100%;
    height: 100px;
    top: -50px;
    left: 0;
  }
  
  .wave-container.reverse {
    top: auto;
    bottom: -50px;
  }
  
  .wave {
    width: 100%;
    height: 100px;
  }
  
  .separator-content {
    position: relative;
    z-index: 1;
  }
  
  .separator-content h3 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  
  .separator-content p {
    font-size: 1rem;
    margin: 0;
  }
  </style>
  