<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-body">
            <h2 class="text-center mb-4">
              <i class="fas fa-user-circle"></i> Perfil de Usuario
            </h2>
            <h5>Roles asignados: </h5>
            <h6 v-if="userProfile.roles" class="text-success">{{ userProfile.roles.map(role => role.nombre_rol).join(', ') }}</h6>
            <h6 v-else class="text-danger">*Sin roles asignados</h6>
            <br>
            <h4 class="mb-3">Información Personal</h4>

            <form @submit.prevent="updateProfile">
              <!-- User Profile Section -->                
              <div class="mb-3">
                <label for="primerNombre" class="form-label">Primer Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  id="primerNombre"
                  v-model="userProfile.primer_nombre"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="segundoNombre" class="form-label">Segundo Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  id="segundoNombre"
                  v-model="userProfile.segundo_nombre"
                >
              </div>
              <div class="mb-3">
                <label for="primerApellido" class="form-label">Primer Apellido</label>
                <input
                  type="text"
                  class="form-control"
                  id="primerApellido"
                  v-model="userProfile.primer_apellido"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="segundoApellido" class="form-label">Segundo Apellido</label>
                <input
                  type="text"
                  class="form-control"
                  id="segundoApellido"
                  v-model="userProfile.segundo_apellido"
                >
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Imagen de Perfil</label>
                <input
                  type="file"
                  class="form-control"
                  id="image"
                  @change="handleImageUpload"
                  accept="image/*"
                >
              </div>
              <div v-if="imagePreview" class="mb-3">
                <img 
                  :src="imagePreview" 
                  alt="Profile Image" 
                  class="img-thumbnail" 
                  style="max-width: 200px;"
                >
              </div>

              <!-- Contact Information Section -->
              <h4 class="mb-3 mt-4">Información de Contacto</h4>
              <div v-for="(contact, index) in userContacts" :key="index" class="mb-4 p-3 border rounded">
                <div class="mb-3">
                  <label :for="'emailLaboral' + index" class="form-label">Email Laboral</label>
                  <input
                    type="email"
                    class="form-control"
                    :id="'emailLaboral' + index"
                    v-model="contact.email_laboral"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label :for="'celularLaboral' + index" class="form-label">Celular Laboral</label>
                  <input
                    type="tel"
                    class="form-control"
                    :id="'celularLaboral' + index"
                    v-model="contact.celular_laboral"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label :for="'direccionLaboral' + index" class="form-label">Dirección Laboral</label>
                  <input
                    type="text"
                    class="form-control"
                    :id="'direccionLaboral' + index"
                    v-model="contact.direccion_laboral"
                  >
                </div>
                <button type="button" class="btn btn-danger" @click="removeContact(index)">
                  <i class="fas fa-trash-alt"></i> Eliminar Contacto
                </button>
              </div>
              <button type="button" class="btn btn-success mb-4" @click="addContact">
                <i class="fas fa-plus"></i> Agregar Contacto
              </button>

              <!-- Credentials Section -->
              <h4 class="mb-3">Credenciales de Acceso</h4>
              <div class="mb-3">
                <label for="email" class="form-label">Email de Acceso</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="userCredentials.email"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Nueva Contraseña (dejar en blanco si no desea cambiarla)</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="userCredentials.password"
                >
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                <i class="fas fa-save me-2"></i>
                {{ isLoading ? 'Actualizando...' : 'Actualizar Perfil' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/authStore';

const userProfile = reactive({
  primer_nombre: '',
  segundo_nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  image: null
})

const userContacts = ref([])

const userCredentials = reactive({
  id: null,
  email: '',
  password: ''
})

const isLoading = ref(false)
const empresaId = ref(1) // Assuming empresaId is 1
const baseUrl = `https://v1-backend-casas-charlotte-production.up.railway.app/administracion/empresas/`
// const baseUrl = `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/`
const userId = ref(null)

const imagePreview = computed(() => {
  if (userProfile.image instanceof File) {
    return URL.createObjectURL(userProfile.image)
  }
  return userProfile.image
})

onMounted(async () => {
  const authStore = useAuthStore();
  // console.log(authStore); // Verifica que esté obteniendo los valores correctamente
  userId.value = authStore.userId
  await fetchUserData()
})

const fetchUserData = async () => {
  try {
    const [profileResponse, contactResponse, credentialsResponse] = await Promise.all([
      axios.get(`${baseUrl}${empresaId.value}/usuarios/${userId.value}`).catch(() => ({ data: { usuario: {} } })),
      axios.get(`${baseUrl}${empresaId.value}/usuarios/${userId.value}/contactos/`).catch(() => ({ data: { contactos: [] } })),
      axios.get(`${baseUrl}${empresaId.value}/usuarios/${userId.value}/credenciales/`).catch(() => ({ data: { credenciales: {} } }))
    ])

    Object.assign(userProfile, profileResponse.data.usuario)
    userContacts.value = contactResponse.data.contactos
    Object.assign(userCredentials, {
      id: credentialsResponse.data.credenciales.id,
      email: credentialsResponse.data.credenciales.email,
      password: ''
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    Swal.fire('Error', 'No se pudo cargar la información del usuario', 'error')
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    userProfile.image = file
  }
}

const addContact = () => {
  userContacts.value.push({
    email_laboral: '',
    celular_laboral: '',
    direccion_laboral: ''
  })
}

const removeContact = (index) => {
  userContacts.value.splice(index, 1)
}

const updateProfile = async () => {
  isLoading.value = true
  try {
    // Update user profile
    const formData = new FormData()
    formData.append('primer_nombre', userProfile.primer_nombre)
    formData.append('segundo_nombre', userProfile.segundo_nombre)
    formData.append('primer_apellido', userProfile.primer_apellido)
    formData.append('segundo_apellido', userProfile.segundo_apellido)
    if (userProfile.image instanceof File) {
      formData.append('image', userProfile.image)
    }

    await axios.put(`${baseUrl}${empresaId.value}/usuarios/${userId.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Update or create contacts
    for (const contact of userContacts.value) {
      if (contact.id) {
        await axios.put(`${baseUrl}${empresaId.value}/usuarios/${userId.value}/contactos/${contact.id}`, contact)
      } else {
        await axios.post(`${baseUrl}${empresaId.value}/usuarios/${userId.value}/contactos/`, contact)
      }
    }

    // Update credentials
    if (userCredentials.id) {
      const credentialsData = {
        email: userCredentials.email
      }
      
      if (userCredentials.password && userCredentials.password.trim() !== '') {
        credentialsData.password = userCredentials.password
      }

      try {
        await axios.put(`${baseUrl}${empresaId.value}/usuarios/${userId.value}/credenciales/${userCredentials.id}`, credentialsData)
      } catch (error) {
        console.error('Error updating credentials:', error.response?.data || error.message)
        if (error.response?.status === 400) {
          throw new Error('Error al actualizar las credenciales: ' + (error.response.data.error || 'Datos inválidos'))
        }
        throw new Error('Error al actualizar las credenciales')
      }
    }

    Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success')
  } catch (error) {
    console.error('Error updating profile:', error)
    Swal.fire('Error', `No se pudo actualizar el perfil: ${error.message}`, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
  overflow: hidden;
}

.card-body {
  padding: 2rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>