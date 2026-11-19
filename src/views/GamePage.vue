<template>
  <div class="game-page">
    <!-- Only display the game when logged in -->
    <div v-if="isLoggedIn" class="game-card">
      <div class="top-bar">
        <span class="game-logo">H / L</span>

        <button class="logout" @click="logout">
          Logout
        </button>
      </div>

      <h1>Higher or Lower</h1>
      <p class="subtitle">
        Get 50 or higher to win!
      </p>

      <!-- Display wins, losses and points -->
      <ScoreBoard
        :wins="wins"
        :losses="losses"
        :points="points"
      />

      <div class="game-area">
        <p class="small-title">YOUR NUMBER</p>

        <div class="number">
          {{ randomNumber === null ? "?" : randomNumber }}
        </div>

        <!-- Display the result of the last round -->
        <p v-if="result" class="result">
          {{ result }}
        </p>

        <!-- Bonus: Choose a wager -->
        <div class="wager-section">
          <label for="wager">Your Wager</label>

          <input
            id="wager"
            v-model.number="wager"
            type="number"
            min="1"
            step="1"
            :max="points"
            :disabled="points === 0"
          />

          <p class="hint">
            Available points: {{ points }}
          </p>
        </div>

        <!-- GameButton makes the API request -->
        <GameButton
          :disabled="!validWager"
          @number-generated="handleNumber"
        />

        <p v-if="points === 0" class="game-over">
          Game over! You have no points left.
        </p>

        <button
          class="reset-button"
          @click="resetGame"
        >
          Reset Game
        </button>
      </div>
    </div>

    <!-- Error screen when there is no login token -->
    <div v-else class="error-card">
      <h1>Access Denied</h1>
      <p>You must login before playing the game.</p>

      <router-link to="/" class="login-link">
        Go to Login
      </router-link>
    </div>
  </div>
</template>

<script>
import ScoreBoard from "../components/ScoreBoard.vue";
import GameButton from "../components/GameButton.vue";

export default {
  name: "GamePage",

  components: {
    ScoreBoard,
    GameButton
  },

  data() {
    return {
      isLoggedIn: false,
      wins: 0,
      losses: 0,
      points: 100,
      wager: 10,
      randomNumber: null,
      result: ""
    };
  },

  computed: {
    // Only allow whole-number wagers within the balance
    validWager() {
      return (
        Number.isInteger(this.wager) &&
        this.wager >= 1 &&
        this.wager <= this.points
      );
    }
  },

  mounted() {
    // Check for the login token before allowing play
    const token = this.$cookies.get("login_token");

    if (!token) {
      this.isLoggedIn = false;
      return;
    }

    this.isLoggedIn = true;

    // Restore saved values when the page is refreshed
    this.wins = this.readSavedNumber("wins", 0);
    this.losses = this.readSavedNumber("losses", 0);
    this.points = this.readSavedNumber("points", 100);
  },

  methods: {
    // Read a saved cookie and convert it to a number
    readSavedNumber(name, defaultValue) {
      const saved = this.$cookies.get(name);

      if (saved === null || saved === undefined) {
        return defaultValue;
      }

      const value = Number(saved);

      // Ignore invalid or negative saved values
      if (!Number.isSafeInteger(value) || value < 0) {
        return defaultValue;
      }

      return value;
    },

    // Receive the random number from GameButton
    handleNumber(number) {
      if (!this.isLoggedIn || !this.validWager) {
        return;
      }

      this.randomNumber = number;

      // Save the current wager before updating points
      const amount = this.wager;

      if (number >= 50) {
        // Win: receive twice the wager, including
        // the original stake, for a net gain of amount
        this.wins++;
        this.points += amount;
        this.result = `You Win! +${amount} points`;
      } else {
        // Lose: subtract the wager
        this.losses++;
        this.points -= amount;
        this.result = `You Lose! -${amount} points`;
      }

      // Save the updated scoreboard in cookies
      this.saveScores();

      // Keep the next wager within the new balance
      if (this.points > 0 && this.wager > this.points) {
        this.wager = this.points;
      }
    },

    // Store wins, losses and points for seven days
    saveScores() {
      this.$cookies.set("wins", this.wins, "7d");
      this.$cookies.set("losses", this.losses, "7d");
      this.$cookies.set("points", this.points, "7d");
    },

    // Start over with 100 points
    resetGame() {
      this.wins = 0;
      this.losses = 0;
      this.points = 100;
      this.wager = 10;
      this.randomNumber = null;
      this.result = "";

      // Save the reset values
      this.saveScores();
    },

    // Remove the token and return to login
    logout() {
      this.$cookies.remove("login_token", "/");
      this.isLoggedIn = false;
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
}

.game-card,
.error-card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 35px;
  width: 100%;
  max-width: 650px;
  text-align: center;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.game-logo {
  background: #111;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
}

.logout {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 18px;
  cursor: pointer;
}

h1 {
  margin-bottom: 10px;
}

.subtitle {
  color: #777;
  margin-bottom: 30px;
}

.game-area {
  padding: 20px 0;
}

.small-title {
  font-size: 13px;
  letter-spacing: 2px;
  color: #777;
}

.number {
  font-size: 90px;
  font-weight: bold;
  margin: 15px 0;
}

.result {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 25px;
}

.wager-section {
  max-width: 300px;
  margin: 25px auto;
  text-align: left;
}

.wager-section label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.wager-section input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.hint {
  color: #777;
  font-size: 13px;
}

.reset-button {
  margin-top: 20px;
  padding: 12px 25px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.reset-button:hover,
.logout:hover {
  background: #f1f1f1;
}

.game-over {
  color: #c62828;
  font-weight: bold;
}

.error-card p {
  color: #777;
  margin-bottom: 30px;
}

.login-link {
  display: inline-block;
  background: #111;
  color: white;
  padding: 13px 25px;
  border-radius: 8px;
  text-decoration: none;
}

@media (max-width: 600px) {
  .game-card,
  .error-card {
    padding: 22px;
  }

  h1 {
    font-size: 26px;
  }

  .number {
    font-size: 65px;
  }
}
</style>
