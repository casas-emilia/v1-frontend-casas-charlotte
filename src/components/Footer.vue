<script setup>
import { ref, onMounted } from "vue";

const year = ref(new Date().getFullYear()); // Inicializamos el año actual

onMounted(async () => {
  try {
    const response = await fetch("https://worldtimeapi.org/api/ip"); // API pública
    const data = await response.json();
    year.value = new Date(data.datetime).getFullYear(); // Actualizamos el año
  } catch (error) {
    console.error("Error obteniendo el año del servidor:", error);
  }
});
</script>

<template>
  <!-- Footer -->
  <footer id="contacto" class="bg-dark text-white py-4">
    <div class="container text-center">
      <p>&copy; {{ year }} Casas prefabricadas Charlotte. Todos los derechos reservados.</p>
      <!-- Redes sociales (opcional)
      <div class="mt-3">
        <a href="#" class="text-white me-3"><i class="bi bi-facebook"></i></a>
        <a href="#" class="text-white me-3"><i class="bi bi-instagram"></i></a>
        <a href="#" class="text-white me-3"><i class="bi bi-twitter"></i></a>
        <a href="#" class="text-white"><i class="bi bi-youtube"></i></a>
      </div>
      -->
    </div>
  </footer>
</template>

<style>
.bg-dark {
  background-color: #343a40;
}

.text-white {
  color: #fff;
}

.py-4 {
  padding: 1.5rem 0;
}

.text-center {
  text-align: center;
}
</style>
