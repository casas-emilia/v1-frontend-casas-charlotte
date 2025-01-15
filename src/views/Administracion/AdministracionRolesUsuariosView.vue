<template>
    <div class="container-fluid mt-4">
      <h1 class="mb-4 text-center">Gestión de Roles de Usuarios</h1>
  
      <!-- Role selection -->
      <div class="mb-4">
        <label for="roleSelect" class="form-label">Seleccionar Rol:</label>
        <select id="roleSelect" v-model="selectedRoleId" class="form-select" @change="fetchUsersForRole">
          <option value="">Seleccione un rol</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.nombre_rol }}
          </option>
        </select>
      </div>
  
      <!-- Users with selected role -->
      <div v-if="selectedRoleId" class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Usuarios con el Rol: {{ selectedRoleName }}</h5>
          <button @click="openAssignRoleModal" class="btn btn-primary btn-sm">
            <i class="fas fa-plus"></i> Asignar Rol a Usuario
          </button>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in usersWithRole" :key="user.id" class="animate__animated animate__fadeIn">
                  <td>{{ user.id }}</td>
                  <td>{{ user.primer_nombre }} {{ user.segundo_nombre }}</td>
                  <td>{{ user.primer_apellido }} {{ user.segundo_apellido }}</td>
                  <td>
                    <button @click="removeRoleFromUser(user.id)" class="btn btn-danger btn-sm">
                      <i class="fas fa-trash"></i> Quitar Rol
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Assign Role Modal -->
      <div class="modal fade" id="assignRoleModal" tabindex="-1" aria-labelledby="assignRoleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="assignRoleModalLabel">Asignar Rol a Usuario</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="assignRoleToUser">
                <div class="mb-3">
                  <label for="userSelect" class="form-label">Seleccionar Usuario:</label>
                  <select id="userSelect" v-model="selectedUserId" class="form-select" required>
                    <option value="">Seleccione un usuario</option>
                    <option v-for="user in usersWithoutRole" :key="user.id" :value="user.id">
                      {{ user.primer_nombre }} {{ user.primer_apellido }}
                    </option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Asignar Rol</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import Swal from 'sweetalert2'
  
  export default {
    setup() {
      const roles = ref([])
      const users = ref([])
      const usersWithRole = ref([])
      const selectedRoleId = ref('')
      const selectedUserId = ref('')
      const assignRoleModal = ref(null)
  
      const baseURL = 'http://localhost:8080/administracion'
      // const baseURL = 'https://v1backendcasasamilia-production.up.railway.app/administracion'
      const empresaId = 1 // Assuming we're working with empresa ID 1
  
      onMounted(async () => {
        await fetchRoles()
        await fetchUsers()
        assignRoleModal.value = new bootstrap.Modal(document.getElementById('assignRoleModal'))
      })
  
      const fetchRoles = async () => {
        try {
          const response = await axios.get(`${baseURL}/roles/`);

          // Verifica si la respuesta tiene roles
          if (response.data.roles && response.data.roles.length > 0) {
            roles.value = response.data.roles;
          } else {
            roles.value = []; // Si no hay roles, asegura un array vacío
          }
        } catch (error) {
          console.error('Error fetching roles:', error);
          Swal.fire('Error', 'Ocurrió un problema al intentar cargar los roles', 'error');
        }
      };

      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${baseURL}/empresas/${empresaId}/usuarios/`);

          // Verifica si la respuesta tiene usuarios
          if (response.data.usuarios && response.data.usuarios.length > 0) {
            users.value = response.data.usuarios;
          } else {
            users.value = []; // Si no hay usuarios, asegura un array vacío
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          Swal.fire('Error', 'Ocurrió un problema al intentar cargar los usuarios', 'error');
        }
      };

      const fetchUsersForRole = async () => {
        if (!selectedRoleId.value) {
          usersWithRole.value = []; // Si no hay rol seleccionado, asegura un array vacío
          return;
        }

        try {
          const response = await axios.get(`${baseURL}/roles/${selectedRoleId.value}/roles_usuarios/`);

          // Verifica si la respuesta tiene usuarios para el rol
          if (response.data.roles_usuarios && response.data.roles_usuarios.length > 0) {
            const roleUsers = response.data.roles_usuarios;
            usersWithRole.value = users.value.filter(user =>
              roleUsers.some(roleUser => roleUser.usuario_id === user.id)
            );
          } else {
            usersWithRole.value = []; // Si no hay usuarios para el rol, asegura un array vacío
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Si el backend devuelve un 404, significa que no hay usuarios para ese rol
            console.warn(`No se encontraron usuarios para el rol ID ${selectedRoleId.value}`);
            usersWithRole.value = []; // Asegura un array vacío en este caso
          } else {
            // Manejo de otros errores
            console.error('Error fetching users for role:', error);
            Swal.fire('Error', 'Ocurrió un problema al intentar cargar los usuarios para este rol', 'error');
          }
        }
      };


  
      const openAssignRoleModal = () => {
        selectedUserId.value = ''
        assignRoleModal.value.show()
      }
  
      const assignRoleToUser = async () => {
        try {
          await axios.post(`${baseURL}/roles/${selectedRoleId.value}/roles_usuarios/`, {
            usuario_id: selectedUserId.value
          });
          Swal.fire('Éxito', 'Rol asignado correctamente', 'success');
          assignRoleModal.value.hide();
          await fetchUsersForRole();
        } catch (error) {
          console.error('Error assigning role:', error);

          // Manejo de error 403
          if (error.response && error.response.status === 403) {
            Swal.fire('Error', error.response.data.error || 'No tienes permisos suficientes para asignar el rol.', 'error');
          } else {
            // Manejo de otros errores
            Swal.fire('Error', error.response?.data?.message || error.message || 'No se pudo asignar el rol', 'error');
          }
        }
    };

  
const removeRoleFromUser = async (userId) => {
  try {
    const roleUser = (await axios.get(`${baseURL}/roles/${selectedRoleId.value}/roles_usuarios/`)).data.roles_usuarios
      .find(ru => ru.usuario_id === userId);

    if (roleUser) {
      await axios.delete(`${baseURL}/roles/${selectedRoleId.value}/roles_usuarios/${roleUser.id}`);
      Swal.fire('Éxito', 'Rol removido correctamente', 'success');
      await fetchUsersForRole();
    }
  } catch (error) {
    console.error('Error removing role:', error);

    // Manejo de error 403
    if (error.response && error.response.status === 403) {
      Swal.fire('Error', error.response.data.error || 'No tienes permisos suficientes para remover el rol.', 'error');
    } else {
      // Manejo de otros errores
      Swal.fire('Error', error.response?.data?.message || error.message || 'No se pudo remover el rol', 'error');
    }
  }
};

  
      const selectedRoleName = computed(() => {
        const role = roles.value.find(r => r.id === selectedRoleId.value)
        return role ? role.nombre_rol : ''
      })
  
      const usersWithoutRole = computed(() => {
        return users.value.filter(user => 
          !usersWithRole.value.some(roleUser => roleUser.id === user.id)
        )
      })
  
      return {
        roles,
        usersWithRole,
        selectedRoleId,
        selectedUserId,
        selectedRoleName,
        usersWithoutRole,
        fetchUsersForRole,
        openAssignRoleModal,
        assignRoleToUser,
        removeRoleFromUser
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