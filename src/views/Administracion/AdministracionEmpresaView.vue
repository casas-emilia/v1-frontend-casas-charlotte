<template>
    <div class="container-fluid py-4 bg-light">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card shadow-sm">
            <div class="card-body">
              <h1 class="text-center mb-4 text-primary">Administrar Empresas</h1>
              <p class="text-danger">*Siempre trate de editar información en esta vista, no crear Empresa o eliminar Empresa, ya que, el sistema mostrará errores</p>
  
              <!-- Filtros y Búsqueda -->
              <div class="row mb-3">
                <div class="col-md-6 mb-2 mb-md-0">
                  <div class="input-group">
                    <input
                      v-model="searchTerm"
                      type="text"
                      class="form-control"
                      placeholder="Buscar por nombre o descripción"
                      aria-label="Buscar por nombre o descripción"
                    />
                    <button @click="applyFilters" class="btn btn-outline-secondary" type="button">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <select v-model="sortBy" @change="applyFilters" class="form-select" aria-label="Ordenar por">
                    <option value="">Ordenar por</option>
                    <option value="id">ID</option>
                    <option value="nombre_empresa">Nombre</option>
                    <option value="descripcion_empresa">Descripción</option>
                  </select>
                </div>
              </div>
  
              <!-- Botón para abrir el modal de crear -->
              <button class="btn btn-success mb-3" @click="openModal('create')">
                <i class="fas fa-plus-circle me-2"></i> Crear Empresa
              </button>
  
              <!-- Tabla de Empresas -->
              <div v-if="filteredEmpresas.length > 0" class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="empresa in filteredEmpresas" :key="empresa.id">
                      <td>{{ empresa.id }}</td>
                      <td>{{ empresa.nombre_empresa }}</td>
                      <td>{{ empresa.descripcion_empresa }}</td>
                      <td>
                        <button class="btn btn-primary btn-sm me-2" @click="openModal('edit', empresa)">
                          <i class="fas fa-edit me-1"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm" @click="deleteEmpresa(empresa.id)">
                          <i class="fas fa-trash-alt me-1"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="alert alert-warning text-center">
                <i class="fas fa-exclamation-triangle me-2"></i> No hay datos disponibles
              </div>
  
              <!-- Modal para Crear/Editar -->
              <Teleport to="body">
                <div v-if="showModal" class="modal-backdrop" @click="closeModal"></div>
                <div v-if="showModal" class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document" @click.stop>
                    <div class="modal-content">
                      <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                          {{ modalMode === 'create' ? 'Crear Empresa' : 'Editar Empresa' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <form @submit.prevent="saveEmpresa">
                          <div class="mb-3">
                            <label for="nombreEmpresa" class="form-label">Nombre</label>
                            <input
                              v-model="form.nombre_empresa"
                              type="text"
                              id="nombreEmpresa"
                              class="form-control"
                              placeholder="Ingrese el nombre de la empresa"
                              required
                            />
                          </div>
                          <div class="mb-3">
                            <label for="descripcionEmpresa" class="form-label">Descripción</label>
                            <textarea
                              v-model="form.descripcion_empresa"
                              id="descripcionEmpresa"
                              class="form-control"
                              rows="3"
                              placeholder="Ingrese la descripción de la empresa"
                              required
                            ></textarea>
                          </div>
                          <div class="mb-3">
                            <label for="historiaEmpresa" class="form-label">Historia</label>
                            <textarea
                              v-model="form.historia_empresa"
                              id="historiaEmpresa"
                              class="form-control"
                              rows="3"
                              placeholder="Ingrese la historia de la empresa"
                            ></textarea>
                          </div>
                          <div class="mb-3">
                            <label for="misionEmpresa" class="form-label">Misión</label>
                            <textarea
                              v-model="form.mision_empresa"
                              id="misionEmpresa"
                              class="form-control"
                              rows="3"
                              placeholder="Ingrese la misión de la empresa"
                            ></textarea>
                          </div>
                          <div class="mb-3">
                            <label for="visionEmpresa" class="form-label">Visión</label>
                            <textarea
                              v-model="form.vision_empresa"
                              id="visionEmpresa"
                              class="form-control"
                              rows="3"
                              placeholder="Ingrese la visión de la empresa"
                            ></textarea>
                          </div>
                          <div class="mb-3">
                            <label for="ubicacionEmpresa" class="form-label">Ubicación</label>
                            <input
                              v-model="form.ubicacion_empresa"
                              type="text"
                              id="ubicacionEmpresa"
                              class="form-control"
                              placeholder="Ingrese la ubicación de la empresa"
                            />
                          </div>
                          <div class="mb-3">
                            <label for="celularEmpresa" class="form-label">Celular</label>
                            <input
                              v-model="form.celular_empresa"
                              type="text"
                              id="celularEmpresa"
                              class="form-control"
                              placeholder="Ingrese el número de celular"
                            />
                          </div>
                          <div class="mb-3">
                            <label for="emailEmpresa" class="form-label">Correo Electrónico</label>
                            <input
                              v-model="form.email_empresa"
                              type="email"
                              id="emailEmpresa"
                              class="form-control"
                              placeholder="Ingrese el correo electrónico"
                            />
                          </div>
                          <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-success">
                              <i class="fas" :class="modalMode === 'create' ? 'fa-plus-circle' : 'fa-save'"></i>
                              {{ modalMode === 'create' ? ' Crear' : ' Actualizar' }}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Teleport>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import Swal from "sweetalert2";
  
  export default {
    setup() {
      const empresas = ref([]);
      const filteredEmpresas = ref([]);
      const modalMode = ref("create");
      const showModal = ref(false);
      const form = ref({
        id: null,
        nombre_empresa: "",
        descripcion_empresa: "",
        historia_empresa: "",
        mision_empresa: "",
        vision_empresa: "",
        ubicacion_empresa: "",
        celular_empresa: "",
        email_empresa: "",
      });
      const searchTerm = ref("");
      const sortBy = ref("");
  
      const getEmpresas = async () => {
        try {
          const response = await axios.get("http://localhost:8080/administracion/empresas/");
          // const response = await axios.get("https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/");
          empresas.value = response.data.empresas;
          applyFilters();
        } catch (error) {
          Swal.fire("Error", "No se pudo cargar las empresas", "error");
        }
      };
  
      const applyFilters = () => {
        let result = [...empresas.value];
  
        if (searchTerm.value) {
          const search = searchTerm.value.toLowerCase();
          result = result.filter(empresa =>
            empresa.nombre_empresa.toLowerCase().includes(search) ||
            empresa.descripcion_empresa.toLowerCase().includes(search)
          );
        }
  
        if (sortBy.value) {
          result.sort((a, b) => {
            if (a[sortBy.value] < b[sortBy.value]) return -1;
            if (a[sortBy.value] > b[sortBy.value]) return 1;
            return 0;
          });
        }
  
        filteredEmpresas.value = result;
      };
  
      const openModal = (mode, empresa = null) => {
        modalMode.value = mode;
        form.value = empresa
          ? { ...empresa }
          : {
              id: null,
              nombre_empresa: "",
              descripcion_empresa: "",
              historia_empresa: "",
              mision_empresa: "",
              vision_empresa: "",
              ubicacion_empresa: "",
              celular_empresa: "",
              email_empresa: "",
            };
        showModal.value = true;
      };
  
      const closeModal = () => {
        showModal.value = false;
      };
  
      const saveEmpresa = async () => {
        try {
          const url =
            modalMode.value === "create"
              ? "http://localhost:8080/administracion/empresas/"
              : `http://localhost:8080/administracion/empresas/${form.value.id}`;
              //? "https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/"
              //: `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/${form.value.id}`;
  
          const method = modalMode.value === "create" ? "post" : "put";
  
          await axios[method](url, { ...form.value });
  
          Swal.fire("Éxito", "Empresa guardada correctamente", "success");
          getEmpresas();
          closeModal();
        } catch (error) {
          Swal.fire("Error", "No se pudo guardar la empresa", "error");
        }
      };
  
      const deleteEmpresa = async id => {
        try {
          const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
          });
  
          if (result.isConfirmed) {
            await axios.delete(`http://localhost:8080/administracion/empresas/${id}`);
            // await axios.delete(`https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/${id}`);
            Swal.fire("Éxito", "Empresa eliminada correctamente", "success");
            getEmpresas();
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar la empresa", "error");
        }
      };
  
      onMounted(() => {
        getEmpresas();
      });
  
      return {
        empresas,
        filteredEmpresas,
        form,
        modalMode,
        showModal,
        searchTerm,
        sortBy,
        openModal,
        closeModal,
        saveEmpresa,
        deleteEmpresa,
        applyFilters,
      };
    },
  };
  </script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.table {
  transition: all 0.3s ease;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 0.5rem;
  pointer-events: none;
  transform: translate(0, 0);
  transition: transform 0.3s ease-out;
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: 500px;
    margin: 1.75rem auto;
  }
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}
</style>