import { createApp } from 'vue'
import App from './App.vue'
//import App from './Test.vue';
//import App from './Board/BoardIndex.vue';
import './scss/style.scss';
import {router} from "./router"

const app = createApp(App);

app.use(router);
app.mount('#app');
