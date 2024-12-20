import './index.css'  // This will be our main CSS file

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Analytics from './plugins/analytics'

const app = createApp(App)
app.use(router)
app.use(Analytics)  // Add the Analytics plugin
app.mount('#app')
