<template>
  <main>
    <v-container>
      <section v-if="$store.state.currentClass">
        <v-card tile elevation="0">
          <v-row align="center">
            <v-card-title class="text-h4">Welcome to {{ $store.state.currentClass.teacher.username }}'s class!
            </v-card-title>
            <v-spacer></v-spacer>
            <div v-if="$store.state.role === 'teacher'">
              <v-btn outlined color="error" @click="removeClass">
                Delete Class
              </v-btn>
            </div>
          </v-row>

          <v-progress-linear v-if="$store.state.competition" color="#0F850D" height="25"
            :value="$store.state.currentClass.totalPoints / this.maxPoints * 100" striped>
            <div class="white--text font-weight-bold">Points: {{ $store.state.currentClass.totalPoints }}</div>
          </v-progress-linear>
        </v-card>

        <v-card elevation="0">
          <div v-if="$store.state.role === 'teacher'">
            <v-card-title>Add Students</v-card-title>
            <AddStudentComponent label="Student Username" placeholder="ex: bob" button="Add" />
          </div>

          <section class="alerts">
            <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
              <p>{{ alert }}</p>
            </article>
          </section>
          <v-list v-if="$store.state.currentClass && $store.state.currentClass.students.length">
            <v-card-title>Students</v-card-title>
            <StudentComponent v-for="student in $store.state.currentClass.students" :key="student.id"
              :student="student" />
          </v-list>
        </v-card>
      </section>

      <section v-else>
        <v-card elevation="0" class="d-flex" height="82vh" v-if="$store.state.role === 'teacher'">
          <v-row align="center">
            <v-col align="center">
              <v-card-title class="text-h1" style="justify-content: center;">Create a new class!</v-card-title>
              <v-btn x-large rounded color="primary" @click="createClass">
                Click to Create
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <v-card v-else elevation="0" class="d-flex" height="82vh">
          <v-row align="center">
            <v-col align="center">
              <v-card-title class="text-h1" style="justify-content: center; word-break: break-word">Hi! Please wait for a teacher to add you to
                a class</v-card-title>
            </v-col>
          </v-row>
        </v-card>

      </section>
    </v-container>
  </main>
</template>
  
<script>
import StudentComponent from '@/components/Class/StudentComponent.vue';
import AddStudentComponent from '@/components/Class/AddStudentComponent.vue';

export default {
  name: 'ClassPage',
  components: { StudentComponent, AddStudentComponent },
  data() {
    return {
      maxPoints: null,
      alerts: {} // Displays success/error messages encountered
    };
  },
  async mounted() {
    await this.$store.commit('getCurrentClass');
    await this.$store.commit('getCompetition');
    if (this.$store.state.competition) {
      this.$store.state.competition.classes.sort((a, b) => a.totalPoints > b.totalPoints ? -1 : a.totalPoints < b.totalPoints ? 1 : 0);
      this.maxPoints = this.$store.state.competition.classes[0].totalPoints;
    }
  },
  methods: {
    async createClass() {
      /**
      * Create a new class
      */
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      };
      const url = `/api/class`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setCurrentClass', res.class);
        this.$set(this.alerts, 'Successfully created a class!', 'success');
        setTimeout(() => this.$delete(this.alerts, 'Successfully created a class!'), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async removeClass() {
      /**
      * Remove a class.
      */
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      };
      const url = `/api/class/${this.$store.state.currentClass._id}`;
      try {
        const r = await fetch(url, requestOptions);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setCurrentClass', null);
        this.$set(this.alerts, 'Successfully removed a class!', 'success');
        setTimeout(() => this.$delete(this.alerts, 'Successfully removed a class!'), 3000);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style>

</style>

  