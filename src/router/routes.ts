import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("pages/Index/Index.vue"),
        name: "truc",
      },
      {
        path: "/conversation/:channel_id",
        component: () => import("pages/Conversation/Conversation.vue"),
      },
      {
        path: "/profile/:username",
        component: () => import("pages/Profile/Profile.vue"),
      },
      {
        path: "/sandbox",
        component: () => import("pages/Sandbox.vue")
      },
      {
        path: "/game/:gameId",
        component: () => import("pages/Game/Game.vue"),
        name: "game",
        beforeEnter: async (to, from, next) => {
          await fetch(`/api/games/play/${to.params.gameId}`).then((res) => {
            console.log(res.status);
            if (res.status == 404) {
              next({ name: "GameError" });
            } else next();
          });
        },
      },
      {
        path: "/game3d/:gameId",
        component: () => import("pages/Game/Game3d.vue"),
        name: "game3d",
        beforeEnter: async (to, from, next) => {
          await fetch(`/api/games/play/${to.params.gameId}`).then((res) => {
            console.log(res.status);
            if (res.status == 404) {
              next({ name: "GameError" });
            } else next();
          });
        },
      },
      {
        path: "/spectate/:gameId",
        component: () => import("pages/Game/Spectate.vue"),
        name: "spectate",
        beforeEnter: async (to, from, next) => {
          console.log(to.params.gameId);
          await fetch(`/api/games/watch/${to.params.gameId}`).then((res) => {
            console.log(res.status);
            if (res.status == 404) {
              if (from.name === "game") {
                next({ name: "GameError" });
              }
              next({ name: "GameError" });
            } else next();
          });
        },
      },
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
    path: "/game-error",
    name: "GameError",
    component: () => import("pages/GameError.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    name: "404",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
