<template>
    <div class="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div class="text-center animate__animated animate__fadeIn">
        <i class="fas fa-exclamation-triangle fa-5x text-warning mb-4"></i>
        <h1 class="display-4 mb-4">Acceso No Autorizado</h1>
        <p class="lead mb-5">Lo sentimos, no tienes permiso para acceder a esta página.</p>
        <button @click="volverInicio" class="btn btn-primary btn-lg animate__animated animate__pulse animate__infinite">
          <i class="fas fa-home me-2"></i>Volver al Inicio
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';
  
  const router = useRouter();
  
  const volverInicio = () => {
    router.push('/');
  };
  
  onMounted(() => {
    document.title = 'Acceso No Autorizado';
  });
  </script>
  
  <style scoped>
  .container-fluid {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 576px) {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  </style>