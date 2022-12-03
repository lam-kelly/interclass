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
      const url = `/api/competition`;
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({'name': this.value})
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
