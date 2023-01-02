import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/',                    component: () => import('pages/Index/Index.vue'               ) },
      { path: '/conversation',        component: () => import('pages/Conversation/Conversation.vue' ) },
      { path: '/profile/:username',   component: () => import('pages/Profile/Profile.vue'           ) },
      { path: '/settings',            component: () => import('pages/Settings/Settings.vue'         ) },
      { path: '/play',                component: () => import('pages/GameLobby/GameLobby.vue'       ) },
      { path: '/usercard',            component: () => import('pages/UserCardTest.vue'              ) },
      { path: '/upload',              component: () => import('pages/UploadTest.vue'                ) },
      { path: '/feeddb',              component: () => import('pages/FeedDB.vue'                    ) },
    ],
  },

  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Auth.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];


export default routes;
