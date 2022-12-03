<template>
    <main>
        <section v-if="!$store.state.competition">
            <h2>Start a new Competition</h2>
        </section>
        <section v-else>
          <h2>Competition: {{$store.state.competition.name}}</h2>
          <h2> Assignments in this Competition: </h2>
          <AssignmentComponent
            v-for="assignment in $store.state.competition.assignments"
            :key="assignment.id"
            :assignment="assignment"
          />
        </section>
    </main>
</template>

<script>
import AssignmentComponent from '@/components/Assignment/AssignmentComponent.vue';

export default {
  name: 'CompetitionPage',
  components: {
    AssignmentComponent
  },
  methods: {
    async getCompetition() {
      const url = '/api/competition';
      const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      try {
        const r = await fetch(url, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setCompetition', res);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
  async mounted() {
    await this.getCompetition();
  }
};
</script>
