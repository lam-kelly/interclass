<template>
  <v-list-item>
    <v-progress-linear
      v-model="valueAsPercent"
      color="primary"
      height="25"
    >
      <div>{{classs.teacher.username}}'s class: {{classs.totalPoints}} points</div>
    </v-progress-linear>
  </v-list-item>
</template>
  
<script>

export default {
  name: 'Rank',
  props: {
    classs: {
      type: Object,
      required: true
    },
    maxPoints: {
      type: Number,
      required: true
    }
  },
  data() {
    return {valueAsPercent: this.classs.totalPoints/this.maxPoints*100}
  }
};
</script>
  
<style scoped>

</style>