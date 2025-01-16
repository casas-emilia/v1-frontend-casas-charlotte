<template>
  <div class="container-fluid py-4">
    <h1 class="mb-4 text-center animate__animated animate__fadeIn">Gestión de Prefabricadas</h1>
    <p class="text-danger">*IMPORTANTE!, las imagenes deben tener un tamaño menor a 600 KB c/u, para mayor velocidad del servicio y reducción de costos en todos los sentidos</p>

    <!-- Lista de Prefabricadas -->
    <div class="card mb-4 animate__animated animate__fadeInUp">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Lista de Prefabricadas</h5>
        <button class="btn btn-primary" @click="openModal('prefabricada')">
          <i class="fas fa-plus"></i> Agregar Prefabricada
        </button>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>M²</th>
                <th>Garantía</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prefabricada in paginatedPrefabricadas" :key="prefabricada.id" class="animate__animated animate__fadeIn">
                <td>{{ prefabricada.id }}</td>
                <td>{{ prefabricada.nombre_prefabricada }}</td>
                <td>{{ prefabricada.m2 }}</td>
                <td>{{ prefabricada.garantia }}</td>
                <td>
                  <button class="btn btn-sm btn-info me-2" @click="editPrefabricada(prefabricada)" title="Editar">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger me-2" @click="deletePrefabricada(prefabricada.id)" title="Eliminar">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button class="btn btn-sm btn-secondary" @click="showPrefabricadaDetails(prefabricada)" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Paginación -->
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Anterior</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Siguiente</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modales -->
    <!-- Modal de Prefabricada -->
    <div class="modal fade" id="prefabricadaModal" tabindex="-1" aria-labelledby="prefabricadaModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="prefabricadaModalLabel">{{ isEditing ? 'Editar' : 'Agregar' }} Prefabricada</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePrefabricada">
              <div class="mb-3">
                <label for="nombrePrefabricada" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombrePrefabricada" v-model="currentPrefabricada.nombre_prefabricada" required>
              </div>
              <div class="mb-3">
                <label for="m2" class="form-label">M²</label>
                <input type="number" class="form-control" id="m2" v-model="currentPrefabricada.m2" required>
              </div>
              <div class="mb-3">
                <label for="garantia" class="form-label">Garantía</label>
                <input type="text" class="form-control" id="garantia" v-model="currentPrefabricada.garantia" required>
              </div>
              <div class="mb-3">
                <label for="eslogan" class="form-label">Eslogan</label>
                <input type="text" class="form-control" id="eslogan" v-model="currentPrefabricada.eslogan" required>
              </div>
              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <textarea 
                  class="form-control" 
                  id="descripcion" 
                  v-model="currentPrefabricada.descripcion" 
                  rows="5" 
                  required
                  placeholder="Escribe una descripción detallada aquí...">
                </textarea>
              </div>

              
              <!-- Checkboxes -->
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="destacada" v-model="currentPrefabricada.destacada">
                <label class="form-check-label" for="destacada">Destacada</label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="oferta" v-model="currentPrefabricada.oferta">
                <label class="form-check-label" for="oferta">Oferta</label>
              </div>

              <div class="mb-3">
                <label for="categoria" class="form-label">Categoría</label>
                <select class="form-select" id="categoria" v-model="currentPrefabricada.categoria_id" required>
                  <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                    {{ categoria.nombre_categoria }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="estilo" class="form-label">Estilo</label>
                <select class="form-select" id="estilo" v-model="currentPrefabricada.estilo_id" required>
                  <option v-for="estilo in estilos" :key="estilo.id" :value="estilo.id">
                    {{ estilo.nombre_estilo }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="tipo" class="form-label">Tipo</label>
                <select class="form-select" id="tipo" v-model="currentPrefabricada.tipo_id" required>
                  <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">
                    {{ tipo.material_estructura }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isLoading ? 'Guardando...' : 'Guardar' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles de Prefabricada -->
    <div class="modal fade" id="prefabricadaDetailsModal" tabindex="-1" aria-labelledby="prefabricadaDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="prefabricadaDetailsModalLabel">Detalles de {{ selectedPrefabricada?.nombre_prefabricada }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs" id="prefabricadaDetailsTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="imagenes-tab" data-bs-toggle="tab" data-bs-target="#imagenes" type="button" role="tab" aria-controls="imagenes" aria-selected="true">Imágenes</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="caracteristicas-tab" data-bs-toggle="tab" data-bs-target="#caracteristicas" type="button" role="tab" aria-controls="caracteristicas" aria-selected="false">Características</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="precios-tab" data-bs-toggle="tab" data-bs-target="#precios" type="button" role="tab" aria-controls="precios" aria-selected="false">Precios</button>
              </li>
            </ul>
            <div class="tab-content" id="prefabricadaDetailsTabsContent">
      <div class="tab-pane fade show active" id="imagenes" role="tabpanel" aria-labelledby="imagenes-tab">
        <div class="row mt-3">
          <div v-for="imagen in imagenes" :key="imagen.id" class="col-md-4 mb-3">
            <div class="card">
              <img :src="imagen.image" class="card-img-top" :alt="'Imagen ' + imagen.id">
              <div class="card-body">
                <p>Plano: {{ imagen.plano ? 'Sí' : 'No' }}</p>
                <button class="btn btn-sm btn-info me-2" @click="editImagen(imagen)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteImagen(imagen.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary mt-3" @click="openModal('imagen')">
          <i class="fas fa-plus"></i> Agregar Imagen
        </button>
      </div>
              <div class="tab-pane fade" id="caracteristicas" role="tabpanel" aria-labelledby="caracteristicas-tab">
                <ul class="list-group mt-3">
                  <li v-for="caracteristica in caracteristicas" :key="caracteristica.id" class="list-group-item d-flex justify-content-between align-items-center">
                    {{ caracteristica.clave }}: {{ caracteristica.valor }}
                    <div>
                      <button class="btn btn-sm btn-info me-2" @click="editCaracteristica(caracteristica)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" @click="deleteCaracteristica(caracteristica.id)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </li>
                </ul>
                <button class="btn btn-primary mt-3" @click="openModal('caracteristica')">
                  <i class="fas fa-plus"></i> Agregar Característica
                </button>
              </div>
              <div class="tab-pane fade" id="precios" role="tabpanel" aria-labelledby="precios-tab">
                <div class="accordion mt-3" id="accordionPrecios">
                  <div v-for="precio in precios" :key="precio.id" class="accordion-item">
                    <h2 class="accordion-header">
                      <button class="accordion-button collapsed" type="button" :data-bs-target="'#precio' + precio.id" data-bs-toggle="collapse">
                        {{ precio.nombre_precio }} - ${{ precio.valor_prefabricada.toLocaleString() }}
                      </button>
                    </h2>
                    <div :id="'precio' + precio.id" class="accordion-collapse collapse" data-bs-parent="#accordionPrecios">
                      <div class="accordion-body">
                        <p>{{ precio.descripcion_precio }}</p>
                        <h6>Incluye:</h6>
                        <ul class="list-group mb-3">
                          <li v-for="incluye in precio.incluyes" :key="incluye.id" class="list-group-item d-flex justify-content-between align-items-center">
                            {{ incluye.nombre_incluye }}
                            <div>
                              <button class="btn btn-sm btn-info me-2" @click="editIncluye(incluye, precio.id)">
                                <i class="fas fa-edit"></i>
                              </button>
                              <button class="btn btn-sm btn-danger" @click="deleteIncluye(incluye.id, precio.id)">
                                <i class="fas fa-trash"></i>
                              </button>
                            </div>
                          </li>
                        </ul>
                        <button class="btn btn-sm btn-success mb-2" @click="openModal('incluye', null, precio.id)">
                          <i class="fas fa-plus"></i> Agregar Incluye
                        </button>

                        <!-- Adicionales Section -->
                        <h6 class="mt-3">Adicionales:</h6>
                        <ul class="list-group mb-3">
                          <li v-for="adicional in precio.adicionales" :key="adicional.id" class="list-group-item d-flex justify-content-between align-items-center">
                            {{ adicional.nombre_adicional }} - ${{ adicional.valor_adicional.toLocaleString() }}
                            <div>
                              <button class="btn btn-sm btn-info me-2" @click="editAdicional(adicional, precio.id)">
                                <i class="fas fa-edit"></i>
                              </button>
                              <button class="btn btn-sm btn-danger" @click="deleteAdicional(adicional.id, precio.id)">
                                <i class="fas fa-trash"></i>
                              </button>
                            </div>
                          </li>
                        </ul>
                        <button class="btn btn-sm btn-success mb-2" @click="openModal('adicional', null, precio.id)">
                          <i class="fas fa-plus"></i> Agregar Adicional
                        </button>

                        <div>
                          <button class="btn btn-sm btn-info me-2" @click="editPrecio(precio)">
                            <i class="fas fa-edit"></i> Editar Precio
                          </button>
                          <button class="btn btn-sm btn-danger" @click="deletePrecio(precio.id)">
                            <i class="fas fa-trash"></i> Eliminar Precio
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="btn btn-primary mt-3" @click="openModal('precio')">
                  <i class="fas fa-plus"></i> Agregar Precio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Imagen -->
    <div class="modal fade" id="imagenModal" tabindex="-1" aria-labelledby="imagenModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="imagenModalLabel">{{ isEditing ? 'Editar' : 'Agregar' }} Imagen</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="text-danger">*IMPORTANTE!, las imagenes deben ser menor a 600 KB cada una</p>
          <p class="text-primary">Si una imagen pesa más de 600 kb reducir su tamaño en la web, como en: https://tinypng.com/ u otro servicio</p>
          <form @submit.prevent="saveImagen">
            <div class="mb-3">
              <label for="imageFile" class="form-label">Imagen</label>
              <input type="file" class="form-control" id="imageFile" @change="handleFileUpload" :required="!isEditing">
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="imagenPlano" v-model="currentImagen.plano">
              <label class="form-check-label" for="imagenPlano">Marcar si la imagen es un Plano/Diagrama de la Casa</label>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isUploading">
              <span v-if="isUploading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isUploading ? 'Subiendo...' : 'Subir' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

    <!-- Modal de Característica -->
    <div class="modal fade" id="caracteristicaModal" tabindex="-1" aria-labelledby="caracteristicaModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="caracteristicaModalLabel">{{ isEditing ? 'Editar' : 'Agregar' }} Característica</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCaracteristica">
              <p class="text-success">*Algunas Claves tipicas son: Dormitorios, Baños, Cocina, Living, Sala, Bodega, Comedor, etc. En Valor va según lo necesario: número, detalle o deescripción</p>
              <p class="text-success">**Ejemplo: Clave: Baños | Valor: 2</p>
              <div class="mb-3">
                <label for="clave" class="form-label">Clave</label>
                <input type="text" class="form-control" id="clave" v-model="currentCaracteristica.clave" required>
              </div>
              <div class="mb-3">
                <label for="valor" class="form-label">Valor</label>
                <input type="text" class="form-control" id="valor" v-model="currentCaracteristica.valor" required>
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Precio -->
    <div class="modal fade" id="precioModal" tabindex="-1" aria-labelledby="precioModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="precioModalLabel">{{ isEditing ? 'Editar' : 'Agregar' }} Precio</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePrecio">
              <div class="mb-3">
                <label for="nombrePrecio" class="form-label">Nombre del Precio</label>
                <input type="text" class="form-control" id="nombrePrecio" v-model="currentPrecio.nombre_precio" required>
              </div>
              <div class="mb-3">
                <label for="valorPrefabricada" class="form-label">Valor</label>
                <input type="number" class="form-control" id="valorPrefabricada" v-model="currentPrecio.valor_prefabricada" required>
              </div>
              <div class="mb-3">
                <label for="descripcionPrecio" class="form-label">Descripción</label>
                <textarea class="form-control" id="descripcionPrecio" v-model="currentPrecio.descripcion_precio" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Incluye -->
    <div class="modal fade" id="incluyeModal" tabindex="-1" aria-labelledby="incluyeModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="incluyeModalLabel">{{ isEditing ? 'Editar' : 'Agregar' }} Incluye</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveIncluye">
              <div class="mb-3">
                <label for="nombreIncluye" class="form-label">Nombre del Incluye</label>
                <input type="text" class="form-control" id="nombreIncluye" v-model="currentIncluye.nombre_incluye" required>
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Adicional -->
    <div class="modal fade" id="adicionalModal" tabindex="-1" aria-labelledby="adicionalModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="adicionalModalLabel">{{ isEditing ? 'Editar' : 'Agregar' }} Adicional</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAdicional">
              <div class="mb-3">
                <label for="nombreAdicional" class="form-label">Nombre del Adicional</label>
                <input type="text" class="form-control" id="nombreAdicional" v-model="currentAdicional.nombre_adicional" required>
              </div>
              <div class="mb-3">
                <label for="valorAdicional" class="form-label">Valor del Adicional</label>
                <input type="number" class="form-control" id="valorAdicional" v-model="currentAdicional.valor_adicional" required>
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
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Modal } from 'bootstrap'

const prefabricadas = ref([])
const categorias = ref([])
const estilos = ref([])
const tipos = ref([])
const currentPrefabricada = ref({})
const isEditing = ref(false)
const selectedPrefabricada = ref(null)
const imagenes = ref([])
const caracteristicas = ref([])
const precios = ref([])
const currentImagen = ref({})
const currentCaracteristica = ref({})
const currentPrecio = ref({})
const currentIncluye = ref({})
const currentAdicional = ref({})
const selectedPrecioId = ref(null)

const prefabricadaModal = ref(null)
const prefabricadaDetailsModal = ref(null)
const imagenModal = ref(null)
const caracteristicaModal = ref(null)
const precioModal = ref(null)
const incluyeModal = ref(null)
const adicionalModal = ref(null)

const isLoading = ref(false)
const isUploading = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(prefabricadas.value.length / itemsPerPage))

const paginatedPrefabricadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return prefabricadas.value.slice(start, end)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(async () => {
  await fetchPrefabricadas()
  await fetchCategorias()
  await fetchEstilos()
  await fetchTipos()
  
  // Initialize modals
  prefabricadaModal.value = new Modal(document.getElementById('prefabricadaModal'))
  prefabricadaDetailsModal.value = new Modal(document.getElementById('prefabricadaDetailsModal'))
  imagenModal.value = new Modal(document.getElementById('imagenModal'))
  caracteristicaModal.value = new Modal(document.getElementById('caracteristicaModal'))
  precioModal.value = new Modal(document.getElementById('precioModal'))
  incluyeModal.value = new Modal(document.getElementById('incluyeModal'))
  adicionalModal.value = new Modal(document.getElementById('adicionalModal'))
})

const fetchPrefabricadas = async () => {
  try {
    const response = await axios.get('/administracion/empresas/1/prefabricadas/')
    prefabricadas.value = response.data.prefabricadas
  } catch (error) {
    console.error('Error fetching prefabricadas:', error)
    Swal.fire('Error', 'No se pudieron cargar las prefabricadas', 'error')
  }
}

const fetchCategorias = async () => {
  try {
    const response = await axios.get('/administracion/categorias/')
    categorias.value = response.data.categorias
  } catch (error) {
    console.error('Error fetching categorias:', error)
    Swal.fire('Error', 'No se pudieron cargar las categorías', 'error')
  }
}

const fetchEstilos = async () => {
  try {
    const response = await axios.get('/administracion/estilos/')
    estilos.value = response.data.estilos
  } catch (error) {
    console.error('Error fetching estilos:', error)
    Swal.fire('Error', 'No se pudieron cargar los estilos', 'error')
  }
}

const fetchTipos = async () => {
  try {
    const response = await axios.get('/administracion/tipos/')
    tipos.value = response.data.tipos
  } catch (error) {
    console.error('Error fetching tipos:', error)
    Swal.fire('Error', 'No se pudieron cargar los tipos', 'error')
  }
}

const savePrefabricada = async () => {
  isLoading.value = true
  try {
    if (isEditing.value) {
      await axios.put(`/administracion/empresas/1/prefabricadas/${currentPrefabricada.value.id}`, currentPrefabricada.value)
    } else {
      await axios.post('/administracion/empresas/1/prefabricadas/', currentPrefabricada.value)
    }
    await fetchPrefabricadas()
    prefabricadaModal.value.hide()
    Swal.fire('Éxito', `Prefabricada ${isEditing.value ? 'actualizada' : 'creada'} correctamente`, 'success')
  } catch (error) {
    console.error('Error saving prefabricada:', error)
    Swal.fire('Error', `No se pudo ${isEditing.value ? 'actualizar' : 'crear'} la prefabricada`, 'error')
  } finally {
    isLoading.value = false
  }
}

const deletePrefabricada = async (id) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      await axios.delete(`/administracion/empresas/1/prefabricadas/${id}`)
      await fetchPrefabricadas()
      Swal.fire('Eliminado', 'La prefabricada ha sido eliminada', 'success')
    }
  } catch (error) {
    console.error('Error deleting prefabricada:', error)
    Swal.fire('Error', 'No se pudo eliminar la prefabricada', 'error')
  }
}

