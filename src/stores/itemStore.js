import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import axios from "axios";
import { ElMessage } from "element-plus";

export const useProductStore = defineStore('useProductStore', () => {
    const products = ref([]);

    const form = reactive({
        code: null,
        description: null,
        price: 0,
    });

    const resetForm = () => {
        form.code = null;
        form.description = null;
        form.price = 0;
    };

    const getProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_URL}/items`);
            products.value = res.data.data;
        } catch (error) {
            console.error("Ocurrio un error:", error);
        }
    }

    const deleteData = async (id) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_APP_URL}/items/${id}`);
            if (res.data?.status) {
                ElMessage.success(res.data.message);
                await getProducts();
            }
        } catch (error) {
            console.log('Ocurrion un error ', error)
        }
    }

    return {
        form,
        resetForm,
        getProducts,
        deleteData,
        products,
    }
});