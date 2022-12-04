<template>
    <article class="problem">
        <div v-if="editing">
            Question:
            <textarea
                :value="questionDraft"
                @input="questionDraft = $event.target.value"
            />
            
        </div> 
        <h2 v-else> 
            {{ problem.question }} 
        </h2>
        <h3 v-if="$store.state.role=='teacher' && !editing"> 
            Correct Answer: {{ problem.answer }} 
        </h3>
        <div v-for="(answerChoice, index) in problem.answerChoices">
            <div v-if="editing">
                Answer Choice {{ index+1 }}
                <textarea

                    v-model="answerChoicesDraft[index]"
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
        <div v-if="editing">
            Point Value:
            <textarea
                :value="pointValueDraft"
                @input="pointValueDraft = $event.target.value"
            />
        </div>
        <p v-else>Point Value: {{ problem.pointValue }}</p>
        <section class="alerts">
            <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
    </article>
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
            pointValueDraft: this.problem.pointValue,
            answerChoicesDraft: Object.assign([], this.problem.answerChoices), // deep copy an array
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
            this.pointValueDraft = this.problem.pointValue;
            this.answerChoicesDraft = Object.assign([], this.problem.answerChoices);
        },
        stopEditing() {
            /**
             * Disables edit mode on this problem.
             */
            this.editing = false;
            this.questionDraft = this.problem.question;
            this.pointValueDraft = this.problem.pointValue;
            this.answerDraft = this.problem.answer;
            this.answerChoicesDraft = Object.assign([], this.problem.answerChoices);
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
            // deep check if arrays are equal
            let answerChoicesChanged = false;
            for (let i=0; i<this.answerChoicesDraft.length; i++) {
                if (this.answerChoicesDraft[i] !== this.problem.answerChoices[i]) {
                    answerChoicesChanged = true;
                }
            }

            if (this.problem.question === this.questionDraft && this.problem.answer === this.answerDraft && !answerChoicesChanged && this.problem.pointValue === this.pointValueDraft) {
                const error = 'Error: Edited problem details should be different than current problem details.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }
            const params = {
                url: `/api/problem/${this.problem._id}/problemDetails`,
                method: 'PATCH',
                message: 'Successfully edited problem!',
                body: JSON.stringify({question: this.questionDraft, answer: this.answerDraft, answerChoices: this.answerChoicesDraft, pointValue: this.pointValueDraft}),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request(params);
        },

        async submitAnswer() {
            /**
             * Submit an answer choice as the answer and check its correctness (student action)
             */
            const url = `/api/problem/${this.problem._id}`;
            const res = await fetch(url).then(async r => r.json());
            // NEED TO GIVE FEEDBACK ON WHETHER ANSWER WAS CORRECT
            if (this.selected === res.problem.answer) {
                const params = {
                    url: `/api/problem/${this.problem._id}/addStudent`,
                    method: 'PATCH',
                    message: 'Correct answer!',
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
                    url: `/api/problem/${this.problem._id}/addStudent`,
                    method: 'PATCH',
                    message: 'Incorrect, please try again!',
                    body: JSON.stringify({isWorker: true}),
                    callback: () => {
                        console.log('should be here')
                        this.$set(this.alerts, params.message, 'error');
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
.problem {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}

</style>