const showPrefabricadaDetails = async (prefabricada) => {
  selectedPrefabricada.value = prefabricada
  await fetchImagenes(prefabricada.id)
  await fetchCaracteristicas(prefabricada.id)
  await fetchPrecios(prefabricada.id)
  prefabricadaDetailsModal.value.show()
}

const fetchImagenes = async (prefabricadaId) => {
  try {
    const response = await axios.get(
      `/administracion/empresas/1/prefabricadas/${prefabricadaId}/imagenesPrefabricadas/`
    );

    // Verifica si la respuesta tiene imágenes
    if (response.data.Imagenes_prefabricadas && response.data.Imagenes_prefabricadas.length > 0) {
      imagenes.value = response.data.Imagenes_prefabricadas.map(imagen => ({
        ...imagen,
        plano: imagen.plano, // Asume que ya es booleano
      }));
    } else {
      imagenes.value = []; // Si no hay imágenes, asegúrate de que sea un array vacío
    }
  } catch (error) {
    // Si el error es algo diferente a "no hay imágenes", lo manejamos
    console.error('Error fetching imagenes:', error);
    Swal.fire('Error', 'Ocurrió un problema al intentar cargar las imágenes', 'error');
  }
};


const fetchCaracteristicas = async (prefabricadaId) => {
  try {
    const response = await axios.get(`/administracion/empresas/1/prefabricadas/${prefabricadaId}/caracteristicas/`)
    caracteristicas.value = response.data.caracteristicas
  } catch (error) {
    console.error('Error fetching caracteristicas:', error)
    Swal.fire('Error', 'No se pudieron cargar las características', 'error')
  }
}

