import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// ELEMENT PLUS
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import es from "element-plus/dist/locale/es.mjs";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
    locale: es,
});

app.mount('#app')
