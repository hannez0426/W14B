<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">H / L</div>

      <h1>Welcome Back</h1>
      <p>Login to play Higher or Lower</p>

      <form @submit.prevent="login">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          required
        />

        <!-- Show an error if the login fails -->
        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

// Replace with your ReqRes development API key
const API_KEY = "free_user_3MIpW4bT7bocWlstvuuGg0MGEA0";

export default {
  name: "LoginPage",

  data() {
    return {
      email: "",
      password: "",
      error: "",
      loading: false
    };
  },

  methods: {
    async login() {
      this.error = "";
      this.loading = true;

      try {
        // Send the email and password to ReqRes
        const response = await axios.post(
          "https://reqres.in/api/login",
          {
            email: this.email,
            password: this.password
          },
          {
            headers: {
              "x-api-key": API_KEY
            }
          }
        );

        // Save the token returned by the API
        if (response.data.token) {
          this.$cookies.set(
            "login_token",
            response.data.token,
            "1d",
            "/",
            "",
            true,
            "Strict"
          );

          // Navigate to the game screen
          this.$router.push("/game");
        } else {
          this.error = "Login failed. No token received.";
        }
      } catch (error) {
        // Show a useful message if the request fails
        this.error =
          error.response?.data?.error ||
          "Unable to login. Please try again.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.logo {
  display: inline-block;
  background: #111;
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-weight: bold;
  margin-bottom: 15px;
}

h1 {
  margin-bottom: 8px;
}

p {
  color: #777;
  margin-bottom: 30px;
}

form {
  text-align: left;
}

label {
  display: block;
  margin: 15px 0 8px;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
}

button {
  width: 100%;
  margin-top: 25px;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: #111;
  color: white;
  font-size: 15px;
  cursor: pointer;
}

button:hover {
  background: #333;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #c62828;
  font-size: 13px;
  margin: 15px 0 0;
}

@media (max-width: 600px) {
  .login-card {
    padding: 25px;
  }
}
</style>