const fetchPrecios = async (prefabricadaId) => {
  try {
    const response = await axios.get(`/administracion/empresas/1/prefabricadas/${prefabricadaId}/precios/`)
    precios.value = response.data.precios
  } catch (error) {
    console.error('Error fetching precios:', error)
    Swal.fire('Error', 'No se pudieron cargar los precios', 'error')
  }
}

const openModal = (type, item = null, precioId = null) => {
  isEditing.value = !!item
  selectedPrecioId.value = precioId

  switch (type) {
    case 'prefabricada':
      currentPrefabricada.value = item ? { ...item } : {}
      prefabricadaModal.value.show()
      break
    case 'imagen':
      currentImagen.value = item ? { ...item } : { plano: false }
      imagenModal.value.show()
      break
    case 'caracteristica':
      currentCaracteristica.value = item ? { ...item } : {}
      caracteristicaModal.value.show()
      break
    case 'precio':
      currentPrecio.value = item ? { ...item } : {}
      precioModal.value.show()
      break
    case 'incluye':
      currentIncluye.value = item ? { ...item } : {}
      incluyeModal.value.show()
      break
    case 'adicional':
      currentAdicional.value = item ? { ...item } : {}
      adicionalModal.value.show()
      break
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    currentImagen.value.file = file
  }
}

