<template>
    <div class="container-fluid py-4 bg-light">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card shadow-sm">
            <div class="card-body">
              <h1 class="text-center mb-4 text-primary">Administrar Estilos</h1>
  
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
                    <option value="nombre_estilo">Nombre</option>
                    <option value="descripcion_estilo">Descripción</option>
                  </select>
                </div>
              </div>
  
              <!-- Botón para abrir el modal de crear -->
              <button
                class="btn btn-success mb-3"
                @click="openModal('create')"
              >
                <i class="fas fa-plus-circle me-2"></i> Crear Estilo
              </button>
  
              <!-- Tabla de Estilos -->
              <div v-if="filteredEstilos.length > 0" class="table-responsive">
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
                    <tr v-for="estilo in filteredEstilos" :key="estilo.id">
                      <td>{{ estilo.id }}</td>
                      <td>{{ estilo.nombre_estilo }}</td>
                      <td>{{ estilo.descripcion_estilo }}</td>
                      <td>
                        <button
                          class="btn btn-primary btn-sm me-2"
                          @click="openModal('edit', estilo)"
                        >
                          <i class="fas fa-edit me-1"></i> Editar
                        </button>
                        <button
                          class="btn btn-danger btn-sm"
                          @click="deleteEstilo(estilo.id)"
                        >
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
                          {{ modalMode === 'create' ? 'Crear Estilo' : 'Editar Estilo' }}
                        </h5>
                        <button
                          type="button"
                          class="btn-close btn-close-white"
                          @click="closeModal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <form @submit.prevent="saveEstilo">
                          <div class="mb-3">
                            <label for="nombreEstilo" class="form-label">Nombre</label>
                            <input
                              v-model="form.nombre_estilo"
                              type="text"
                              id="nombreEstilo"
                              class="form-control"
                              placeholder="Ingrese el nombre del estilo"
                              required
                            />
                          </div>
                          <div class="mb-3">
                            <label for="descripcionEstilo" class="form-label">Descripción</label>
                            <textarea
                              v-model="form.descripcion_estilo"
                              id="descripcionEstilo"
                              class="form-control"
                              rows="3"
                              placeholder="Ingrese la descripción"
                              required
                            ></textarea>
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
  import { ref, computed, onMounted } from "vue";
  import axios from "axios";
  import Swal from "sweetalert2";
  
  export default {
    setup() {
      const estilos = ref([]);
      const filteredEstilos = ref([]);
      const modalMode = ref("create");
      const showModal = ref(false);
      const form = ref({
        id: null,
        nombre_estilo: "",
        descripcion_estilo: "",
      });
      const searchTerm = ref("");
      const sortBy = ref("");
  
      const getEstilos = async () => {
        try {
          const response = await axios.get("/administracion/estilos/");
          // const response = await axios.get("https://v1backendcasasamilia-production.up.railway.app/administracion/estilos/");
          estilos.value = response.data.estilos;
          applyFilters();
        } catch (error) {
          Swal.fire("Error", "No se pudo cargar los estilos", "error");
        }
      };
  
      const applyFilters = () => {
        let result = [...estilos.value];
  
        if (searchTerm.value) {
          const search = searchTerm.value.toLowerCase();
          result = result.filter(estilo =>
            estilo.nombre_estilo.toLowerCase().includes(search) ||
            estilo.descripcion_estilo.toLowerCase().includes(search)
          );
        }
  
        if (sortBy.value) {
          result.sort((a, b) => {
            if (a[sortBy.value] < b[sortBy.value]) return -1;
            if (a[sortBy.value] > b[sortBy.value]) return 1;
            return 0;
          });
        }
  
        filteredEstilos.value = result;
      };
  
      const openModal = (mode, estilo = null) => {
        modalMode.value = mode;
        form.value = estilo
          ? { ...estilo }
          : { id: null, nombre_estilo: "", descripcion_estilo: "" };
        showModal.value = true;
      };
  
      const closeModal = () => {
        showModal.value = false;
      };
  
      const saveEstilo = async () => {
        try {
          const url =
            modalMode.value === "create"
              ? "/administracion/estilos/"
              : `/administracion/estilos/${form.value.id}`;
              //? "https://v1backendcasasamilia-production.up.railway.app/administracion/estilos/"
              //: `https://v1backendcasasamilia-production.up.railway.app/administracion/estilos/${form.value.id}`;
  
          const method = modalMode.value === "create" ? "post" : "put";
  
          await axios[method](url, {
            nombre_estilo: form.value.nombre_estilo,
            descripcion_estilo: form.value.descripcion_estilo,
          });
  
          Swal.fire("Éxito", `Estilo ${modalMode.value === "create" ? "creado" : "actualizado"} correctamente`, "success");
          getEstilos();
          closeModal();
        } catch (error) {
          Swal.fire("Error", "No se pudo guardar el estilo", "error");
        }
      };
  
      const deleteEstilo = async (id) => {
        try {
          const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
          });
  
          if (result.isConfirmed) {
            await axios.delete(`/administracion/estilos/${id}`);
            //await axios.delete(`https://v1backendcasasamilia-production.up.railway.app/administracion/estilos/${id}`);
            Swal.fire("Eliminado", "El estilo ha sido eliminado", "success");
            getEstilos();
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el estilo", "error");
        }
      };
  
      onMounted(() => {
        getEstilos();
      });
  
      return {
        estilos,
        filteredEstilos,
        form,
        modalMode,
        showModal,
        searchTerm,
        sortBy,
        openModal,
        closeModal,
        saveEstilo,
        deleteEstilo,
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
  