<template>
    <main>
        <div v-if="editing">
            Question:
            <textarea
                :value="questionDraft"
                @input="questionDraft = $event.target.value"
            />
        </div>
        <div v-else> 
            <h2> {{ problem.question }} </h2>
            <h3> Correct Answer: {{ problem.answer }} </h3>
        </div>
        <div v-for="(answerChoice, index) in problem.answerChoices">
            <div v-if="editing">
                Answer Choice {{ index+1 }}
                <textarea
                    :value="answerChoicesDraft[index]"
                    @input="answerChoicesDraft[index] = $event.target.value"
                />
            </div>
            <div v-else>
                <input 
                    v-model="selected"
                    type="radio"
                    :value="answerChoice"
                />
                <label>{{ answerChoice }}</label>
            </div>
        </div>
        <div v-if="editing">
            <p> Enter correct answer here: </p>
            <textarea
                :value="answerDraft"
                @input="answerDraft = $event.target.value"
            />
        </div>
        <div v-if="$store.state.role=='teacher'">
            <button
                v-if="editing"
                @click="submitEdit"
            >
                ✅ Save changes
            </button>
            <button
                v-if="editing"
                @click="stopEditing"
            >
                🚫 Discard changes
            </button>
            <button
                v-if="!editing"
                @click="startEditing"
            >
                ✏️ Edit
            </button>
            <button @click="deleteProblem">
                🗑️ Delete
            </button>
        </div>
        <div v-else>
            <button
                @click="submitAnswer"
            >
                Submit
            </button>
        </div>
        <p>Point Value: {{ problem.pointValue }}</p>
    </main>
</template>

<script>
export default {
    name: 'ProblemComponent',
    props: {
        // Data from the stored problem
        problem: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            questionDraft: this.problem.question,
            answerDraft: this.problem.answer,
            answerChoicesDraft: this.problem.answerChoices,
            selected: null,
            editing: false,
            alerts: {} // Displays success/error messages encountered during freet modification
        }
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this problem.
             */
            this.editing = true; 
            this.questionDraft = this.problem.question; 
            this.answerDraft = this.problem.answer;
            this.answerChoicesDraft = this.problem.answerChoices;
        },
        stopEditing() {
            /**
             * Disables edit mode on this problem.
             */
            this.editing = false;
            this.questionDraft = this.problem.question;
            this.answerDraft = this.problem.answer;
            this.answerChoicesDraft = this.problem.answerChoices;
        },
        deleteProblem() {
            /**
             * Deletes this problem.
             */
            const params = {
                url: `/api/problem/${this.problem._id}`,
                method: 'DELETE',
                callback: () => {
                this.$store.commit('alert', {
                    message: 'Successfully deleted problem!', status: 'success'
                });
                }
            };
            this.request(params);
        },
        submitEdit() {
            /**
             * Updates problem to have the submitted draft content.
             */
            if (this.problem.question === this.questionDraft && this.problem.answer === this.answerDraft && this.problem.answerChoices === this.answerChoicesDraft) {
                const error = 'Error: Edited problem details should be different than current problem details.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }
            const params = {
                url: `/api/problem/${this.problem._id}/problemDetails`,
                method: 'PATCH',
                message: 'Successfully edited problem!',
                body: JSON.stringify({question: this.questionDraft, answer: this.answerDraft, answerChoices: this.answerChoicesDraft}),
                callback: () => {
                this.$set(this.alerts, params.message, 'success');
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request(params);
            // UPDATE/REFRESH THE PROBLEMS
        },

        async submitAnswer() {
            /**
             * Submit an answer choice as the answer and check its correctness (student action)
             */
            // change this into normal GET to access the returned response
            const url = `/api/problem/${this.problem.id}/addStudent`;
            const res = await fetch(url).then(async r => r.json());

            if (this.selected === res.problem.answer) {
                const params = {
                    url: `/api/problem/${this.problem._id}`,
                    method: 'PATCH',
                    // message: 'Successfully revised problem!',
                    body: JSON.stringify({isSolver: true, isWorker: true}),
                    callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                    }
                };
                this.request(params);
            }
            else {
                const params = {
                    url: `/api/problem/${this.problem._id}`,
                    method: 'PATCH',
                    // message: 'Successfully revised problem!',
                    body: JSON.stringify({isWorker: true}),
                    callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                    }
                };
                this.request(params);
            }
        },
        async request(params) {
            /**
             * Submits a request to the freet's endpoint
            * @param params - Options for the request
            * @param params.body - Body for the request, if it exists
            * @param params.callback - Function to run if the the request succeeds
            */
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            if (params.body) {
                options.body = params.body;
            }
            try {
                const r = await fetch(params.url, options);
                if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
                }
                this.editing = false;
                this.$store.commit('refreshProblems');
                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};

</script>

<style scoped>

</style>