const saveImagen = async () => {
  isUploading.value = true
  try {
    const formData = new FormData()
    if (currentImagen.value.file) {
      formData.append('image', currentImagen.value.file)
    }
    formData.append('plano', currentImagen.value.plano ? 1 : 0)

    let response;
    if (isEditing.value) {
      response = await axios.put(
        `/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/imagenesPrefabricadas/${currentImagen.value.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
    } else {
      response = await axios.post(
        `/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/imagenesPrefabricadas/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
    }

    // Asegurarse de que la respuesta contiene la información de la imagen
    if (response.data && response.data.imagen) {
      const updatedImage = response.data.imagen
      const timestamp = new Date().getTime()
      
      if (isEditing.value) {
        const index = imagenes.value.findIndex(img => img.id === updatedImage.id)
        if (index !== -1) {
          imagenes.value[index] = {
            ...imagenes.value[index],
            ...updatedImage,
            image: `${updatedImage.image}?t=${timestamp}`
          }
        }
      } else {
        imagenes.value.push({
          ...updatedImage,
          image: `${updatedImage.image}?t=${timestamp}`
        })
      }

      imagenModal.value.hide()
      Swal.fire('Éxito', `Imagen ${isEditing.value ? 'actualizada' : 'agregada'} correctamente`, 'success')
    } else {
      throw new Error('La respuesta del servidor no contiene la información de la imagen')
    }
  } catch (error) {
    console.error('Error saving imagen:', error)
    Swal.fire('Error', `No se pudo ${isEditing.value ? 'actualizar' : 'agregar'} la imagen`, 'error')
  } finally {
    isUploading.value = false
  }
}

const saveCaracteristica = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/caracteristicas/${currentCaracteristica.value.id}`, currentCaracteristica.value)
    } else {
      await axios.post(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/caracteristicas/`, currentCaracteristica.value)
    }
    await fetchCaracteristicas(selectedPrefabricada.value.id)
    caracteristicaModal.value.hide()
    Swal.fire('Éxito', `Característica ${isEditing.value ? 'actualizada' : 'agregada'} correctamente`, 'success')
  } catch (error) {
    console.error('Error saving caracteristica:', error)
    Swal.fire('Error', `No se pudo ${isEditing.value ? 'actualizar' : 'agregar'} la característica`, 'error')
  }
}

