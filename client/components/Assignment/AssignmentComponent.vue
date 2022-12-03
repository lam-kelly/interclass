<template>
    <main>
        <button @click="setCurrentAssignment">
            {{ assignment.name }} 
        </button>
    </main>
</template>

<script>
import AssignmentComponent from '@/components/Assignment/AssignmentComponent.vue';

export default {
    name: 'AssignmentPage',
    components: {AssignmentComponent},
    props: {
        assignment: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            selected: '',
        }
    },
    methods : {
        setCurrentAssignment() {
            this.$store.commit('setCurrentAssignment', this.assignment);
            this.$router.push(`/assignment/${this.$store.state.currentAssignment._id}`)
        }
    }
};
</script>

<style scoped>

</style>