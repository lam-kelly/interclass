<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <v-form @submit.prevent="submit">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            dense
            v-model="value"
            type="text"
            :label="label"
            :placeholder="placeholder"
          ></v-text-field>
        </v-col>
        <v-col>
        <v-btn
          flat
          rounded
          color="secondary"
          type="submit"
        >
          {{ button }}
        </v-btn>
      </v-col>
      </v-row>
    </v-container>
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
  name: 'InlineForm',
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {value: '', alerts: {}};
  }
};
</script>

<style scoped>
form {
    display: flex;
    position: relative;
}

input {
    padding: 0 5px;
    min-width: 200px;
}
</style>
