import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import axios from "axios";
import { ElMessage } from "element-plus";

export const useInvoiceStore = defineStore('useInvoiceStore', () => {
    const invoices = ref([]);

    const form = reactive({
        client: null,
        invoice_number: null,
        issue_date: null,
        subtotal: 0,
        igv: 0,
        total: 0,
        items: [],
    });

    const resetForm = () => {
        form.client = null;
        form.invoice_number = null;
        form.issue_date = null;
        form.subtotal = 0;
        form.igv = 0;
        form.total = 0;
        form.items = [];
    };

    const getInvoices = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_URL}/invoice`);
            invoices.value = res.data.data;
        } catch (error) {
            console.error("Ocurrio un error:", error);
        }
    }

    const deleteData = async (id) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_APP_URL}/invoice/${id}`);
            if (res.data?.success) {
                ElMessage.success(res.data.message);
                await getInvoices();
            }
        } catch (error) {
            console.log('Ocurrion un error ', error)
        }
    }

    const pdfView = async (id) => {
        try {

            const response =  await axios.get(`${import.meta.env.VITE_APP_URL}/invoice/pdf/${id}`, {
                responseType: "blob",
            });
    
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
    
            window.open(url, "_blank");
    
        } catch (error) {
            console.error("Ocurrió un error al generar el PDF:", error.message);
        }
    };
    

    return {
        form,
        resetForm,
        getInvoices,
        deleteData,
        invoices,
        pdfView
    }
});