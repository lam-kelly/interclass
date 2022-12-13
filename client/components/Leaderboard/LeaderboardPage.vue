<template>
  <main>
    <v-list v-if="$store.state.competition && $store.state.competition.classes.length">
      <h2>Leaderboard for {{$store.state.competition.name}} Competition</h2>
      <Rank
        v-for="classs in $store.state.competition.classes"
        :key="classs.id"
        :classs="classs"
        :maxPoints="$store.state.competition.classes[0].totalPoints"
      />
    </v-list>
    <section v-else>
      <v-card elevation="0" class="d-flex" height="82vh">
        <v-row align="center">
            <v-col align="center">
              <v-card-title class="text-h1" style="justify-content: center; word-break: break-word">You are not currently in a competition</v-card-title>
            </v-col>
        </v-row>
      </v-card>
    </section>
  </main>
</template>

<script>
import Rank from '@/components/Leaderboard/Rank.vue';

export default {
  name: 'LeaderboardPage',
  components: {Rank},
  async mounted() {
    await this.$store.commit('getCompetition');
    if (this.$store.state.competition) {
      this.$store.state.competition.classes.sort((a, b) => a.totalPoints > b.totalPoints ? -1 : a.totalPoints < b.totalPoints ? 1 : 0);
    }
  }
};
</script>
