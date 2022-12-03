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
    setCompetition(state, competition) {
      /**
       * Update the stored competition to the specified one.
       * @param competition - the competition to set
       */
      state.competition = competition;
    },
    setCurrentClass(state, currentClass) {
      /**
       * Update the stored competition to the specified one.
       * @param currentClass - the class to set
       */
      state.currentClass = currentClass;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
