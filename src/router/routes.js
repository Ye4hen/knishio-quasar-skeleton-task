const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/IndexPage.vue') },
      { name: 'dashboard', path: 'dashboard', component: () => import('pages/DashboardPage.vue'), meta: { requiresAuth: true } },
      { name: 'profile', path: 'profile', component: () => import('pages/ProfilePage.vue'), meta: { requiresAuth: true } },
      { name: 'task_manager', path: 'task_manager', component: () => import('pages/TaskManagerPage.vue'), meta: { requiresAuth: true } }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
