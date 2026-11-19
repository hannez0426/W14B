import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import GamePage from "../views/GamePage.vue";

// Define the pages and their metadata
const routes = [
  {
    path: "/",
    name: "LoginPage",
    component: LoginPage,
    meta: {
      title: "Login | Higher or Lower",
      author: "Vue Student Project",
      description: "Login to play Higher or Lower.",
      keywords: "vue, login, game"
    }
  },
  {
    path: "/game",
    name: "GamePage",
    component: GamePage,
    meta: {
      title: "Game | Higher or Lower",
      author: "Vue Student Project",
      description: "Play the Higher or Lower number game.",
      keywords: "higher lower, number, wager, vue"
    }
  }
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Update the browser title and meta tags on navigation
router.afterEach((to) => {
  document.title = to.meta.title || "Higher or Lower";

  ["author", "description", "keywords"].forEach((name) => {
    let tag = document.querySelector(
      `meta[name="${name}"]`
    );

    // Create the meta tag if it doesn't exist
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }

    // Update the meta tag for the current page
    tag.setAttribute("content", to.meta[name] || "");
  });
});

export default router;
