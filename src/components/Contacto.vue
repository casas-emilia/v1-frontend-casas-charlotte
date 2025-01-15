<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Ubicacion from '@/components/Ubicacion.vue';

const email = ref('');
const address = ref('');
const phone = ref('');
const showCopyMessage = ref(false);
const coverImageSrc = ref('/img/contacto.png');

// Abrir WhatsApp con un mensaje predeterminado
const openWhatsApp = () => {
    const message = encodeURIComponent('Hola, me gustaría obtener más información.');
    window.open(`https://wa.me/${phone.value}?text=${message}`, '_blank');
};

// Copiar email al portapapeles
const copyEmail = () => {
    navigator.clipboard.writeText(email.value).then(() => {
        showCopyMessage.value = true;
        setTimeout(() => (showCopyMessage.value = false), 2000);
    });
};

// Obtener datos de contacto
const fetchContactData = async () => {
    try {
        const { data } = await axios.get('/empresas/1');
        const { email_empresa, ubicacion_empresa, celular_empresa } = data.empresa;
        email.value = email_empresa;
        address.value = ubicacion_empresa;
        phone.value = celular_empresa;
    } catch (error) {
        console.error('Error al obtener los datos de contacto:', error);
    }
};

onMounted(() => {
    fetchContactData();
});
</script>

<template>
    <!-- Portada -->
    <section class="hero-section">
        <div class="position-relative overflow-hidden">
            <img :src="coverImageSrc" class="img-fluid w-100" alt="Imagen de portada"
                style="max-height: 60vh; object-fit: cover; filter: brightness(0.7);">
            <div class="position-absolute top-50 start-50 translate-middle text-center text-white">
                <h1 class="display-3 fw-bold mb-4 animate__animated animate__fadeInDown" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    Contáctanos
                </h1>
            </div>
        </div>
    </section>

    <!-- Ubicacion -->
    <section>
        <Ubicacion></Ubicacion>
    </section>

    <section class="contact-section py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-lg animate__animated animate__fadeInUp">
                        <div class="card-body">
                            <h2 class="section-title text-center mb-4">Nuestros medios</h2>
                            <div class="contact-info">
                                <div class="mb-3 d-flex align-items-center">
                                    <i class="fas fa-envelope fa-fw text-primary"></i>
                                    <span>{{ email }}</span>
                                    <button @click="copyEmail" class="btn btn-sm btn-outline-primary ms-2">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                                <div class="mb-3 d-flex align-items-center">
                                    <i class="fas fa-map-marker-alt fa-fw text-primary"></i>
                                    <span>{{ address }}</span>
                                </div>
                                <div class="mb-3 d-flex align-items-center">
                                    <i class="fas fa-phone fa-fw text-primary"></i>
                                    <span>{{ phone }}</span>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <button @click="openWhatsApp" class="btn btn-success btn-lg animate__animated animate__pulse animate__infinite">
                                    <i class="fab fa-whatsapp me-2"></i>Enviar mensaje por WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Mensaje de copiado -->
        <div v-if="showCopyMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
            <div class="alert alert-success animate__animated animate__fadeInUp" role="alert">
                E-mail copiado
            </div>
        </div>
    </section>
</template>

<style scoped>
:root {
  --primary-color: #23ccc8;
  --secondary-color: #097b7a;
  --accent-color: #ef6e01;
  --text-color: #333333;
  --light-bg: #f8f9fa;
  --dark-bg: #343a40;
}

.hero-section {
    position: relative;
}

.contact-section {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhmOWZhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U5ZWNlZiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMCA4NEwyOCAxMDBMNTYgODRMNTYgNTBMMjggMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U5ZWNlZiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==');
    background-size: 56px 100px;
    animation: backgroundScroll 20s linear infinite;
}

@keyframes backgroundScroll {
    from {background-position: 0 0;}
    to {background-position: 0 100%;}
}

.card {
    border-radius: 15px;
    overflow: hidden;
    transition: all 0.3s ease;
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    backdrop-filter: blur(10px);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(35, 204, 200, 0.2);
}

.contact-info div {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.contact-info i {
    width: 30px;
    text-align: center;
    margin-right: 10px;
    color: var(--primary-color);
}

.btn-success {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
    transition: all 0.3s ease;
}

.btn-success:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    transform: scale(1.05);
}

.btn-outline-primary {
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-outline-primary:hover {
    background-color: var(--primary-color);
    color: #ffffff;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--secondary-color);
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.alert-success {
    background-color: var(--primary-color);
    color: #ffffff;
    border-color: var(--secondary-color);
}

.text-primary {
    color: var(--primary-color) !important;
}
</style>