import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("pages/Index/Index.vue") },
      {
        path: "/conversation/:channel_id",
        component: () => import("pages/Conversation/Conversation.vue"),
      },
      {
        path: "/profile/:username",
        component: () => import("pages/Profile/Profile.vue"),
      },
      { path: "/play", component: () => import("pages/GameLobbyTest.vue") },
      { path: "/game/:gameId", component: () => import("pages/Game/Game.vue") },
      { path: "/game3d/:gameId", component: () => import("src/pages/Game/Game3d.vue") },
      { path: "/spectate/:gameId", component: () => import("pages/Game/Spectate.vue") },
    ],
  },

  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/Auth.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
