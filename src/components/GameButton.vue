
<template>
  <div>
    <button
      @click="playGame"
      :disabled="loading || disabled"
    >
      {{ loading ? "Getting Number..." : "Play Game" }}
    </button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GameButton",

  // Prevent playing when a wager is invalid
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  // Declare the event sent to GamePage
  emits: ["number-generated"],

  data() {
    return {
      loading: false,
      error: ""
    };
  },

  methods: {
    async playGame() {
      this.loading = true;
      this.error = "";

      try {
        // Request a random number between 1 and 100
        const response = await axios.get(
          "https://www.randomnumberapi.com/api/v1.0/randomnumber",
          {
            params: {
              min: 1,
              max: 100,
              count: 1
            }
          }
        );

        const number = response.data[0];

        // Check that the API returned a valid number
        if (
          !Number.isInteger(number) ||
          number < 1 ||
          number > 100
        ) {
          throw new Error("Invalid number received.");
        }

        // Send the number to the parent component
        this.$emit("number-generated", number);
      } catch (error) {
        // Show an error instead of changing the score
        this.error = "Could not get a number. Try again.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
button {
  background: #111;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background: #333;
}

button:disabled {
  background: #999;
  cursor: not-allowed;
}

.error {
  color: #c62828;
  font-size: 14px;
}
</style>
