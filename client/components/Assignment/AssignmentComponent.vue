<template>
  <v-list-item @click="doNothing">
    <v-list-item-content @click="setCurrentAssignment">
      <v-list-item-title>
        {{ assignment.name }}
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn v-if="$store.state.role === 'teacher'" icon small outlined color="error" @click="deleteAssignment">
        <v-icon small >mdi-trash-can</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import AssignmentComponent from '@/components/Assignment/AssignmentComponent.vue';

export default {
  name: 'AssignmentComponent',
  props: {
    assignment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selected: '',
    }
  },
  methods: {
    setCurrentAssignment() {
      this.$store.commit('setCurrentAssignment', this.assignment);
      this.$router.push(`/assignment/${this.$store.state.currentAssignment._id}`)
    },
    doNothing() {},
    async deleteAssignment() {
      const url = `/api/assignment/${this.assignment._id}`;
      const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Sends express-session credentials with request
      };

      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('getCompetition');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>

</style>