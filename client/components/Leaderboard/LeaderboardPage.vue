<template>
  <main>
    <section>
      <h2>Leaderboard for {{$store.state.competition.name}} Competition</h2>
    </section>
    <section>
      <Rank
        v-for="classs in $store.state.competition.classes"
        :key="classs.id"
        :classs="classs"
      />
    </section>
  </main>
</template>

<script>
import Rank from '@/components/Leaderboard/Rank.vue';

export default {
  name: 'LeaderboardPage',
  components: {Rank},
  mounted() {
    this.$store.commit('getCompetition');
  }
};
</script>
