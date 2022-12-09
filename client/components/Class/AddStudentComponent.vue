<template>
    <main>
        <section>
          <div class="text-h4">Add a student</div>
            <!-- <header>
            <h2>Add a student</h2>
        </header> -->
        <div class="font-weight-light">Type a student's username, and hit the Add button:</div>
        <!-- <p>Type a student's username, and hit the Add button:</p> -->
        <div class="d-flex">
        <v-text-field
            v-model="newstudent"
            label="Enter a username"
          ></v-text-field>
          <v-btn color="secondary" @click="addToClass">
            Add
            <v-icon
          dark
          right
        >
          mdi-checkbox-marked-circle
        </v-icon>
          </v-btn>
        </div>
        <!-- <input v-model="newstudent" @keyup.enter="addToClass()"/> -->
        <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
      </section>
    </section>
    </main>
</template>

<script>
export default {
  name: 'AddStudentComponent',
  data() {
    return {
      newstudent: '',
      alerts: {} // Displays success/error messages encountered 
    };
  },
  methods: {
    async addToClass() {
         /**
         * Add a student to a class.
         */
         const requestOptions = {
              method: 'PATCH',
              headers: {'Content-Type': 'application/json'},
              credentials: 'same-origin', 
              body: JSON.stringify({ "studentName": this.newstudent })
          };
        const url = `/api/class/add/${this.$store.state.currentClass._id}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.$store.commit('getCurrentClass');
          // this.getClass();
          this.$set(this.alerts, 'Successfully added a student!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully added a student!'), 3000);
          // this.$store.commit('alert', {
          //     message: 'Successfully added your source!', status: 'success'
          //   });
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
        this.newstudent = '';
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