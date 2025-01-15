<template>
    <div class="container-fluid py-4 bg-light">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card shadow-sm">
            <div class="card-body">
              <h1 class="text-center mb-4 text-primary">Administrar Categorías y Tipos</h1>

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
                    <option value="nombre_categoria">Nombre</option>
                    <option value="descripcion_categoria">Descripción</option>
                  </select>
                </div>
              </div>

              <!-- Botón para abrir el modal de crear -->
              <button class="btn btn-success mb-3" @click="openModal('create')">
                <i class="fas fa-plus-circle me-2"></i> Crear Categoría
              </button>

              <!-- Tabla de Categorías -->
              <div v-if="filteredCategorias.length > 0" class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Tipos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="categoria in filteredCategorias" :key="categoria.id">
                      <td>{{ categoria.id }}</td>
                      <td>{{ categoria.nombre_categoria }}</td>
                      <td>{{ categoria.descripcion_categoria }}</td>
                      <td>
                        <ul>
                          <li v-for="tipo in categoria.tipos" :key="tipo.tipo_id">
                            {{ tipo.material_estructura }}
                          </li>
                        </ul>
                      </td>
                      <td>
                        <button class="btn btn-primary btn-sm me-2" @click="openModal('edit', categoria)">
                          <i class="fas fa-edit me-1"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm" @click="deleteCategoria(categoria.id)">
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
                          {{ modalMode === 'create' ? 'Crear Categoría' : 'Editar Categoría' }}
                        </h5>
                        <button
                          type="button"
                          class="btn-close btn-close-white"
                          @click="closeModal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <form @submit.prevent="saveCategoria">
                          <div class="mb-3">
                            <label for="nombreCategoria" class="form-label">Nombre</label>
                            <input
                              v-model="form.nombre_categoria"
                              type="text"
                              id="nombreCategoria"
                              class="form-control"
                              placeholder="Ingrese el nombre de la categoría"
                              required
                            />
                          </div>
                          <div class="mb-3">
                            <label for="descripcionCategoria" class="form-label">Descripción</label>
                            <textarea
                              v-model="form.descripcion_categoria"
                              id="descripcionCategoria"
                              class="form-control"
                              rows="3"
                              placeholder="Ingrese la descripción de la categoría"
                              required
                            ></textarea>
                          </div>
                          <div class="mb-3">
                            <label for="tiposCategoria" class="form-label">Tipos</label>
                            <ul class="list-unstyled">
                            <li v-for="(tipo, index) in form.tipos" :key="index">
                                <div class="input-group mb-2">
                                <select
                                    v-model="tipo.id"
                                    @change="handleTipoChange(index)"
                                    class="form-select"
                                    required
                                >
                                    <option value="" disabled>Seleccione un tipo</option>
                                    <option
                                    v-for="tipoDisponible in tiposDisponibles"
                                    :key="tipoDisponible.id"
                                    :value="tipoDisponible.id"
                                    >
                                    {{ tipoDisponible.material_estructura }}
                                    </option>
                                </select>
                                <button
                                    class="btn btn-outline-danger"
                                    @click="removeTipo(index)"
                                    type="button"
                                >
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                </div>
                            </li>
                            </ul>
                            <button
                            class="btn btn-outline-secondary btn-sm"
                            @click="addTipo"
                            type="button"
                            >
                            <i class="fas fa-plus"></i> Agregar Tipo
                            </button>

                            <router-link to="/administracionTipos" class="btn btn-link mt-2">
                              <i class="fas fa-plus-circle"></i> Crear Nuevo Tipo
                            </router-link>
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
import { reactive } from "vue";
import { useRouter } from "vue-router"; // Importar vue-router para la navegación

