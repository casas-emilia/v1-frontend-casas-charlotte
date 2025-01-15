<template>
  <div class="container-fluid mt-4">
    <h1 class="mb-4 text-center">Gestión de Usuarios</h1>

    <!-- Users Table -->
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Usuarios</h5>
        <button @click="openUserModal()" class="btn btn-primary btn-sm">
          <i class="fas fa-plus"></i> Nuevo Usuario
        </button>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Roles Asignados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>
                  <img v-if="user.image" :src="user.image" :alt="`Imagen de ${user.primer_nombre}`" class="img-thumbnail" style="max-width: 50px;">
                </td>
                <td>{{ user.primer_nombre }} {{ user.segundo_nombre }}</td>
                <td>{{ user.primer_apellido }} {{ user.segundo_apellido }}</td>
                <td v-if="user.roles">{{ user.roles.map(role => role.nombre_rol).join(', ') }}</td>
                <td v-else class="text-danger">*Sin roles asignados</td>
                <td>
                  <button @click="viewUserDetails(user)" class="btn btn-info btn-sm me-2">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="openUserModal(user)" class="btn btn-warning btn-sm me-2">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="showUserModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userModalLabel">{{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}</h5>
            <button type="button" class="btn-close" @click="closeUserModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="primerNombre" class="form-label">Primer Nombre</label>
                <input v-model="currentUser.primer_nombre" type="text" class="form-control" id="primerNombre" required>
              </div>
              <div class="mb-3">
                <label for="segundoNombre" class="form-label">Segundo Nombre</label>
                <input v-model="currentUser.segundo_nombre" type="text" class="form-control" id="segundoNombre">
              </div>
              <div class="mb-3">
                <label for="primerApellido" class="form-label">Primer Apellido</label>
                <input v-model="currentUser.primer_apellido" type="text" class="form-control" id="primerApellido" required>
              </div>
              <div class="mb-3">
                <label for="segundoApellido" class="form-label">Segundo Apellido</label>
                <input v-model="currentUser.segundo_apellido" type="text" class="form-control" id="segundoApellido">
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Imagen de Perfil</label>
                <input type="file" class="form-control" id="image" @change="handleImageUpload" accept="image/*" required>
                <img v-if="imagePreview" :src="imagePreview" alt="Vista previa" class="mt-2 img-thumbnail" style="max-width: 200px;">
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="showUserDetailsModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="userDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userDetailsModalLabel">Detalles del Usuario</h5>
            <button type="button" class="btn-close" @click="closeUserDetailsModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h6>Información Personal</h6>
            <p><strong>Nombre:</strong> {{ currentUser.primer_nombre }} {{ currentUser.segundo_nombre }}</p>
            <p><strong>Apellido:</strong> {{ currentUser.primer_apellido }} {{ currentUser.segundo_apellido }}</p>
            <p><strong>Imagen:</strong> 
              <img v-if="currentUser.image" :src="currentUser.image" alt="User Image" class="img-thumbnail" style="max-width: 100px;">
              <span v-else>No hay imagen de perfil</span>
            </p>

            <h6 class="mt-4">Contactos</h6>
            <div v-if="contacts.length">
              <div v-for="contact in contacts" :key="contact.id" class="card mb-3">
                <div class="card-body">
                  <p><strong>Email laboral:</strong> {{ contact.email_laboral }}</p>
                  <p><strong>Celular laboral:</strong> {{ contact.celular_laboral }}</p>
                  <p><strong>Dirección laboral:</strong> {{ contact.direccion_laboral }}</p>
                  <button @click="openContactModal(contact)" class="btn btn-warning btn-sm me-2">
                    <i class="fas fa-edit"></i> Editar
                  </button>
                  <button @click="deleteContact(contact.id)" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Este usuario no tiene contactos registrados.</p>
            </div>
            <button @click="openContactModal()" class="btn btn-primary btn-sm mt-2">
              <i class="fas fa-plus"></i> Agregar Contacto
            </button>

            <h6 class="mt-4">Credenciales</h6>
            <div v-if="credentials">
              <p><strong>Email:</strong> {{ credentials.email }}</p>
              <button @click="openCredentialModal()" class="btn btn-warning btn-sm">
                <i class="fas fa-edit"></i> Editar Credenciales
              </button>
            </div>
            <div v-else>
              <p>Este usuario no tiene credenciales registradas.</p>
              <button @click="openCredentialModal()" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Agregar Credenciales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <div v-if="showContactModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="contactModalLabel">{{ isEditingContact ? 'Editar Contacto' : 'Nuevo Contacto' }}</h5>
            <button type="button" class="btn-close" @click="closeContactModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveContact">
              <div class="mb-3">
                <label for="emailLaboral" class="form-label">Email Laboral</label>
                <input v-model="currentContact.email_laboral" type="email" class="form-control" id="emailLaboral" required>
              </div>
              <div class="mb-3">
                <label for="celularLaboral" class="form-label">Celular Laboral</label>
                <input v-model="currentContact.celular_laboral" type="tel" class="form-control" id="celularLaboral" required>
              </div>
              <div class="mb-3">
                <label for="direccionLaboral" class="form-label">Dirección Laboral</label>
                <input v-model="currentContact.direccion_laboral" type="text" class="form-control" id="direccionLaboral">
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Credential Modal -->
    <div v-if="showCredentialModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="credentialModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="credentialModalLabel">{{ credentials ? 'Editar Credenciales' : 'Nuevas Credenciales' }}</h5>
            <button type="button" class="btn-close" @click="closeCredentialModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCredentials">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input v-model="currentCredentials.email" type="email" class="form-control" id="email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input v-model="currentCredentials.password" type="password" class="form-control" id="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const empresaId = 1;
const baseURL = `https://v1-backend-casas-charlotte-production.up.railway.app/administracion/empresas/${empresaId}/usuarios`;
//const baseURL = `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/${empresaId}/usuarios`;

const users = ref([]);
const contacts = ref([]);
const credentials = ref(null);
const currentUser = ref({});
const currentContact = ref({});
const currentCredentials = ref({});
const isEditing = ref(false);
const isEditingContact = ref(false);
const selectedImage = ref(null);
const imagePreview = ref('');

const showUserModal = ref(false);
const showUserDetailsModal = ref(false);
const showContactModal = ref(false);
const showCredentialModal = ref(false);

onMounted(() => {
  fetchUsers();
});

const fetchUsers = async () => {
  try {
    const response = await axios.get(`${baseURL}/`);
    users.value = response.data.usuarios;
  } catch (error) {
    console.error('Error fetching users:', error);
    showErrorAlert('No se pudieron cargar los usuarios');
  }
};

const openUserModal = (user = null) => {
  isEditing.value = !!user;
  currentUser.value = user ? { ...user } : {};
  selectedImage.value = null;
  imagePreview.value = user?.image || '';
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      showErrorAlert('La imagen es demasiado grande. El tamaño máximo es 5MB.');
      event.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showErrorAlert('El archivo seleccionado no es una imagen válida. Se permiten JPG, PNG y GIF.');
      event.target.value = '';
      return;
    }

    selectedImage.value = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveUser = async () => {
  try {
    const formData = new FormData();
    formData.append('primer_nombre', currentUser.value.primer_nombre);
    formData.append('segundo_nombre', currentUser.value.segundo_nombre);
    formData.append('primer_apellido', currentUser.value.primer_apellido);
    formData.append('segundo_apellido', currentUser.value.segundo_apellido);
    
    if (selectedImage.value) {
      formData.append('image', selectedImage.value);
    }

    let response;
    if (isEditing.value) {
      response = await axios.put(`${baseURL}/${currentUser.value.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      response = await axios.post(`${baseURL}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }

    if (response.data && response.status === 200) {
      const updatedUser = response.data.usuario;
      if (isEditing.value) {
        const index = users.value.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          users.value[index] = updatedUser;
        }
      } else {
        users.value.push(updatedUser);
      }
      closeUserModal();
      showSuccessAlert(isEditing.value ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
    } else {
      throw new Error(response.data.message || 'No se pudo guardar el usuario o subir la imagen');
    }
  } catch (err) {  // Usa 'err' en vez de 'error'
    console.error('Error saving user:', err);

    // Manejo de error 403: Acceso denegado
    if (err.response && err.response.status === 403) {
      // Si el backend devuelve un mensaje de error
      const message = err.response.data.error || 'No tienes permisos suficientes para realizar esta acción.';
      showErrorAlert(message);
    } else {
      // Manejo de otros errores
      showErrorAlert(err.response?.data?.message || err.message || 'No se pudo guardar el usuario o subir la imagen');
    }
  }
};


const deleteUser = async (id) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      await axios.delete(`${baseURL}/${id}`);
      showSuccessAlert('El usuario ha sido eliminado');
      fetchUsers();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    showErrorAlert('No se pudo eliminar el usuario');
  }
};

