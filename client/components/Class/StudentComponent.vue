<template>
    <main>
       
        <header>
          <h2>Students</h2>
        </header>
        <section
          v-if="$store.state.currentClass.students"
        >
          <div class="studentsInClass" v-for="(user, index) in $store.state.currentClass.students" :key="index">
            {{user.username}}
            <section v-if="$store.state.role === 'teacher'">
            <button class="removebutton" @click="removeFromClass(user._id)">
                <i>Remove</i>
            </button>  
            </section>
        </div>
        </section>
        <!-- <article
          v-else
        >
          <h3>No students found.</h3>
        </article> -->
        <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
      </section>
    
    </main>
</template>

<script>
export default {
  name: 'StudentComponent',
  data() {
    return {
      alerts: {} // Displays success/error messages encountered 
    };
  },
  methods: {
    async removeFromClass(studentID) {
         /**
         * Remove a student from a class.
         */
         const requestOptions = {
              method: 'PATCH',
              headers: {'Content-Type': 'application/json'},
              credentials: 'same-origin', 
              body: JSON.stringify({ "studentId": studentID })
          };
        const url = `/api/class/remove/${this.$store.state.currentClass._id}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.$store.commit('getCurrentClass');
          // this.getClass();
          this.$set(this.alerts, 'Successfully removed a student!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully removed a student!'), 3000);
          // this.$store.commit('alert', {
          //     message: 'Successfully added your source!', status: 'success'
          //   });
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
  }
}
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>