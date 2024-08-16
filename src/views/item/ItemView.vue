<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "../../stores/itemStore";
import { Edit, Delete } from "@element-plus/icons-vue";
import ProductModal from "../../components/item/ItemForm.vue";

const useProduct = useProductStore();

const products = computed(() => useProduct.products);

const form = ref({});

const showModal = ref(false);

const openModal = async (data) => {
  form.value = data ? { ...data } : {};
  showModal.value = true;
}

const close = () => {
  showModal.value = false;
};

const deleteData = async (id) => {
  await useProduct.deleteData(id);
};

onMounted(async () => {
  await useProduct.getProducts();
});
</script>

<template>
  <ProductModal v-if="showModal" :show-modal="showModal" :form="form" @close="close"></ProductModal>
  
  <div class="row">
    <div class="col-md-6 text-right">
      <h3>Productos</h3>
    </div>
    <div class="col-md-6 text-end">
      <button @click="openModal" class="btn btn-success ">
        Registrar
      </button>
    </div>
  </div>

  <table class="table table-hover table-striped">
    <thead>
      <tr>
        <th>#</th>
        <th>Codigo</th>
        <th>Descripción</th>
        <th>Precio</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in products" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ row.code }}</td>
        <td>{{ row.description }}</td>
        <td>{{ row.price }}</td>
        <td>
          <el-button type="primary" :icon="Edit" circle size="small" @click="openModal(row)" />
          <el-button type="danger" :icon="Delete" circle size="small" @click="deleteData(row.id)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style>
.btn-success {
  background-color: #1FBF84;
  color: #fff;
  border-color: #1FBF84;
}
</style>