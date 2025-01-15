<template>
    <div class="container-fluid mt-4">
      <h1 class="mb-4 text-center">Gestión de Redes Sociales</h1>
  
      <!-- Form for creating/updating social network -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-6">
          <form @submit.prevent="handleSubmit" class="p-4 border rounded shadow-sm">
            <h3 class="mb-3">{{ editingRed ? 'Editar' : 'Crear' }} Red Social</h3>
            <div class="mb-3">
              <label for="redSocial" class="form-label">Red Social</label>
              <input
                v-model="formData.red_social"
                type="text"
                class="form-control"
                id="redSocial"
                required
              >
            </div>
            <div class="mb-3">
              <label for="link" class="form-label">Enlace</label>
              <input
                v-model="formData.link"
                type="text"
                class="form-control"
                id="link"
                required
              >
            </div>
            <button type="submit" class="btn btn-primary w-100">
              <i class="fas" :class="editingRed ? 'fa-save' : 'fa-plus'"></i>
              {{ editingRed ? 'Actualizar' : 'Crear' }} Red Social
            </button>
          </form>
        </div>
      </div>
  
      <!-- Table of social networks -->
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>Red Social</th>
              <th>Enlace</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="red in redes" :key="red.id" class="animate__animated animate__fadeIn">
              <td>{{ red.red_social }}</td>
              <td>
                <a :href="red.link" target="_blank" rel="noopener noreferrer">{{ red.link }}</a>
              </td>
              <td>
                <button @click="editRed(red)" class="btn btn-warning btn-sm me-2">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button @click="deleteRed(red.id)" class="btn btn-danger btn-sm">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Pagination -->
      <nav v-if="totalPages > 1" aria-label="Navegación de páginas" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Anterior</a>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Siguiente</a>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  const empresaId = 1; // Assuming we're working with empresa ID 1
  const baseURL = `http://localhost:8080/administracion/empresas/${empresaId}/redes/`;
  // const baseURL = `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/${empresaId}/redes/`;
  
  const redes = ref([]);
  const formData = ref({
    red_social: '',
    link: ''
  });
  const editingRed = ref(null);
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const totalItems = ref(0);
  
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
  
  const fetchRedes = async (page = 1) => {
    try {
      const response = await axios.get(`${baseURL}?page=${page}&limit=${itemsPerPage}`);
      
      if (response.data.redes_sociales && response.data.redes_sociales.length > 0) {
        redes.value = response.data.redes_sociales;
        totalItems.value = response.data.total || response.data.redes_sociales.length;
      } else {
        // Si no hay redes sociales, asegura valores predeterminados
        redes.value = [];
        totalItems.value = 0;
      }

      currentPage.value = page;
    } catch (error) {
      console.error('Error fetching redes sociales:', error);

      // Maneja casos de error, pero no muestra el mensaje de error si las redes no existen
      if (error.response && error.response.status !== 404) {
        Swal.fire('Error', 'No se pudieron cargar las redes sociales', 'error');
      }

      // Asegura valores predeterminados en caso de cualquier error
      redes.value = [];
      totalItems.value = 0;
    }
  };

  
  const handleSubmit = async () => {
    try {
      let response;
      if (editingRed.value) {
        response = await axios.put(`${baseURL}${editingRed.value.id}`, formData.value);
        Swal.fire('Éxito', 'Red social actualizada correctamente', 'success');
      } else {
        response = await axios.post(baseURL, formData.value);
        Swal.fire('Éxito', 'Red social creada correctamente', 'success');
      }
  
      console.log('Server response:', response.data);
  
      resetForm();
      fetchRedes(currentPage.value);
    } catch (error) {
      console.error('Error submitting red social:', error);
      let errorMessage = 'No se pudo guardar la red social';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      Swal.fire('Error', errorMessage, 'error');
    }
  };
  
  const editRed = (red) => {
    editingRed.value = red;
    formData.value = {
      red_social: red.red_social,
      link: red.link
    };
  };
  
  const deleteRed = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      });
  
      if (result.isConfirmed) {
        await axios.delete(`${baseURL}${id}`);
        Swal.fire('Eliminado', 'La red social ha sido eliminada', 'success');
        fetchRedes(currentPage.value);
      }
    } catch (error) {
      console.error('Error deleting red social:', error);
      Swal.fire('Error', 'No se pudo eliminar la red social', 'error');
    }
  };
  
  const resetForm = () => {
    formData.value = { red_social: '', link: '' };
    editingRed.value = null;
  };
  
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      fetchRedes(page);
    }
  };
  
  onMounted(() => fetchRedes());
  </script>
  
  <style scoped>
/*   @import 'bootstrap/dist/css/bootstrap.min.css';
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  @import 'animate.css'; */
  
  .table {
    transition: all 0.3s ease;
  }
  
  .btn {
    transition: all 0.3s ease;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>