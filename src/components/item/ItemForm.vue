<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useProductStore } from "../../stores/itemStore";
import { ElMessage } from "element-plus";
const useProduct = useProductStore();

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

const submit = async () => {
    let response;
    try {
        if (!!form.value.id) {
            (response = await axios.patch(`${import.meta.env.VITE_APP_URL}/items/${form.value.id}`, form.value));
        } else {
            (response = await axios.post(`${import.meta.env.VITE_APP_URL}/items`, form.value));
        }
       
        if (response.data?.success) {
            ElMessage.success(response.data.message);
            await useProduct.getProducts();
            await close();
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

const close = async () => {
    emit('close');
    useProduct.resetForm();
}
</script>

<template>
    <el-dialog :title="'Producto'" :model-value="showModal" append-to-body :close-on-modal="false"
        :close-on-click-modal="false" @close="close">
        <form @submit.prevent="submit">
            <div class="row">
                <div class="col-sm-6">
                    <label for="name" class="form-label">Codigo</label>
                    <input type="text" class="form-control" id="code" placeholder="Codigo" v-model="form.code">
                </div>

                <div class="col-sm-6">
                    <label for="description" class="form-label">Descripción</label>
                    <input type="text" class="form-control" id="description" placeholder="Descripción"
                        v-model="form.description">
                </div>

                <div class="col-sm-6">
                    <label for="description" class="form-label">Precio</label>
                    <input type="number" class="form-control" id="description" placeholder="Precio"
                        v-model="form.price">
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 text-end">
                    <button type="submit" class="btn btn-success">
                        <i class="fa-solid fa-floppy-disk me-2"></i> Guardar
                    </button>
                </div>
            </div>
        </form>
    </el-dialog>
</template>
