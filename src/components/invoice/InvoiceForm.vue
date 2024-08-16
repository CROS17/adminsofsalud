<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from "axios";
import { useInvoiceStore } from "../../stores/invoiceStore";
import { useProductStore } from "../../stores/itemStore";
import { ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";

const useInvoice = useInvoiceStore();
const useProduct = useProductStore();

const products = computed(() => useProduct.products);

const props = defineProps({
    showModal: {
        type: Boolean,
        required: true,
    },
    form: {
        type: Object,
    }
});

const emit = defineEmits(["close"]);
const form = computed(() => props.form);

const formItem = ref({
    item_id: null,
    quantity: 1,
    unit_price: 0,
});

const IGV_RATE = 0.18;

const resetForm = () => {
    formItem.value.item_id = null;
    formItem.value.quantity = 1;
    formItem.value.unit_price = 0;
};

const calculateTotals = computed(() => {
    if (!form.value.items || !Array.isArray(form.value.items)) {
        return {
            subtotal: '0.00',
            igv: '0.00',
            total: '0.00',
        };
    }

    const total = form.value.items.reduce((sum, item) => {
        return sum + item.total;
    }, 0);
    
    const igv = total * IGV_RATE;
    const subtotal = total - igv;

    form.value.subtotal = subtotal;
    form.value.igv = igv;
    form.value.total = total;

   return {
        subtotal: Number(subtotal).toFixed(2),
        igv: Number(igv).toFixed(2),
        total: Number(total).toFixed(2),
    };

});


const submit = async () => {
    let response;
    try {
        if (!!form.value.id) {
            (response = await axios.patch(`${import.meta.env.VITE_APP_URL}/invoice/${form.value.id}`, form.value));
        } else {
            (response = await axios.post(`${import.meta.env.VITE_APP_URL}/invoice`, form.value));
        }
        if (response.data?.success) {
            ElMessage.success(response.data.message);
            await useInvoice.getInvoices();
            await close();
            await useInvoice.pdfView(response.data.data);
        }
    } catch (ex) {
        
        let error = ex.response.data;
        const errors = Object.values(error.errors).flatMap(
            (errorArray) => errorArray
        );

        ElMessage.error({
            dangerouslyUseHTMLString: true,
            message: errors.join("<br><br>"),
        });
    }
}

const changeProduct = async (id) => {
    const product = products.value.find((el) => el.id == id);

    if (product) {
        formItem.value.quantity = 1;
        formItem.value.unit_price = product.price;
    } else {
        resetForm();
    }
}

const updateTotals = () => {
    
    if (!form.value.items || !Array.isArray(form.value.items)) {
        form.value.subtotal = 0;
        form.value.igv = 0;
        form.value.total = 0;
        return;
    }

    const total = form.value.items.reduce((sum, item) => {
        return sum + (Number(item.total) || 0);
    }, 0);
    
    const igv = total * IGV_RATE;
    const subtotal = total - igv;

    form.value.subtotal = subtotal;
    form.value.igv = igv;
    form.value.total = total;
};


const addProduct = () => {
    if (!form.value.items) {
        form.value.items = [];
    }

    if(!formItem.value.item_id){
        ElMessage.warning("Agregar datos de producto");
        return false;
    }

     if(Number(formItem.value.unit_price) < 1 ){
        ElMessage.warning("Precio mayor a 0");
        return false;
    }

    form.value.items.push({
        item_id: formItem.value.item_id,
        quantity: Number(formItem.value.quantity),
        unit_price: Number(formItem.value.unit_price).toFixed(2),
        total: Number(formItem.value.quantity) * Number(formItem.value.unit_price).toFixed(2),
    });

    updateTotals();    
    resetForm();
}


const deleteData = (index) => {
    form.value.items.splice(index, 1);
    updateTotals();
}


const close = async () => {
    emit('close');
    useInvoice.resetForm();
}

onMounted(async () => {
    useProduct.getProducts();
})
</script>

<template>
    <el-dialog :title="''" top="4vh" style="width: 90%" :model-value="showModal" append-to-body :close-on-modal="false"
        :close-on-click-modal="false" @close="close">
        <form @submit.prevent="submit">
            <div class="row g-5">
                <div class="col-md-5 col-lg-4 order-md-last">
                    <h4 class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-secondary">Detalle de la venta</span>
                    </h4>
                    <ul class="list-group mb-3">
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">SubTotal</h6>
                            </div>
                            <span class="text-body-secondary">S/ {{ form.subtotal }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">Igv %</h6>
                            </div>
                            <span class="text-body-secondary">S/ {{ form.igv }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 class="my-0">Total</h6>
                            </div>
                            <span class="text-body-secondary">S/ {{ form.total }}</span>
                        </li>
                    </ul>
                </div>
                
                <div class="col-md-7 col-lg-8">
                    <h4 class="mb-3 text-secondary">Factura</h4>
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <label for="client" class="form-label">Nombre cliente</label>
                            <input type="text" class="form-control" id="client" v-model="form.client"
                                placeholder="Nombre del cliente">
                        </div>

                        <div class="col-sm-6">
                            <label for="fEmision" class="form-label">Fecha Emision</label>
                            <input type="date" class="form-control" id="fEmision" v-model="form.issue_date"
                                placeholder="Fecha Emisión">
                        </div>

                        <div class="col-4">
                            <label for="fEmision" class="form-label">Productos</label><br>
                            <el-select v-model="formItem.item_id" placeholder="Productos" clearable size="large"
                                style="width: 100%" @change="changeProduct">
                                <el-option v-for="item in products" :key="item.id" :label="item.description"
                                    :value="item.id" />
                            </el-select>
                        </div>

                        <div class="col-3">
                            <label for="quantity" class="form-label">Cantidad</label><br>
                            <input type="text" class="form-control" id="quantity" v-model="formItem.quantity"
                                placeholder="Cantidad">
                        </div>

                        <div class="col-3">
                            <label for="price" class="form-label">Precio</label><br>
                            <input type="text" class="form-control" id="price" v-model="formItem.unit_price"
                                placeholder="Precio">
                        </div>

                        <div class="col-2">
                            <label class="form-label text-white">.</label><br>
                            <el-button type="success" :icon="Plus" circle size="small" @click.prevent="addProduct()" />
                        </div>

                        <div class="col-12" v-if="form.items?.length">
                            <table class="table table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in form.items" :key="index">
                                        <td>
                                            <el-select v-model="row.item_id" placeholder="Productos" disabled clearable size="large"
                                            style="width: 100%" @change="changeProduct">
                                            <el-option v-for="item in products" :key="item.id" :label="item.description"
                                                :value="item.id" />
                                        </el-select>
                                        </td>
                                        <td>S/ {{ row.unit_price }}</td>
                                        <td>{{ row.quantity }}</td>
                                        <td>S/ {{ row.total }}</td>
                                        <td>
                                            <el-button type="danger" :icon="Delete" circle size="small" @click.prevent="deleteData(index)" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <hr class="my-4">
                    <button class="w-100 btn btn-success btn-lg" type="submit">Generar Venta</button>
                </div>
            </div>
        </form>
    </el-dialog>
</template>
