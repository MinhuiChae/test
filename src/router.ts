import {createWebHistory, createRouter} from 'vue-router';

const routes = [
  {
    path:'/detail/:bbsSeq/:pageNo/:userId/:isValidUser',
    name:"Detail",
    component: () => import('./Board/DetailBoard.vue'),
    props: true
  },
  {
    path:'/:pageNo/:isVisitedDetailVue',
    name:"List",
    component: () => import('./Board/BoardList.vue'),
    props: true
  },
  {
    path:'/',
    name:"Index",
    component: () => import('./Board/BoardList.vue'),
    props: true
  },
  {
    path:'/write/',
    name:"Write",
    component: () => import('./Board/Write.vue'),
    props: true
  },
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
