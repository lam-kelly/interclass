<template>
  <v-card outlined>
    <v-card-text>
      <div>
        <v-row>
          <v-card-title class="text-h5 font-weight-black"> {{ problem.question }} </v-card-title>
          <v-spacer></v-spacer>
          <v-card-subtitle>
            <div> {{ problem.pointValue }} points </div>
            <div v-if="$store.state.role == 'student'"> {{ this.isSolved() }} </div>
          </v-card-subtitle>
        </v-row>

      </div>
      <v-card-subtitle v-if="$store.state.role == 'teacher'" class="pl-0 pb-0">
        Correct Answer: {{ problem.answer }}
      </v-card-subtitle>
      <v-radio-group v-model="selected">
        <v-radio v-for="(answerChoice, index) in problem.answerChoices" color="secondary"
          :disabled="eliminatedAnswerChoices.includes(answerChoice)"
          :off-icon="eliminatedAnswerChoices.includes(answerChoice) ? 'mdi-close-circle-outline' : '$radioOff'"
          :value="answerChoice" :label="answerChoice">
        </v-radio>
      </v-radio-group>
      <v-card-actions class="pa-0" v-if="$store.state.role == 'student'">
        <v-btn depressed :disabled="selected ? false : true" color="secondary" @click="submitAnswer">
          Submit
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn depressed :disabled="disableHints" color="secondary" @click="useHint">
          Hints: {{ $store.state.hints }}
        </v-btn>
      </v-card-actions>
      <v-card-actions class="pa-0" v-else>
        <v-btn icon outlined color="red" class="ml-auto" @click="deleteProblem">
          <v-icon> mdi-trash-can </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card-text>
    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </v-card>
</template>

<script>
export default {
  name: 'ProblemComponent',
  props: {
    // Data from the stored problem
    problem: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      questionDraft: this.problem.question,
      answerDraft: this.problem.answer,
      pointValueDraft: this.problem.pointValue,
      answerChoicesDraft: Object.assign([], this.problem.answerChoices), // deep copy an array
      selected: null,
      editing: false,
      updateHints: false,
      disableHints: false,
      eliminatedAnswerChoices: [],
      alerts: {} // Displays success/error messages encountered during freet modification
    }
  },
  methods: {
    isSolved() {
      return (this.problem.solvers.includes(this.$store.state.userid) ? "Solved" : "Not Solved")
    },
    useHint() {
      const possibleHints = this.problem.answerChoices.filter(
        answerChoice => answerChoice !== this.problem.answer &&
          !this.eliminatedAnswerChoices.includes(answerChoice)
      )
      if (possibleHints.length) {
        this.eliminatedAnswerChoices.push(possibleHints[Math.floor(Math.random() * possibleHints.length)]);

        this.updateHints = true;

        const params = {
          url: `/api/users/hints/`,
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ "hints": -1 }),
          callback: () => { }
        };

        this.request(params)

        if (possibleHints.length == 1) {
          this.disableHints = true;
        }
      }
    },
    deleteProblem() {
      /**
       * Deletes this problem.
       */
      const params = {
        url: `/api/problem/${this.problem._id}`,
        method: 'DELETE',
        callback: () => {
          this.$store.commit('refreshProblems');
          this.$store.commit('alert', {
            message: 'Successfully deleted problem!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async submitAnswer() {
      /**
       * Submit an answer choice as the answer and check its correctness (student action)
       */
      
      if (this.$store.state.competition) {
        this.classes = this.$store.state.competition.classes.sort((a, b) => a.totalPoints < b.totalPoints ? -1 : a.totalPoints > b.totalPoints ? 1 : 0);
      }

      const url = `/api/problem/${this.problem._id}`;
      const res = await fetch(url).then(async r => r.json());
      if (this.selected === res.problem.answer) {
        const params = {
          url: `/api/problem/${this.problem._id}/addStudent`,
          method: 'PATCH',
          message: 'Correct answer!',
          body: JSON.stringify({ newSolverId: this.$store.state.userid, newWorkerId: this.$store.state.userid, sortedClassesId: classes }),
          callback: () => {
            this.$store.commit('refreshProblems');
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 1000);
          }
        };
        this.request(params);
      }
      else {
        const params = {
          url: `/api/problem/${this.problem._id}/addStudent`,
          method: 'PATCH',
          message: 'Incorrect, please try again!',
          body: JSON.stringify({ newWorkerId: this.$store.state.userid }),
          callback: () => {
            this.$store.commit('refreshProblems');
            this.$set(this.alerts, params.message, 'error');
            setTimeout(() => this.$delete(this.alerts, params.message), 1000);
          }
        };
        this.request(params);
      }
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
      * @param params - Options for the request
      * @param params.body - Body for the request, if it exists
      * @param params.callback - Function to run if the the request succeeds
      */
      const options = {
        method: params.method, headers: { 'Content-Type': 'application/json' }
      };
      if (params.body) {
        options.body = params.body;
      }
      try {
        const r = await fetch(params.url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        if (this.updateHints) {
          const res = await r.json();
          this.$store.commit('setHints', res.user.hints);
          this.updateHints = false;
        }
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 1000);
      }
    }
  }
};

</script>

<style scoped>
.problem {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}

.v-radio.v-radio--disabled.contained-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn-outlined) {
  background-color: #DDE5ED !important;
  color: black !important;
}
</style>
