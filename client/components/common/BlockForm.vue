<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <v-form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="(field, index) in fields"
        :key="field.id"
      >
        <v-text-field
          :type="field.id === 'password' ? 'password' : 'text'"
          :label="field.label"
          v-model="fields[index].value"
        ></v-text-field>
      </div>
    </article>
    <article
      v-if="booleanFields.length"
    >
      <div
        v-for="(booleanField, index) in booleanFields"
        :key="booleanField.id"
      >
        <v-checkbox
          v-model="booleanFields[index].value"
          :label="booleanField.label"
        ></v-checkbox>
      </div>
    </article>
    <v-btn 
        depressed 
        color="secondary"
        small
        @click="submit"
      >
      {{ title }}
    </v-btn>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </v-form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      allFields: [],
      booleanFields: [],
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null // Function to run after successful form submission
    };
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        const answerChoices = this.fields
          .filter(field => field.id.includes('answerChoice'))
          .map(field => field.value);

        let answerChoicesField = [{id: 'answerChoices', label: 'answerChoices', value: answerChoices}];

        let allFields = this.fields.concat(this.booleanFields).concat(answerChoicesField);
        this.allFields = allFields;
        options.body = JSON.stringify(Object.fromEntries(
          allFields.map(field => {
            if (field.id === 'role') {
              return [field.id, field.value ? 'teacher' : 'student'];
            }
            const {id, value} = field;
            // field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        // if there's no error, then clear the form
        this.allFields.forEach(field => {
          field.value = '';
          if (field.id === 'role') {
            field.value = false;
          }
        })

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          this.$store.commit('setRole', res.user ? res.user.role : null);
          this.$store.commit('setUserId', res.user ? res.user._id : null);
        }

        if (this.setCurrentProblem) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setCurrentProblem', res.problem ? res.problem : null);
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
   font-family: inherit;
   font-size: inherit;
}
</style>
