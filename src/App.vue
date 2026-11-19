<template>
  <div id="app">
    <!-- Display the view selected by Vue Router -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
/* Global styles for both pages */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f7f7f7;
  color: #111;
}

button,
input {
  font-family: inherit;
}

button {
  transition: background 0.2s ease;
}
</style>

