<template>
  <v-card outlined>
    <v-card-title class="pa-0 pl-3 pt-2 "> Create a New Problem </v-card-title>
    <v-form class="pa-4 pt-0" ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="question" :rules="questionRules" class="ma-0" label="Question" required></v-text-field>

      <v-text-field v-model="pointValue" :rules="pointValueRules" class="ma-0" label="Point Value"
        required></v-text-field>

      <v-card-text>
        <v-row align="center" v-for="(answerChoice, index) in answerChoices" :key="index">
          <v-checkbox v-model="selectedAnswerChoices[index]" hide-details class="shrink mr-0 mt-0"
            @click="updateSelection(index)"></v-checkbox>
          <v-text-field class="ma-0" label="answer choice " v-model="answerChoices[index]"
            :rules="answerChoiceRules"></v-text-field>
        </v-row>
      </v-card-text>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Create Problem
      </v-btn>

      <v-btn color="error" class="mr-4" @click="reset">
        Reset Form
      </v-btn>

      <section class="alerts">
        <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
          <p>{{ alert }}</p>
        </article>
      </section>
    </v-form>


  </v-card>
</template>

<script>
export default {
  name: 'CreateProblemForm',
  data: () => ({
    valid: true,
    question: '',
    questionRules: [
      v => !!v || 'Question is required',
      // v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    pointValue: '',
    pointValueRules: [
      v => !!v || 'Assigning a point value is required',
      v => /^[0-9]*[1-9][0-9]*$/.test(v) || 'Point value must be a positive integer',
    ],
    answerChoiceRules: [
      v => !!v || 'Answer choice is required',
      // v => /^[0-9]*[1-9][0-9]*$/.test(v) || 'Point value must be a positive integer',
    ],
    selected: null,
    selectedAnswerChoices: [
      false,
      false,
      false,
      false,
    ],
    answerChoices: [
      '',
      '',
      '',
      ''
    ],
    checkbox: false,
    alerts: {},
  }),

  methods: {
    updateSelection(index) {
      if (this.selectedAnswerChoices[index] === true) {
        this.selected = index;
        this.selectedAnswerChoices.forEach((answerChoice, i) => {
          if (i !== index) {
            this.selectedAnswerChoices[i] = false
          }
        });
      }
      else {
        this.selected = null;
      }
    },
    async validate() {
      if (this.$refs.form.validate()) {
        await this.createProblem()
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    async createProblem() {
      const url = `/api/problem`;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({
          'question': this.question,
          'pointValue': this.pointValue,
          'answerChoices': this.answerChoices,
          'answer': this.answerChoices[this.selected],
        })
      };
      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('setCurrentProblem', res.problem ? res.problem : null);
        await this.addProblemToAssignment();
        this.reset();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 1000);
      }
    },
    async addProblemToAssignment() {
      const url = `/api/assignment/${this.$store.state.currentAssignment._id}`;
      const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({ 'newProblem': this.$store.state.currentProblem._id })
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
        setTimeout(() => this.$delete(this.alerts, e), 1000);
      }
    }
  },
}
</script>