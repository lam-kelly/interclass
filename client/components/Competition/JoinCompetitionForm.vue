<script>
import InlineForm from '@/components/common/InlineForm.vue';
export default {
  name: 'JoinCompetitionForm',
  mixins: [InlineForm],
  data() {
    return {value: ""};
  },
  methods: {
    async submit() {
      const url = `/api/competition/${this.value}/join`;
      const options = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({'classId': this.$store.state.currentClass._id})
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
  },

};
</script>
