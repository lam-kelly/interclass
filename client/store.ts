import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    username: null, // Username of the logged in user
    role: null, // role of the logged in user
    userid: null, // ID of the logged in user
    competition: null, // competition that the logged in user is in
    currentAssignment: null,
    currentClass: null,
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setRole(state, role) {
      /**
       * Update the stored role to the specified one.
       * @param role - the role to set
       */
      state.role = role;
    },
    setUserId(state, userid) {
      /**
       * Update the stored ID to the specified one.
       * @param userid - the user ID to set
       */
      state.userid = userid;
    },
    async getCompetition(state) {
      /**
       * Refresh current competition
       */
       if (state.userid) {
        const url ='/api/competition';
        const res = await fetch(url).then(async r => r.json());
        state.competition = res;
      } 
    },
    setCurrentAssignment(state, assignment) {
      /**
       * Update the stored current assignment to the specified one.
       * @param assignment - new assignment to set
       */
      state.currentAssignment = assignment;
    },
    async getCurrentClass(state) {
      /**
       * Refresh current class
       */
       if (state.role && state.userid) {
        const url = state.role === 'teacher' ? `/api/class/teacher/${state.userid}` : `/api/class/student/${state.userid}`;
        const res = await fetch(url).then(async r => r.json());
        state.currentClass = res;
      } 
    },
    async refreshProblems(state) {
      /**
       * Refresh problems of current assignment
       */
      if (state.currentAssignment) {
        const url = `/api/assignment/${state.currentAssignment._id}`;
        const res = await fetch(url).then(async r => r.json());
        state.currentAssignment = res.assignment;
      }
      
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
