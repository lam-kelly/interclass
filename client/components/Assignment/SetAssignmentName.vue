<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'SetAssignmentName',
  mixins: [InlineForm],
  data() {
    return {value: ""};
  },
  methods: {
    async submit() {
      const url = `/api/assignment`;
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({'assignmentName': this.value})
      };
      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setCurrentAssignment', res.assignment ? res.assignment : null);
        this.$router.push(`/assignment/${this.$store.state.currentAssignment._id}`);
        await this.addAssignmentToCompetition();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async addAssignmentToCompetition() {
      const url = `/api/competition/${this.$store.state.competition._id}/addAssignment`;
      const options = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({'assignmentId': this.$store.state.currentAssignment._id})
      };
      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setCompetition', res.competition);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>