const savePrecio = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/precios/${currentPrecio.value.id}`, currentPrecio.value)
    } else {
      await axios.post(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/precios/`, currentPrecio.value)
    }
    await fetchPrecios(selectedPrefabricada.value.id)
    precioModal.value.hide()
    Swal.fire('Éxito', `Precio ${isEditing.value ? 'actualizado' : 'agregado'} correctamente`, 'success')
  } catch (error) {
    console.error('Error saving precio:', error)
    Swal.fire('Error', `No se pudo ${isEditing.value ? 'actualizar' : 'agregar'} el precio`, 'error')
  }
}

const saveIncluye = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/precios/${selectedPrecioId.value}/incluyes/${currentIncluye.value.id}`, currentIncluye.value)
    } else {
      await axios.post(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/precios/${selectedPrecioId.value}/incluyes/`, currentIncluye.value)
    }
    await fetchPrecios(selectedPrefabricada.value.id)
    incluyeModal.value.hide()
    Swal.fire('Éxito', `Incluye ${isEditing.value ? 'actualizado' : 'agregado'} correctamente`, 'success')
  } catch (error) {
    console.error('Error saving incluye:', error)
    Swal.fire('Error', `No se pudo ${isEditing.value ? 'actualizar' : 'agregar'} el incluye`, 'error')
  }
}

