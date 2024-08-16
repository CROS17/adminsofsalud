<script setup>
import { ref, onMounted, computed } from 'vue';
import { useInvoiceStore } from '../../stores/invoiceStore';
import { Edit, Delete, Printer } from "@element-plus/icons-vue";
import InvoiceModal from "../../components/invoice/InvoiceForm.vue";

const useInvoice = useInvoiceStore();
const invoices = computed(() => useInvoice.invoices)
const form = ref({});

const showModal = ref(false);

const openModal = async (data) => {
  form.value = data ? { ...data } : {};
  showModal.value = true;
}

const close = () => {
  showModal.value = false;
};

onMounted(async () => {
  await useInvoice.getInvoices();
});
</script>

<template>
  <InvoiceModal v-if="showModal" :show-modal="showModal" :form="form" @close="close" />
  <div class="row">
    <div class="col-md-6 text-right">
      <h3>Facturas</h3>
    </div>
    <div class="col-md-6 text-end">
      <button @click.prevent="openModal" class="btn btn-success ">
        Registrar factura
      </button>
    </div>
  </div>

  <table class="table table-hover table-striped">
    <thead>
      <tr>
        <th>#</th>
        <th>Número</th>
        <th>Fecha de Emisión</th>
        <th>Subtotal</th>
        <th>IGV</th>
        <th>Total</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
       <tr v-for="(row, index) in invoices" :key="index">
          <th>{{ index + 1 }}</th>
          <td>{{ row.invoice_number }}</td>
          <td>{{ row.issue_date }}</td>
          <td>{{ row.subtotal }}</td>
          <td>{{ row.igv }}</td>
          <td>{{ row.total }}</td>
          <td>
            <el-button type="primary" :icon="Edit" circle size="small" @click="openModal(row)" />
            <el-button type="danger" :icon="Delete" circle size="small" @click="useInvoice.deleteData(row.id)" />
            <el-button type="info" :icon="Printer" circle size="small" @click="useInvoice.pdfView(row.id)" />
          </td>
        </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
