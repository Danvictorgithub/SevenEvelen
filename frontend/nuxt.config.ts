// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      API: (process.env.API || "http://localhost:8080"),
    }
  },
  auth: {
    baseURL: process.env.Auth_API || "http://localhost:8080",
    provider: {
      type: 'local', endpoints: {
        signIn: { path: '/login', method: 'post' }, signOut: { path: '/logout', method: 'post' }, signUp: { path: '/signup', method: 'post' }, getSession: false,
      },
      token: { signInResponseTokenPointer: "/access_token" }
    }
  },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@nuxt/image", "nuxt-icon", "nuxt-swiper", "@sidebase/nuxt-auth", "@nuxt/content", "@formkit/auto-animate"]
})