<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Set Hint Setting
        </v-btn>
      </template>
      <v-card flat>
        <v-card-title> Award your class with hints </v-card-title>
        <v-card-subtitle>
          Your students will be awarded points everytime your class' total points reachings a milestone.<br/>
          For example, if your hint settings are 'Points per Milestone: 50' and 'Number of Hints per Milestone: 3',
          each student in your class will recieve 3 hints when your class' total points reaches 50, 100, 150...<br/>
          This setting applies to the whole competition, and once this setting is set, you will not be able to change it.
        </v-card-subtitle>
        <v-form class="pa-4 pt-0" ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="pointsUntilReward"
            :rules="postiveIntegerCheck"
            class="ma-0"
            label="Points per Milestone"
            placeholder="ex. 50"
            required>
          </v-text-field>

          <v-text-field
            v-model="hintsNum"
            :rules="postiveIntegerCheck"
            class="ma-0"
            label="Number of Hints per Milestone"
            placeholder="ex. 3"
            required>
          </v-text-field>

          <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
            Set Hint Reward Setting
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
    </v-dialog>
  </div>
</template>
<!-- <template> -->
  <!-- <v-card flat>
    <v-card-title> Award your class with hints </v-card-title>
    <v-card-subtitle>
      Your students will be awarded points everytime your class' total points reachings a milestone.<br/>
      For example, if your hint settings are 'Points per Milestone: 50' and 'Number of Hints per Milestone: 3',
      each student in your class will recieve 3 hints when your class' total points reaches 50, 100, 150...<br/>
      This setting applies to the whole competition, and once this setting is set, you will not be able to change it.
    </v-card-subtitle>
    <v-form class="pa-4 pt-0" ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="pointsUntilReward"
        :rules="postiveIntegerCheck"
        class="ma-0"
        label="Points per Milestone"
        placeholder="ex. 50"
        required>
      </v-text-field>

      <v-text-field
        v-model="hintsNum"
        :rules="postiveIntegerCheck"
        class="ma-0"
        label="Number of Hints per Milestone"
        placeholder="ex. 3"
        required>
      </v-text-field>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Set Hint Reward Setting
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


  </v-card> -->
<!-- </template> -->

<script>
export default {
  name: 'CreateHintSetting',
  data: () => ({
    valid: true,
    pointsUntilReward: '',
    hintsNum: '',
    postiveIntegerCheck: [
      v => !!v || 'Field is required',
      v => /^[0-9]*[1-9][0-9]*$/.test(v) || 'Must be a positive integer',
    ],
    alerts: {},
  }),

  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        await this.createHintSetting()
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    async createHintSetting() {
      const url = `/api/hint`;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({
          'competitionId': this.$store.state.competition._id,
          'pointsUntilReward': this.pointsUntilReward,
          'numberOfHints': this.hintsNum,
        })
      };
      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.reset();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 1000);
      }
    }
  },
}
</script>