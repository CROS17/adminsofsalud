<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <div class="container">
        <header class="bg-success">
            <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                <a href="/" class="d-flex align-items-center link-body-emphasis text-decoration-none">
                    <span class="fs-4 text-white m-2">SofSalud 360</span>
                </a>
                <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                    <RouterLink to="/" class="me-3 py-2 link-body-emphasis text-decoration-none text-white">
                        <span>Inicio</span></RouterLink>
                    <RouterLink to="/items" class="me-3 py-2 link-body-emphasis text-decoration-none text-white">
                        <span>Productos</span></RouterLink>
                    <RouterLink to="/invoices" class="me-3 py-2 link-body-emphasis text-decoration-none text-white">
                        <span>Facturas</span></RouterLink>
                </nav>
            </div>
        </header>
        <main>
            <RouterView />
        </main>
    </div>
</template>

<style scoped></style>