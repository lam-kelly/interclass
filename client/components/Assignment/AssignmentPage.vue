<template>
    <main>
        <CreateProblem v-if="$store.state.role=='teacher'"/>
        <h2> Problems in {{ $store.state.currentAssignment.name }} </h2>
        <ProblemComponentStudent
            v-for="problem in $store.state.currentAssignment.problems"
            :key="problem.id"
            :problem="problem"
        />
    </main>
</template>

<script>
import ProblemComponent from '@/components/Problem/ProblemComponent.vue';
import ProblemComponentStudent from '@/components/Problem/ProblemComponentStudent.vue';
import CreateProblemForm from '@/components/Problem/CreateProblemForm.vue';
import CreateProblem from '@/components/Problem/CreateProblem.vue';

export default {
    name: 'AssignmentPage',
    components: {ProblemComponent, CreateProblemForm, ProblemComponentStudent, CreateProblem},
    data() {
        return {
            selected: '',
        }
    },
    async mounted () {
        await this.$store.commit('refreshProblems');
    }
};
</script>

<style scoped>

</style>
