import './index.css'  // This will be our main CSS file

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

import Analytics from './plugins/analytics'

const app = createApp(App)
app.use(router)
app.use(Analytics)  // Add this line to use the Analytics plugin
app.mount('#app')
