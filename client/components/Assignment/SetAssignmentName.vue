<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'SetAssignmentName',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/assignment',
      method: 'POST',
      hasBody: true,
      setAssignmentName: true,
      fields: [
        {id: 'assignmentName', label: 'Assignment Name', value: ''}
      ],
      title: 'Create Assignment',
      callback: async () => {
        this.$router.push(`/assignment/${this.$store.state.currentAssignment._id}`);
        await this.addAssignmentToCompetition();
        // const message = `Successfully created a new assignment with name ${this.value}!` ;
        // this.$set(this.alerts, message, 'success');
        // setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  },
  methods: {
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