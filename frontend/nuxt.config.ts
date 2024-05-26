// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    '/': { ssr: false },
    // '/admin/*': { ssr: false },
  },
  colorMode: {
    preference: 'light',
  },
  app: {
    head: {
      title: "Seven Evelen",
      link: [
        { rel: "icon", type: "image/x-icon", href: "logo.png" }
      ],
    },
  },

  // imports: {
  //   presets: [
  //     {
  //       from: 'vue3-apexcharts',
  //       imports: ['apexchart', 'VueApexCharts']
  //     }
  //   ]
  // },

  runtimeConfig: {
    public: {
      API: (process.env.API || "http://localhost:8080"),
    }
  },
  spaLoadingTemplate: "./spa-loading-template.html",
  auth: {
    baseURL: process.env.Auth_API || "http://localhost:8080",
    provider: {
      type: 'local', endpoints: {
        signIn: { path: '/login', method: 'post' }, signOut: { path: '/logout', method: 'post' }, signUp: { path: '/signup', method: 'post' }, getSession: false,
      },
      token: { signInResponseTokenPointer: "/access_token" }
    }
  },
  modules: [
    "@vueuse/nuxt",
    "@nuxt/image",
    "nuxt-swiper",
    "@sidebase/nuxt-auth",
    "@nuxt/content",
    "@formkit/auto-animate",
    "@nuxt/ui",
    'nuxt3-leaflet',
    'nuxt-time',
  ]
})