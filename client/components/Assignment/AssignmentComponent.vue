<template>
  <section>
    <button @click="setCurrentAssignment">
    {{ assignment.name }}
    </button>
    <button @click="deleteAssignment">
      🗑️ Delete
    </button>
  </section>
</template>

<script>
import AssignmentComponent from '@/components/Assignment/AssignmentComponent.vue';

export default {
  name: 'AssignmentPage',
  components: { AssignmentComponent },
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