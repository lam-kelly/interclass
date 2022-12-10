<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <v-app-bar color="accent" elevation="0">
    <div class="left">
      <img src="../../public/logo2.png">
      <h1 class="title">
        InterClass
      </h1>
    </div>
    <v-spacer></v-spacer>
    <div class="right">
      <v-btn depressed color="accent" @click="$router.push(`/`)">
        Home
      </v-btn>
      <v-btn depressed color="accent" @click="$router.push(`/class`)">
        Class
      </v-btn>
      <v-btn depressed color="accent" @click="$router.push(`/competition`)">
        Competition
      </v-btn>
      <v-btn depressed color="accent" @click="$router.push(`/leaderboard`)">
        Leaderboard
      </v-btn>
      <v-btn depressed color="accent"
        v-if="$store.state.username"
        @click="$router.push(`/account`)"
      >
        Account
      </v-btn>
      <v-btn depressed color="accent"
        v-else
        @click="$router.push(`/login`)"
      >
        Login
    </v-btn>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </v-app-bar>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
