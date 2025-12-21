import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faSearch,
  faPlus,
  faTrash,
  faPencil,
  faSave,
  faXmark,
  faMusic,
  faBicycle,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faSearch,
  faPlus,
  faTrash,
  faPencil,
  faSave,
  faXmark,
  faMusic,
  faBicycle,
  faLocationDot
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
