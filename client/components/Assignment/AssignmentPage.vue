<template>
    <main>
        <h2> Problems in this assignment: </h2>
        <ProblemComponent 
            v-for="problem in $store.state.currentAssignment.problems"
            :key="problem.id"
            :problem="problem"
        />
    </main>
</template>

<script>
import ProblemComponent from '@/components/Problem/ProblemComponent.vue';

export default {
    name: 'AssignmentPage',
    components: {ProblemComponent},
    data() {
        return {
            selected: '',
        }
    }
};
</script>

<style scoped>

</style>
