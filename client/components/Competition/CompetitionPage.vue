<template>
  <main>
    <section v-if="!$store.state.competition">
      <section v-if="$store.state.role === 'teacher'">
        <h2 v-if="!$store.state.currentClass">Create a Class First</h2>
        <article v-else>
          <h2>Start a new Competition</h2>
          <CreateCompetitionForm
            placeholder="Competition Name"
            button="Create"
          />
          <h2>Join a Competition</h2>
          
          <JoinCompetitionForm
            placeholder="Competition ID"
            button="Join"
          />
        </article>
      </section>
      <section v-else>
        Wait for your teacher to join a competition
      </section>
    </section>
    <section v-else>
      <h2>Competition: {{$store.state.competition.name}}</h2>
      <article v-if="$store.state.role === 'teacher'">
        <h4>Competition ID: {{$store.state.competition._id}}</h4>
        <p>Share your competition ID, so that other teachers can join your competition!</p>
        <button @click="leaveCompetition">Leave Competition</button>
        <button @click="endCompetition">End Competition</button>
        <button @click="deleteCompetition">Delete Competition</button>
        <SetAssignmentName/>
        <h2> Assignments in this Competition: </h2>
      </article>
      <AssignmentComponent
          v-for="assignment in $store.state.competition.assignments"
          :key="assignment.id"
          :assignment="assignment"
        />
    </section>
  </main>
</template>

<script>
import CreateCompetitionForm from '@/components/Competition/CreateCompetitionForm.vue';
import JoinCompetitionForm from '@/components/Competition/JoinCompetitionForm.vue';
import AssignmentComponent from '@/components/Assignment/AssignmentComponent.vue';
import SetAssignmentName from '@/components/Assignment/SetAssignmentName.vue';

export default {
  name: 'CompetitionPage',
  components: {
    AssignmentComponent,
    CreateCompetitionForm,
    JoinCompetitionForm,
    SetAssignmentName
  },
  methods: {
    async leaveCompetition() {
      const url = `/api/competition/${this.$store.state.competition._id}/leave`;
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
        this.$store.commit('getCompetition');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async endCompetition() {
      const url = `/api/competition/${this.$store.state.competition._id}/end`;
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
        this.$store.commit('getCompetition');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async deleteCompetition() {
      const url = `/api/competition/${this.$store.state.competition._id}`;
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
      };
      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('getCompetition');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
  async mounted() {
    this.$store.commit('getCompetition');
    this.$store.commit('getCurrentClass');
  }
};
</script>
