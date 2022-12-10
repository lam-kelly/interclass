<template>
  <v-list-item>
    <v-list-item-title>
      {{ student.username }}
    </v-list-item-title>
    <v-list-item-action>
      <v-btn icon small outlined color="error" v-if="$store.state.role === 'teacher'" @click="removeFromClass">
        <v-icon small >mdi-trash-can</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  name: 'StudentComponent',
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {}
    };
  },
  methods: {
    async removeFromClass() {
      /**
      * Remove a student from a class.
      */
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ "studentId": this.student._id })
      };
      const url = `/api/class/remove/${this.$store.state.currentClass._id}`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setCurrentClass', res.class);
        this.$set(this.alerts, 'Successfully removed a student!', 'success');
        setTimeout(() => this.$delete(this.alerts, 'Successfully removed a student!'), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
}
</script>