export default {
  setup() {
    const categorias = ref([]);
    const filteredCategorias = ref([]);
    const modalMode = ref("create");
    const showModal = ref(false);
    const tiposDisponibles = ref([]); // Almacenar tipos disponibles
    const form = reactive({
      id: null,
      nombre_categoria: "",
      descripcion_categoria: "",
      tipos: [],
    });

    const searchTerm = ref("");
    const sortBy = ref("");

    const router = useRouter(); // Usar vue-router para redirigir

    // Cargar tipos disponibles
    const getTiposDisponibles = async () => {
      try {
        const response = await axios.get("/administracion/tipos/");
        // const response = await axios.get("https://v1backendcasasamilia-production.up.railway.app/administracion/tipos/");
        tiposDisponibles.value = response.data["tipos"];
      } catch (error) {
        console.error("Error al cargar los tipos disponibles:", error);
        Swal.fire("Error", "No se pudo cargar la lista de tipos", "error");
      }
    };

    // Abrir el modal en modo "crear" o "editar"
    const openModal = (mode, categoria = null) => {
        modalMode.value = mode;

        if (categoria) {
            form.id = categoria.id;
            form.nombre_categoria = categoria.nombre_categoria;
            form.descripcion_categoria = categoria.descripcion_categoria;
            
            // Cargar los tipos asociados con la categoría de manera correcta
            form.tipos = categoria.tipos ? categoria.tipos.map(tipo => ({
            id: tipo.tipo_id,  // Asegúrate de que estamos cargando correctamente el `id` del tipo
            material_estructura: tipo.material_estructura,  // También cargar el atributo que quieres mostrar
            })) : [];
        } else {
            form.id = null;
            form.nombre_categoria = "";
            form.descripcion_categoria = "";
            form.tipos = [];
        }

        showModal.value = true;
    };

    // Cerrar el modal
    const closeModal = () => {
      showModal.value = false;
    };

    // Agregar un tipo al formulario (siempre permite agregar un nuevo dropdown vacío)
    const addTipo = () => {
    form.tipos.push({ id: null }); // Agregar un tipo con `id: null` (nuevo dropdown vacío)
    };

    // Validar duplicados al seleccionar un tipo
    const handleTipoChange = (index) => {
    const tipoSeleccionado = form.tipos[index]; // Obtener el tipo seleccionado
    if (!tipoSeleccionado.id) return; // Si no hay selección, no validamos

    // Verificar si el tipo ya está en la lista (excepto el dropdown actual)
    const duplicado = form.tipos.some((tipo, i) => i !== index && tipo.id === tipoSeleccionado.id);

    if (duplicado) {
        Swal.fire("Error", "Este tipo ya está agregado a la categoría", "warning");
        form.tipos[index].id = null; // Resetear el dropdown duplicado
    }
    };








    // Eliminar un tipo del formulario
    const removeTipo = (index) => {
      form.tipos.splice(index, 1);
    };

    // Guardar la categoría (crear o actualizar)
    const saveCategoria = async () => {
      try {
        const url =
          modalMode.value === "create"
            ? "/administracion/categorias/"
            : `/administracion/categorias/${form.id}`;

        const method = modalMode.value === "create" ? "post" : "put";

        const tiposCategoria = form.tipos.map(tipo => ({
          tipo_id: tipo.id,  // Solo los IDs de los tipos
        }));

        await axios[method](url, {
          nombre_categoria: form.nombre_categoria,
          descripcion_categoria: form.descripcion_categoria,
          tipos: tiposCategoria, // Enviar los tipos seleccionados
        });

        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: `Categoría ${modalMode.value === "create" ? "creada" : "actualizada"} correctamente`,
          showConfirmButton: false,
          timer: 1500,
        });
        getCategorias();
        closeModal();
      } catch (error) {
        console.error("Error al guardar la categoría:", error);
        Swal.fire("Error", "No se pudo guardar la categoría", "error");
      }
    };

    // Eliminar una categoría
    const deleteCategoria = async (id) => {
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
          await axios.delete(`/administracion/categorias/${id}`);
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "La categoría ha sido eliminada",
            showConfirmButton: false,
            timer: 1500,
          });
          getCategorias();
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar la categoría", "error");
      }
    };

    // Obtener las categorías
    const getCategorias = async () => {
      try {
        const response = await axios.get("/administracion/categorias/");
        // const response = await axios.get("https://v1backendcasasamilia-production.up.railway.app/administracion/categorias/");
        categorias.value = response.data.categorias;
        applyFilters();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar las categorías", "error");
      }
    };

    const applyFilters = () => {
      let result = [...categorias.value];

      if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase();
        result = result.filter(categoria =>
          categoria.nombre_categoria.toLowerCase().includes(search) ||
          categoria.descripcion_categoria.toLowerCase().includes(search)
        );
      }

      if (sortBy.value) {
        result.sort((a, b) => {
          if (a[sortBy.value] < b[sortBy.value]) return -1;
          if (a[sortBy.value] > b[sortBy.value]) return 1;
          return 0;
        });
      }

      filteredCategorias.value = result;
    };

    onMounted(() => {
      getCategorias();
      getTiposDisponibles();
    });

    return {
      categorias,
      filteredCategorias,
      form,
      modalMode,
      showModal,
      searchTerm,
      sortBy,
      openModal,
      closeModal, // Asegúrate de devolver la función closeModal
      saveCategoria,
      deleteCategoria, // Asegúrate de devolver deleteCategoria aquí
      applyFilters,
      addTipo,
      removeTipo,
      tiposDisponibles,
      router, // Usar vue-router para navegación
      handleTipoChange,
    };
  },
};
</script>



  <style scoped>
  .table th, .table td {
    vertical-align: middle;
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1050;
  }
  
  .btn-close-white {
    background-color: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
  }
  
  .alert {
    font-size: 1rem;
  }
  </style>
  