<template>
    <div class="container-fluid mt-4">
      <h1 class="mb-4 text-center">Gestión de Roles</h1>
  
      <!-- Button to open create role modal -->
      <div class="mb-3">
        <button @click="openCreateModal" class="btn btn-primary">
          <i class="fas fa-plus"></i> Crear Nuevo Rol
        </button>
      </div>
  
      <!-- Roles Table -->
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
              <th>Descripción</th>
              <th>Fecha de Creación</th>
              <th>Última Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id" class="animate__animated animate__fadeIn">
              <td>{{ role.id }}</td>
              <td>{{ role.nombre_rol }}</td>
              <td>{{ role.descripcion_rol }}</td>
              <td>{{ formatDate(role.created_at) }}</td>
              <td>{{ formatDate(role.updated_at) }}</td>
              <td>
                <button @click="openEditModal(role)" class="btn btn-warning btn-sm me-2">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button @click="deleteRole(role.id)" class="btn btn-danger btn-sm">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Create/Edit Role Modal -->
      <div class="modal fade" id="roleModal" tabindex="-1" aria-labelledby="roleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="roleModalLabel">{{ isEditing ? 'Editar Rol' : 'Crear Nuevo Rol' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitRole">
                <div class="mb-3">
                  <label for="nombreRol" class="form-label">Nombre del Rol</label>
                  <input v-model="currentRole.nombre_rol" type="text" class="form-control" id="nombreRol" required>
                </div>
                <div class="mb-3">
                  <label for="descripcionRol" class="form-label">Descripción del Rol</label>
                  <textarea v-model="currentRole.descripcion_rol" class="form-control" id="descripcionRol" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import Swal from 'sweetalert2'
  
  export default {
    setup() {
      const roles = ref([])
      const currentRole = ref({ nombre_rol: '', descripcion_rol: '' })
      const isEditing = ref(false)
      const roleModal = ref(null)
  
      const baseURL = 'http://localhost:8080/administracion/roles'
      // const baseURL = 'https://v1backendcasasamilia-production.up.railway.app/administracion/roles'
  
      onMounted(() => {
        fetchRoles()
        roleModal.value = new bootstrap.Modal(document.getElementById('roleModal'))
      })
  
      const fetchRoles = async () => {
        try {
          const response = await axios.get(`${baseURL}/`)
          roles.value = response.data.roles
        } catch (error) {
          console.error('Error fetching roles:', error)
          Swal.fire('Error', 'No se pudieron cargar los roles', 'error')
        }
      }
  
      const openCreateModal = () => {
        isEditing.value = false
        currentRole.value = { nombre_rol: '', descripcion_rol: '' }
        roleModal.value.show()
      }
  
      const openEditModal = (role) => {
        isEditing.value = true
        currentRole.value = { ...role }
        roleModal.value.show()
      }
  
      const submitRole = async () => {
        try {
          if (isEditing.value) {
            await axios.put(`${baseURL}/${currentRole.value.id}`, currentRole.value);
            Swal.fire('Éxito', 'Rol actualizado correctamente', 'success');
          } else {
            await axios.post(`${baseURL}/`, currentRole.value);
            Swal.fire('Éxito', 'Rol creado correctamente', 'success');
          }
          roleModal.value.hide();
          fetchRoles();
        } catch (error) {
          console.error('Error submitting role:', error);

            // Manejo del error
            if (error.response && error.response.status === 403) {
              // Si el servidor responde con 403 (Forbidden), muestra el mensaje adecuado
              Swal.fire('Error', error.response.data.error || 'No tienes permisos suficientes para realizar esta acción.', 'error');
            } else {
              // Manejo de otros errores
              Swal.fire('Error', error.response?.data?.message || error.message || 'No se pudo guardar el rol', 'error');
            }
        }
      };

  
      const deleteRole = async (id) => {
        try {
          const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
          })
  
          if (result.isConfirmed) {
            await axios.delete(`${baseURL}/${id}`)
            Swal.fire('Eliminado', 'El rol ha sido eliminado', 'success')
            fetchRoles()
          }
        } catch (error) {
          // console.error('Error deleting role:', error)
          // Swal.fire('Error', 'No se pudo eliminar el rol', 'error')
          console.error('Error al tratar de eliminar Rol:', error);

            // Manejo del error
            if (error.response && error.response.status === 403) {
              // Si el servidor responde con 403 (Forbidden), muestra el mensaje adecuado
              Swal.fire('Error', error.response.data.error || 'No tienes permisos suficientes para realizar esta acción.', 'error');
            } else {
              // Manejo de otros errores
              Swal.fire('Error', error.response?.data?.message || error.message || 'No se pudo eliminar el rol', 'error');
            }
        }
      }
  
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        return new Date(dateString).toLocaleDateString('es-ES', options)
      }
  
      return {
        roles,
        currentRole,
        isEditing,
        openCreateModal,
        openEditModal,
        submitRole,
        deleteRole,
        formatDate
      }
    }
  }
  </script>
  
  <style scoped>
/*   @import 'bootstrap/dist/css/bootstrap.min.css';
  @import '@fortawesome/fontawesome-free/css/all.min.css';
  @import 'animate.css/animate.min.css'; */
  
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