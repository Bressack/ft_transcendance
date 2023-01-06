import api from '../services/api.service'

// Récupère l'objet router représentant Vue router
export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    api.auth()
    next()
  })
}