const viewUserDetails = async (user) => {
  currentUser.value = { ...user };
  await fetchContacts(user.id);
  await fetchCredentials(user.id);
  showUserDetailsModal.value = true;
};

const closeUserDetailsModal = () => {
  showUserDetailsModal.value = false;
};

const fetchContacts = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/${userId}/contactos/`);
    contacts.value = response.data.contactos;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    contacts.value = [];
  }
};

const fetchCredentials = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/${userId}/credenciales/`);
    credentials.value = response.data.credenciales;
  } catch (error) {
    console.error('Error fetching credentials:', error);
    credentials.value = null;
  }
};

const openContactModal = (contact = null) => {
  isEditingContact.value = !!contact;
  currentContact.value = contact ? { ...contact } : {};
  showContactModal.value = true;
};

const closeContactModal = () => {
  showContactModal.value = false;
};

const saveContact = async () => {
  try {
    if (isEditingContact.value) {
      await axios.put(`${baseURL}/${currentUser.value.id}/contactos/${currentContact.value.id}`, currentContact.value);
      showSuccessAlert('Contacto actualizado correctamente');
    } else {
      await axios.post(`${baseURL}/${currentUser.value.id}/contactos/`, currentContact.value);
      showSuccessAlert('Contacto creado correctamente');
    }
    await fetchContacts(currentUser.value.id);
    closeContactModal();
  } catch (error) {
    console.error('Error saving contact:', error);
    showErrorAlert('No se pudo guardar el contacto');
  }
};

