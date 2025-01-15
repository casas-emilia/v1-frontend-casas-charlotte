<template>
    <div class="news-management container py-5">
      <h1 class="mb-4">Administración Noticias</h1>
  
      <!-- News Table -->
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="mb-0">Noticias</h2>
          <button @click="openNewsModal()" class="btn btn-success">
            <i class="fas fa-plus me-2"></i> Agregar nueva noticia
          </button>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else-if="news.length === 0" class="text-center py-4 text-muted">
            No se encontraron articulos.
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Titulo</th>
                    <th>Contenido</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="article in news" :key="article.id">
                    <td>{{ article.titulo_noticia }}</td>
                    <td>
                      <div class="text-truncate" style="max-width: 200px;">{{ article.desarrollo_noticia }}</div>
                    </td>
                    <td>{{ formatDate(article.created_at) }}</td>
                    <td>
                      <button @click="viewArticle(article)" class="btn btn-sm btn-outline-primary me-2">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button @click="openNewsModal(article)" class="btn btn-sm btn-outline-success me-2">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteArticle(article.id)" class="btn btn-sm btn-outline-danger">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination -->
            <nav aria-label="Page navigation" class="mt-4">
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
        </div>
      </div>
  
      <!-- News Modal -->
      <div v-if="showNewsModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar Noticia' : 'Agregar nueva noticia' }}</h5>
            <button type="button" class="btn-close" @click="closeNewsModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitArticle">
              <!-- ... (previous form fields remain unchanged) ... -->
              <div class="text-end">
                <button type="button" @click="closeNewsModal" class="btn btn-secondary me-2" :disabled="isSubmitting">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isSubmitting ? 'Procesando...' : (isEditing ? 'Actualizar Noticia' : 'Agregar Noticia') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  
      <!-- View Article Modal -->
      <div v-if="showViewModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ viewingArticle.titulo_noticia }}</h5>
              <button type="button" class="btn-close" @click="closeViewModal"></button>
            </div>
            <div class="modal-body">
              <p>{{ viewingArticle.desarrollo_noticia }}</p>
              <h6 class="mt-4 mb-3">Imagenes</h6>
              <div class="row g-3">
                <div v-for="image in articleImages[viewingArticle.id]" :key="image.id" class="col-md-4">
                  <div class="position-relative">
                    <img :src="image.image" :alt="viewingArticle.titulo_noticia" class="img-fluid rounded">
                    <button @click="deleteImage(viewingArticle.id, image.id)" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="closeViewModal" class="btn btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal Backdrop -->
      <div v-if="showNewsModal || showViewModal" class="modal-backdrop fade show"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive, computed } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  const news = ref([]);
  const articleImages = reactive({});
  const currentArticle = ref({ titulo_noticia: '', desarrollo_noticia: '' });
  const isEditing = ref(false);
  const selectedFile = ref(null);
  const loading = ref(true);
  const showNewsModal = ref(false);
  const showViewModal = ref(false);
  const viewingArticle = ref({});

  const isSubmitting = ref(false);
  
  // Pagination
  const currentPage = ref(1);
  const totalItems = ref(0);
  const itemsPerPage = ref(12);
  
  const empresaId = 1; // Replace with actual empresa ID
  const baseUrl = `https://v1-backend-casas-charlotte-production.up.railway.app/administracion/empresas/${empresaId}/noticiasEmpresa`;
  //const baseUrl = `https://v1backendcasasamilia-production.up.railway.app/administracion/empresas/${empresaId}/noticiasEmpresa`;
  
  onMounted(async () => {
    await fetchNews();
  });
  
  const fetchNews = async () => {
    loading.value = true;
    try {
      const response = await axios.get(`${baseUrl}/`, {
        params: {
          page: currentPage.value,
          limit: itemsPerPage.value
        }
      });
      news.value = response.data.noticias;
      totalItems.value = response.data.pagination.total;
      itemsPerPage.value = response.data.pagination.limit;
      await fetchImagesForArticles();
    } catch (error) {
      console.error('Error fetching news:', error);
      showError('Failed to fetch news articles');
    } finally {
      loading.value = false;
    }
  };
  
  const fetchImagesForArticles = async () => {
    for (const article of news.value) {
      try {
        const response = await axios.get(`${baseUrl}/${article.id}/imagenesNoticiasEmpresa/`);
        articleImages[article.id] = response.data.imagenes_noticia;
      } catch (error) {
        console.error(`Error fetching images for article ${article.id}:`, error);
      }
    }
  };
  
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
  
  const changePage = async (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      await fetchNews();
    }
  };
  
  const openNewsModal = (article = null) => {
    if (article) {
      currentArticle.value = { ...article };
      isEditing.value = true;
    } else {
      currentArticle.value = { titulo_noticia: '', desarrollo_noticia: '' };
      isEditing.value = false;
    }
    selectedFile.value = null;
    showNewsModal.value = true;
  };
  
  const closeNewsModal = () => {
    showNewsModal.value = false;
    resetForm();
  };
  
  const submitArticle = async () => {
  isSubmitting.value = true;
  try {
    let articleId;
    if (isEditing.value) {
      await axios.put(`${baseUrl}/${currentArticle.value.id}`, currentArticle.value);
      articleId = currentArticle.value.id;
      showSuccess('Noticia actualizada exitosamente');
    } else {
      const response = await axios.post(`${baseUrl}/`, currentArticle.value);
      articleId = response.data.noticia.id;
      showSuccess('Noticia agregada exitosamente');
    }
    
    if (selectedFile.value && selectedFile.value.length > 0) {
      await uploadImages(articleId);
    }
    
    await fetchNews();
    closeNewsModal();
  } catch (error) {
    console.error('Error submitting article:', error);
    showError('Failed to submit article');
  } finally {
    isSubmitting.value = false;
  }
};
  
  const deleteArticle = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Esta seguro/a que desea eliminar?',
        text: "No se podra recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo eliminar'
      });
  
      if (result.isConfirmed) {
        await axios.delete(`${baseUrl}/${id}`);
        await fetchNews();
        showSuccess('Noticia eliminada exitosamente');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      showError('Error al tratar de eliminar');
    }
  };
  
  const handleImageUpload = (event) => {
    selectedFile.value = Array.from(event.target.files);
  };
  
  const uploadImages = async (articleId) => {
  const uploadPromises = selectedFile.value.map(file => {
    const formData = new FormData();
    formData.append('image', file);
    return axios.post(`${baseUrl}/${articleId}/imagenesNoticiasEmpresa/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  });

  try {
    await Promise.all(uploadPromises);
    showSuccess('Images uploaded successfully');
  } catch (error) {
    console.error('Error uploading images:', error);
    showError('Failed to upload one or more images');
  }
};
  
  const viewArticle = (article) => {
    viewingArticle.value = article;
    showViewModal.value = true;
  };
  
  const closeViewModal = () => {
    showViewModal.value = false;
  };
  
  const deleteImage = async (articleId, imageId) => {
    try {
      const result = await Swal.fire({
        title: 'Esta seguro/a que desea eliminar?',
        text: "No se podra revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo eliminar'
      });
  
      if (result.isConfirmed) {
        await axios.delete(`${baseUrl}/${articleId}/imagenesNoticiasEmpresa/${imageId}`);
        await fetchImagesForArticles();
        showSuccess('Imagen eliminada exitosamente');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showError('Error al tratar de eliminar imagen');
    }
  };
  
  const resetForm = () => {
    currentArticle.value = { titulo_noticia: '', desarrollo_noticia: '' };
    isEditing.value = false;
    selectedFile.value = null;
  };
  
  const showSuccess = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
  };
  
  const showError = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  </script>
  
  <style scoped>
/*   @import '@fortawesome/fontawesome-free/css/all.css'; */
  
  .modal {
    background-color: rgba(0, 0, 0, 0.5);
  }
  </style>
  
  