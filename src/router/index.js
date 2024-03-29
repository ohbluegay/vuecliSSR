import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'HelloWorld',
        component: () => import('@/components/HelloWorld')
      }
    ]
  })
}
