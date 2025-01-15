<template>
    <div class="container-fluid mt-4">
      <h1 class="mb-4 text-center">Gestión de Servicios</h1>
  
      <!-- Form for creating/updating service -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-6">
          <form @submit.prevent="handleSubmit" class="p-4 border rounded shadow-sm">
            <h3 class="mb-3">{{ editingServicio ? 'Editar' : 'Crear' }} Servicio</h3>
            <div class="mb-3">
              <label for="nombreServicio" class="form-label">Nombre del Servicio</label>
              <input
                v-model="formData.nombre_servicio"
                type="text"
                class="form-control"
                id="nombreServicio"
                required
              >
            </div>
            <div class="mb-3">
              <label for="descripcionServicio" class="form-label">Descripción del Servicio</label>
              <textarea
                v-model="formData.descripcion_servicio"
                class="form-control"
                id="descripcionServicio"
                rows="3"
                required
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-100">
              <i class="fas" :class="editingServicio ? 'fa-save' : 'fa-plus'"></i>
              {{ editingServicio ? 'Actualizar' : 'Crear' }} Servicio
            </button>
          </form>
        </div>
      </div>
  
      <!-- List of services -->
      <div class="row">
        <div v-for="servicio in servicios" :key="servicio.id" class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm animate__animated animate__fadeIn">
            <div class="card-body">
              <h5 class="card-title">{{ servicio.nombre_servicio }}</h5>
              <p class="card-text">{{ servicio.descripcion_servicio }}</p>
              <div class="mt-auto">
                <button @click="editServicio(servicio)" class="btn btn-warning me-2">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button @click="deleteServicio(servicio.id)" class="btn btn-danger">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
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
  const baseURL = `http://localhost:8080/administracion/empresas/${empresaId}/servicios/`;
  // const baseURL = `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/${empresaId}/servicios/`;
  
  const servicios = ref([]);
  const formData = ref({
    nombre_servicio: '',
    descripcion_servicio: ''
  });
  const editingServicio = ref(null);
  const currentPage = ref(1);
  const itemsPerPage = 12;
  const totalItems = ref(0);
  
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
  
  const fetchServicios = async (page = 1) => {
    try {
      const response = await axios.get(`${baseURL}?page=${page}&limit=${itemsPerPage}`);
      servicios.value = response.data.servicios;
      totalItems.value = response.data.total || response.data.servicios.length;
      currentPage.value = page;
    } catch (error) {
      console.error('Error fetching servicios:', error);
      Swal.fire('Error', 'No se pudieron cargar los servicios', 'error');
    }
  };
  
  const handleSubmit = async () => {
    try {
      let response;
      if (editingServicio.value) {
        response = await axios.put(`${baseURL}${editingServicio.value.id}`, formData.value);
        Swal.fire('Éxito', 'Servicio actualizado correctamente', 'success');
      } else {
        response = await axios.post(baseURL, formData.value);
        Swal.fire('Éxito', 'Servicio creado correctamente', 'success');
      }
  
      console.log('Server response:', response.data);
  
      resetForm();
      fetchServicios(currentPage.value);
    } catch (error) {
      console.error('Error submitting servicio:', error);
      let errorMessage = 'No se pudo guardar el servicio';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      Swal.fire('Error', errorMessage, 'error');
    }
  };
  
  const editServicio = (servicio) => {
    editingServicio.value = servicio;
    formData.value = {
      nombre_servicio: servicio.nombre_servicio,
      descripcion_servicio: servicio.descripcion_servicio
    };
  };
  
  const deleteServicio = async (id) => {
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
        Swal.fire('Eliminado', 'El servicio ha sido eliminado', 'success');
        fetchServicios(currentPage.value);
      }
    } catch (error) {
      console.error('Error deleting servicio:', error);
      Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
    }
  };
  
  const resetForm = () => {
    formData.value = { nombre_servicio: '', descripcion_servicio: '' };
    editingServicio.value = null;
  };
  
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      fetchServicios(page);
    }
  };
  
  onMounted(() => fetchServicios());
  </script>
  
  <style scoped>
/*   @import 'bootstrap/dist/css/bootstrap.min.css';
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  @import 'animate.css'; */
  
  .card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .btn {
    transition: all 0.3s ease;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>