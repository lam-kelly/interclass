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
      title: 'Set Assignment Name',
      callback: () => {
        const message = `Successfully created a new assignment with name ${this.value}!` ;
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>