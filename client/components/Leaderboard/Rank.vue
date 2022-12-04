<template>
  <section>
    <h2>{{classs.teacher.username}}'s class: {{classs.totalPoints}} points</h2>
  </section>
</template>
  
<script>

export default {
  name: 'Rank',
  props: {
    classs: {
      type: Object,
      required: true
    }
  }
};
</script>
  
<style scoped>

</style>