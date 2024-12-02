import { createApp } from 'vue';
import { createPinia } from 'pinia'
import { i18n } from  "./helpers/useI18n";
import 'primeicons/primeicons.css'

import App from './App.vue';

import './assets/style.css'

const pinia = createPinia()

const app = createApp(App);

app.use(pinia)
app.use(i18n)
app.mount('#app');
