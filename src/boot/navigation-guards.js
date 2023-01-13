import { LocalStorage } from 'quasar'

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    const user = LocalStorage.getItem('logged')
    if (!user && to.path !== '/login') {
      if (from.path === '/login') {
        console.error('You need to connect an account first')
      }
      next('/login')
    }
    else {
      next()
    }
  })
}
