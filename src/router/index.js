import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ItemView from '../views/item/ItemView.vue';
import InvoceView from '../views/invoice/InvoiceView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
       path: '/',
       name: 'home',
       component: HomeView
    },
    {
      path: '/items',
      name: 'Productos',
      component: ItemView
    },
    {
      path: '/invoices',
      name: 'Facturas',
      component: InvoceView
    }
  ]
})

export default router