<template>
  <v-card>
    <v-card-title class="text-subtitle-2">Hint Setting</v-card-title>
    <v-card-text>
      Points per Milestone: {{$store.state.hintSetting.pointsUntilReward}} <br/>
      Number of Hints per Milestone: {{$store.state.hintSetting.numberOfHints}}
    </v-card-text>
  </v-card>
  
</template>
  
<script>
export default {
  name: 'HintSettingComponent',
}
</script>