<template>
    <main>
        <h2> Problems in this assignment: </h2>
        <ProblemComponent 
            v-for="problem in assignment.problems"
            :key="problem.id"
            :problem="problem"
        />
    </main>
</template>

<script>
import ProblemComponent from '@/components/Problem/ProblemComponent.vue';

export default {
    name: 'ProblemPage',
    components: {ProblemComponent},
    props: {
        // Data from the stored problem
        assignment: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            selected: '',
        }
    }
};
</script>

<style scoped>

</style>