const deleteContact = async (contactId) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      await axios.delete(`${baseURL}/${currentUser.value.id}/contactos/${contactId}`);
      showSuccessAlert('El contacto ha sido eliminado');
      await fetchContacts(currentUser.value.id);
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    showErrorAlert('No se pudo eliminar el contacto');
  }
};

const openCredentialModal = () => {
  currentCredentials.value = credentials.value ? { ...credentials.value, password: '' } : {};
  showCredentialModal.value = true;
};

const closeCredentialModal = () => {
  showCredentialModal.value = false;
};

const saveCredentials = async () => {
  try {
    if (credentials.value) {
      await axios.put(`${baseURL}/${currentUser.value.id}/credenciales/${credentials.value.id}`, currentCredentials.value);
      showSuccessAlert('Credenciales actualizadas correctamente');
    } else {
      await axios.post(`${baseURL}/${currentUser.value.id}/credenciales/`, currentCredentials.value);
      showSuccessAlert('Credenciales creadas correctamente');
    }
    await fetchCredentials(currentUser.value.id);
    closeCredentialModal();
  } catch (error) {
    console.error('Error saving credentials:', error);
    showErrorAlert('No se pudieron guardar las credenciales');
  }
};

const showSuccessAlert = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Éxito',
    text: message,
    confirmButtonText: 'OK'
  });
};

const showErrorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonText: 'OK'
  });
};
</script>

<style scoped>
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>

