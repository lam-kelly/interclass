<template>
  <main>
    <v-container v-if="!$store.state.competition">
      <v-container v-if="$store.state.role === 'teacher'">
        <v-card v-if="!$store.state.currentClass" elevation="0" class="d-flex" height="82vh">
          <v-row align="center">
            <v-col align="center">
              <v-card-title class="text-h1" style="justify-content: center; word-break: break-word">Create a class
                first</v-card-title>
            </v-col>
          </v-row>
        </v-card>
        <v-card flat v-else>
          <v-card-title>Join a Competition</v-card-title>
          <JoinCompetitionForm label="Competition ID" placeholder="ex: 63840fdge3j503f9" button="Join" />
          <CreateCompetitionForm />
        </v-card>
      </v-container>
      <v-container fill-height fluid v-else>
        <v-card elevation="0" class="d-flex" height="82vh">
          <v-row align="center">
            <v-col align="center">
              <v-card-title class="text-h1" style="justify-content: center; word-break: break-word">Wait for your
                teacher to join a competition</v-card-title>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-container>

    <v-container v-else>
      <v-row>
        <v-col>
          <v-card flat>
            <v-row>
              <v-col md="auto">
                <v-card-title>Competition: {{ $store.state.competition.name }}</v-card-title>
              </v-col>
              <v-spacer></v-spacer>
              <v-col>
                <v-card-actions v-if="$store.state.role === 'teacher'">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="error" outlined small v-bind="attrs" v-on="on" @click="leaveCompetition">
                        Leave Competition
                      </v-btn>
                    </template>
                    <span>Leaving this competition will remove your class from this competition.</span>
                  </v-tooltip>
                  <template>
                    <div class="text-center">
                      <v-dialog v-model="dialog" width="500">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn color="error" outlined small v-bind="attrs" v-on="on">
                            End Competition
                          </v-btn>
                        </template>

                        <v-card>
                          <v-card-title class="text-h5 grey lighten-2" style="word-break: break-word;">
                            Are you sure you want to end this competition?
                          </v-card-title>

                          <v-card-text>
                            Ending this competition will end the competition for all classes. <br />
                            WARNING: This is an irreversible action.
                          </v-card-text>

                          <v-divider></v-divider>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" text @click="leaveCompetition">
                              Confirm
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>
                  </template>
                </v-card-actions>
                <HintSettingComponent v-else-if="$store.state.hintSetting"></HintSettingComponent>
              </v-col>
            </v-row>

            <v-row v-if="$store.state.role === 'teacher'">
              <v-col>
                <v-card-subtitle>
                  Competition ID: {{ $store.state.competition._id }} <br />
                  Share your competition ID with other teachers,
                  so that their classes can join your competition!
                </v-card-subtitle>
              </v-col>
              <v-col md="auto">
                <CreateHintSetting v-if="$store.state.role === 'teacher' && !$store.state.hintSetting">
                </CreateHintSetting>
                <HintSettingComponent v-else></HintSettingComponent>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="$store.state.role === 'teacher'">
        <v-col>
          <v-card flat>
            <v-card-title>Create a new Assignment</v-card-title>
            <SetAssignmentName label="Assignment Name" placeholder="ex. Fractions practice" button="Create" />
          </v-card>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col>
          <v-card flat>
            <v-card-title>Current Assignments:</v-card-title>
            <v-list v-if="$store.state.competition.assignments.length">
              <AssignmentComponent v-for="assignment in $store.state.competition.assignments" :key="assignment.id"
                :assignment="assignment" />
            </v-list>
            <v-container fill-height fluid v-else>
              <v-card flat class="justify-center">
                <v-card-title class="text-h5">No assignments yet!</v-card-title>
              </v-card>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script>
import CreateCompetitionForm from '@/components/Competition/CreateCompetitionForm.vue';
import JoinCompetitionForm from '@/components/Competition/JoinCompetitionForm.vue';
import AssignmentComponent from '@/components/Assignment/AssignmentComponent.vue';
import SetAssignmentName from '@/components/Assignment/SetAssignmentName.vue';
import HintSettingComponent from '@/components/Competition/HintSettingComponent.vue';

export default {
  name: 'CompetitionPage',
  components: {
    AssignmentComponent,
    CreateCompetitionForm,
    JoinCompetitionForm,
    SetAssignmentName,
    HintSettingComponent
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    async leaveCompetition() {
      this.dialog = false;
      const url = `/api/competition/${this.$store.state.competition._id}/leave`;
      const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({ 'classId': this.$store.state.currentClass._id })
      };
      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('getCompetition');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async endCompetition() {
      const url = `/api/competition/${this.$store.state.competition._id}/end`;
      const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Sends express-session credentials with request
        body: JSON.stringify({ 'classId': this.$store.state.currentClass._id })
      };
      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('getCompetition');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async deleteCompetition() {
      const url = `/api/competition/${this.$store.state.competition._id}`;
      const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Sends express-session credentials with request
      };
      try {
        const r = await fetch(url, options);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('getCompetition');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
  async mounted() {
    this.$store.commit('getCompetition');
    this.$store.commit('getCurrentClass');
    this.$store.commit('getHintSetting');
  }
};
</script>
