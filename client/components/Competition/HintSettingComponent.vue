<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        plain
        :ripple=false
        v-bind="attrs"
        v-on="on"
      >
        View Hint Settings
      </v-btn>
    </template>
    <span>
      Points per Milestone: {{$store.state.hintSetting.pointsUntilReward}} <br/>
      Number of Hints per Milestone: {{$store.state.hintSetting.numberOfHints}}
    </span>
  </v-tooltip>
</template>
  
<script>
export default {
  name: 'HintSettingComponent',
  data () {
    return {
      show: false,
    }
  },
}
</script>