<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateProblem',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/problem',
      method: 'POST',
      hasBody: true,
      setCurrentProblem: true,
    //   answerChoicesField: [
    //     {id: 'answerChoice1', label: 'answerChoice1', value: ''}
    //     {id: 'answerChoice2', label: 'answerChoice2', value: ''}
    //     {id: 'answerChoice3', label: 'answerChoice3', value: ''}
    //     {id: 'answerChoice4', label: 'answerChoice4', value: ''}
    //   ],
      fields: [
        {id: 'question', label: 'Question', value: ''},
        {id: 'answer', label: 'Answer', value: ''},
        {id: 'answerChoice1', label: 'answerChoice1', value: ''},
        {id: 'answerChoice2', label: 'answerChoice2', value: ''},
        {id: 'answerChoice3', label: 'answerChoice3', value: ''},
        {id: 'answerChoice4', label: 'answerChoice4', value: ''},
        {id: 'pointValue', label: 'Point Value', value: ''},
      ],
      title: 'Create Assignment',
      callback: async () => {
        await this.addProblemToAssignment();
        const message = `Successfully created a new problem!` ;
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  },
  methods: {
    async addProblemToAssignment() {
      const url = `/api/assignment/${this.$store.state.currentAssignment._id}`;
      const options = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({'newProblem': this.$store.state.currentProblem._id})
      };
      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        await this.$store.commit('refreshProblems');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>