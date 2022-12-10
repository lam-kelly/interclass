<template>
  <main>
    <v-list v-if="classes">
      <h2>Leaderboard for {{$store.state.competition.name}} Competition</h2>
      <Rank
        v-for="classs in classes"
        :key="classs.id"
        :classs="classs"
        :maxPoints="classes[0].totalPoints"
      />
    </v-list>
    <section v-else>
      You are not currently in a competition
    </section>
  </main>
</template>

<script>
import Rank from '@/components/Leaderboard/Rank.vue';

export default {
  name: 'LeaderboardPage',
  components: {Rank},
  data() {
    return {classes: []};
  },
  async mounted() {
    await this.$store.commit('getCompetition');
    this.classes = [... this.$store.state.competition.classes]
    this.classes.sort((a, b) => a.totalPoints > b.totalPoints ? -1 : a.totalPoints < b.totalPoints ? 1 : 0)
  }
};
</script>
