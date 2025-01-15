<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const navItems = ref([
    { text: 'Nosotros', route: 'nosotros', icon: 'fas fa-info-circle' },
    { text: 'Prefabricadas', route: 'prefabricadas', icon: 'fas fa-home', highlight: true },
    { text: 'Contacto', route: 'contactos', icon: 'fas fa-envelope' },
    { text: 'Portafolio', route: 'blog', icon: 'fas fa-briefcase' }
])

const isNavbarOpen = ref(false)

const toggleNavbar = () => {
    isNavbarOpen.value = !isNavbarOpen.value
}

const closeNavbar = () => {
    isNavbarOpen.value = false
}
</script>

<template>
    <nav class="navbar navbar-expand-lg bg-white">
        <div class="container">
            <RouterLink :to="{ name: 'home' }" class="navbar-brand fw-bold fs-4"
                style="color: #0f2b5e; font-family: 'Cabin', sans-serif;">
                <img src="/img/logo_casas_charlotte.png" alt="home" width="110" height="70">
            </RouterLink>
            <button class="navbar-toggler custom-toggler" type="button" @click="toggleNavbar"
                aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div :class="['collapse navbar-collapse', { 'show': isNavbarOpen }]" id="navbarSupportedContent" style="font-family: 'Cabin', sans-serif;">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li v-for="(item, index) in navItems" :key="index" class="nav-item mx-2">
                        <RouterLink :to="{ name: item.route }" 
                            :class="['nav-link active fw-bold nav-item-hover d-flex align-items-center', 
                                     {'highlight-nav-item': item.highlight}]"
                            @click="closeNavbar">
                            <i :class="[item.icon, 'me-2']"></i>
                            {{ item.text }}
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.nav-item-hover {
    transition: all 0.3s ease;
    padding: 8px 15px;
}

.nav-item-hover:hover {
    background-color: darkorange;
    color: #ffffff !important;
    border-radius: 5px;
}

.highlight-nav-item {
    /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); */
    background: linear-gradient(
    -45deg,
    #23ccc8, /* Color principal 1 */
    #4de6e2, /* Color más claro */
    #1ca39f, /* Intermedio */
    #097b7a, /* Color principal 2 */
    #045c5b, /* Más oscuro */
    #11b2af  /* Saturado */
  );
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    color: #ffffff !important;
    padding: 8px 15px;
    border-radius: 25px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
}

.highlight-nav-item:hover {
    animation: gradient 5s ease infinite;
    transform: scale(1.1);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.custom-toggler .navbar-toggler-icon {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(0, 123, 255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
}

.custom-toggler.navbar-toggler {
    border-color: #ffffff;
}

@media (max-width: 991.98px) {
    .navbar-collapse {
        transition: max-height 0.3s ease-in-out;
        max-height: 0;
        overflow: hidden;
    }

    .navbar-collapse.show {
        max-height: 100vh;
    }
}
</style>

