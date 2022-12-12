<template>
    <main>
        <CreateProblemForm v-if="$store.state.role=='teacher'"/>
        <h2> Problems in {{ $store.state.currentAssignment.name }} </h2>
        <ProblemComponent
            v-for="problem in $store.state.currentAssignment.problems"
            :key="problem.id"
            :problem="problem"
        />
    </main>
</template>

<script>
import ProblemComponent from '@/components/Problem/ProblemComponent.vue';
import CreateProblemForm from '@/components/Problem/CreateProblemForm.vue';

export default {
    name: 'AssignmentPage',
    components: {ProblemComponent, CreateProblemForm},
    data() {
        return {
            selected: '',
        }
    },
    async mounted () {
        await this.$store.commit('refreshProblems');
        await this.$store.commit('refreshHints');
    }
};
</script>

<style scoped>

</style>
