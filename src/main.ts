import './app/assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from '@/shared/lib/i18n'

import App from './app/App.vue'
import router from './app/router'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.mount('#app')