const saveAdicional = async () => {
  try {
    if (isEditing.value) {
      await axios.put(
        `/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/precios/${selectedPrecioId.value}/adicionales/${currentAdicional.value.id}`,
        currentAdicional.value
      )
    } else {
      await axios.post(
        `/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/precios/${selectedPrecioId.value}/adicionales/`,
        currentAdicional.value
      )
    }
    await fetchPrecios(selectedPrefabricada.value.id)
    adicionalModal.value.hide()
    Swal.fire('Éxito', `Adicional ${isEditing.value ? 'actualizado' : 'agregado'} correctamente`, 'success')
  } catch (error) {
    console.error('Error saving adicional:', error)
    Swal.fire('Error', `No se pudo ${isEditing.value ? 'actualizar' : 'agregar'} el adicional`, 'error')
  }
}

const deleteImagen = async (id) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      await axios.delete(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/imagenesPrefabricadas/${id}`)
      await fetchImagenes(selectedPrefabricada.value.id)
      Swal.fire('Eliminado', 'La imagen ha sido eliminada', 'success')
    }
  } catch (error) {
    console.error('Error deleting imagen:', error)
    Swal.fire('Error', 'No se pudo eliminar la imagen', 'error')
  }
}

const deleteCaracteristica = async (id) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      await axios.delete(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/caracteristicas/${id}`)
      await fetchCaracteristicas(selectedPrefabricada.value.id)
      Swal.fire('Eliminado', 'La característica ha sido eliminada', 'success')
    }
  } catch (error) {
    console.error('Error deleting caracteristica:', error)
    Swal.fire('Error', 'No se pudo eliminar la característica', 'error')
  }
}

