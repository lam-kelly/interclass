<template>
  <main>
    <v-list v-if="$store.state.competition && $store.state.classesInOrder.length">
      <h2>Leaderboard for {{$store.state.competition.name}} Competition</h2>
      <div v-if="$store.state.classesInOrder.length > 2">
        <Rank
          v-for="classs in classes.slice(0, classes.length-2)"
          :key="classs._id"
          :classs="classs"
          :maxPoints="classes[0].totalPoints"
        />
        <v-card outlined>
          
          <v-card-subtitle class="pa-0 pl-3"> Allied - When one class in the alliance earns points, the other class will automatically gain the same amount of points. </v-card-subtitle>
          <Rank
            :key="classes[classes.length-2]._id"
            :classs="classes[classes.length-2]"
            :maxPoints="classes[0].totalPoints"
          />
          <Rank
            :key="classes[classes.length-1]._id"
            :classs="classes[classes.length-1]"
            :maxPoints="classes[0].totalPoints"
          />
        </v-card>
      </div>
      <div v-else>
        <Rank
          v-for="classs in classes"
          :key="classs._id"
          :classs="classs"
          :maxPoints="classes[0].totalPoints"
        />
      </div>
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
  data () {
    return {
      classes: [],
    }
  },
  async mounted() {
    await this.$store.commit('getCompetition');
    if (this.$store.state.competition) {
      this.classes = this.$store.state.competition.classes.sort((a, b) => a.totalPoints > b.totalPoints ? -1 : a.totalPoints < b.totalPoints ? 1 : 0);
    }
  }
};
</script>
