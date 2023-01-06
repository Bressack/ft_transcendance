import { LocalStorage } from 'quasar'
import api from '../services/api.service'

// Récupère l'objet router représentant Vue router
export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    api.ping()
    .then((res) => {
      console.log(res)
      next()
    })
    .catch((err) => {
      console.error(err)
      next('/login')
    })
  })
}