const deletePrecio = async (id) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      await axios.delete(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/precios/${id}`)
      await fetchPrecios(selectedPrefabricada.value.id)
      Swal.fire('Eliminado', 'El precio ha sido eliminado', 'success')
    }
  } catch (error) {
    console.error('Error deleting precio:', error)
    Swal.fire('Error', 'No se pudo eliminar el precio', 'error')
  }
}

const deleteIncluye = async (id, precioId) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      await axios.delete(`/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/precios/${precioId}/incluyes/${id}`)
      await fetchPrecios(selectedPrefabricada.value.id)
      Swal.fire('Eliminado', 'El incluye ha sido eliminado', 'success')
    }
  } catch (error) {
    console.error('Error deleting incluye:', error)
    Swal.fire('Error', 'No se pudo eliminar el incluye', 'error')
  }
}

const deleteAdicional = async (id, precioId) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      await axios.delete(
        `/administracion/empresas/1/prefabricadas/${selectedPrefabricada.value.id}/precios/${precioId}/adicionales/${id}`
      )
      await fetchPrecios(selectedPrefabricada.value.id)
      Swal.fire('Eliminado', 'El adicional ha sido eliminado', 'success')
    }
  } catch (error) {
    console.error('Error deleting adicional:', error)
    Swal.fire('Error', 'No se pudo eliminar el adicional', 'error')
  }
}

const editPrefabricada = (prefabricada) => {
  openModal('prefabricada', prefabricada)
}

const editImagen = (imagen) => {
  currentImagen.value = { ...imagen, file: null }
  isEditing.value = true
  imagenModal.value.show()
}

const editCaracteristica = (caracteristica) => {
  openModal('caracteristica', caracteristica)
}

const editPrecio = (precio) => {
  openModal('precio', precio)
}

const editIncluye = (incluye, precioId) => {
  openModal('incluye', incluye, precioId)
}

const editAdicional = (adicional, precioId) => {
  openModal('adicional', adicional, precioId)
}

</script>

<style scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
@import 'animate.css/animate.min.css';

.card {
  margin-bottom: 1rem;
}

.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
}

.table-responsive {
  margin-bottom: 1rem;
}

.btn-group {
  gap: 0.5rem;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-group-item > div {
  display: flex;
  gap: 0.5rem;
}

.animate__animated {
  animation-duration: 0.5s;
}
</style>