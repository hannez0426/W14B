
<template>
  <div class="scoreboard">
    <div class="score">
      <p>Wins</p>
      <h2>{{ wins }}</h2>
    </div>

    <div class="score">
      <p>Losses</p>
      <h2>{{ losses }}</h2>
    </div>

    <div class="score">
      <p>Points</p>
      <h2>{{ points }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScoreBoard",

  // Receive game statistics from the parent component
  props: {
    wins: {
      type: Number,
      required: true
    },
    losses: {
      type: Number,
      required: true
    },
    points: {
      type: Number,
      required: true
    }
  }
};
</script>

<style scoped>
.scoreboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.score {
  background: #f5f5f5;
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.score p {
  color: #777;
  margin: 0 0 10px;
}

.score h2 {
  font-size: 30px;
  margin: 0;
}

@media (max-width: 480px) {
  .scoreboard {
    gap: 8px;
  }

  .score {
    padding: 14px 8px;
  }

  .score h2 {
    font-size: 23px;
  }
}
</style>
