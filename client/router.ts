import Vue from 'vue';
import VueRouter from 'vue-router';
import AccountPage from './components/Account/AccountPage.vue';
import AssignmentPage from './components/Assignment/AssignmentPage.vue';
import HomePage from './components/Home/HomePage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import ClassPage from './components/Class/ClassPage.vue';
import CompetitionPage from './components/Competition/CompetitionPage.vue';
import LeaderboardPage from './components/Leaderboard/LeaderboardPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: HomePage},
  {path: '/leaderboard', name: 'Leaderboard', component: LeaderboardPage},
  {path: '/competition', name: 'Competition', component: CompetitionPage},
  {path: '/class', name: 'Class', component: ClassPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/assignment/:id', name: 'Assignment', component: AssignmentPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {  
  if (router.app.$store) {
    if (to.name === 'Leaderboard' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Leaderboard and are not signed in
      return;
    }

    if (to.name === 'Competition' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Competition and are not signed in
      return;
    }

    if (to.name === 'Assignment' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Leaderboard and are not signed in
      return;
    }

    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
