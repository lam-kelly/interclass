<script>
import InlineForm from '@/components/common/InlineForm.vue';
export default {
  name: 'AddStudentComponent',
  mixins: [InlineForm],
  data() {
    return { value: '' };
  },
  methods: {
    async submit() {
      /**
      * Add a student to a class.
      */
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ "studentName": this.value })
      };
      const url = `/api/class/add/${this.$store.state.currentClass._id}`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setCurrentClass', res.class);
        this.value = '';
        this.$set(this.alerts, 'Successfully added a student!', 'success');
        setTimeout(() => this.$delete(this.alerts, 'Successfully added a student!'), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
}
</script>
