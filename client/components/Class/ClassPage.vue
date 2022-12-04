<template>
    <main>
    <section class="alerts">
    <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
    >
        <p>{{ alert }}</p>
    </article>
    </section>
    
    <section v-if="$store.state.username">
        <section v-if="this.classExists">
            <header>
          <h2>Welcome to {{ this.teacherName }}'s class!</h2>
        </header>
        <!-- <div id="myProgress">
          <div id="myBar" :style="{width: this.progress + '%'}"></div>
        </div> -->
        <section>
        <header>
          <h2>Points: {{ this.classpoints }}</h2>
        </header>
        </section>

        <section>
        <header>
          <h2>Students</h2>
        </header>
        <section
          v-if="this.students"
        >
          <div class="studentsInClass" v-for="(user, index) in this.students" :key="index">
            {{user.username}}
            <section v-if="$store.state.role === 'teacher'">
            <button class="removebutton" @click="removeFromClass(user._id)">
                <i>Remove</i>
            </button>  
            </section>
        </div>
        </section>
        <article
          v-else
        >
          <h3>No students found.</h3>
        </article>
      </section>

        <section v-if="$store.state.role === 'teacher'">
        <header>
            <h2>Add a student</h2>
        </header>
        <p>Type a student's username, and hit enter:</p>
        <input v-model="newstudent" @keyup.enter="addToClass()"/>
        <header> 
          <h2>Delete the class?</h2>
        </header>
        <button class="deleteclass" @click="removeClass()">
                <i>Remove Class</i>
            </button> 
        </section>
        </section>

        <section v-else>
          <section v-if="$store.state.role === 'teacher'">
            <header>
            <h2>Create a new class!</h2>
            </header>
            <button @click="createClass()"> Create </button>
          </section>
          <section v-else>
            <header>
          <h2>Hi! Please wait for a teacher to add you to a class :)</h2>
        </header>
        </section> 
        </section>

        <!-- <section v-else-if="$store.state.role === 'teacher'">
            <header>
          <h2>Create a new class!</h2>
        </header>
        <button @click="createClass()"> Create </button>
        </section>

        <section v-else>
            <header>
          <h2>Hi! Please wait for a teacher to add you to a class :)</h2>
        </header>
        </section> -->

    </section>

    <section v-else>
        <header>
          <h2>Login to view classes and more!</h2>
        </header>
        <article>
          <h3>
            <router-link to="/login">
              Sign in
            </router-link>
          </h3>
        </article>
      </section>

    </main>
  </template>
  
  <script>
//   import StudentComponent from '@/components/Class/StudentComponent.vue';
  
  export default {
    name: 'ClassPage',
    data() {
      return {
        classExists: false,
        students: [],
        newstudent: '',
        teacherName: '',
        classid: '',
        classpoints: '',
        // progress: 10,
        alerts: {} // Displays success/error messages encountered
      };
    },
    watch: {
        classExists: function(value) {
            this.getClass();
        }
    },
    created() {
      if (this.$store.state.username){
        this.getClass();
      }
    },
    methods: {
        async getClass() {
         /**
         * Get the class that a teacher or student belongs to
         */
        let url = `/api/class/teacher/${this.$store.state.userid}`;
        if (this.$store.state.role !== 'teacher'){
            url = `/api/class/student/${this.$store.state.userid}`;
        } 
        try {
          const r = await fetch(url);
          const res = await r.json();
          if (res !== null){
            if (!this.classExists){
              this.classExists = true;
            }
            this.classid = res['_id'];
            this.students = res['students'];
            this.classpoints = res['totalPoints'];
            this.teacherName = res['teacher']['username'];

          } 
          // const res = await r.text();
          
          // const res = await r.json();
          // if (!r.ok) {
          //   throw new Error(res.error);
          // }
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
      async createClass() {
         /**
         * Create a new class
         */
         const requestOptions = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              credentials: 'same-origin', 
              body: JSON.stringify({})
          };
        const url = `/api/class`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.getClass();
          this.$set(this.alerts, 'Successfully created a class!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully created a class!'), 3000);
          // this.$store.commit('alert', {
          //     message: 'Successfully added your source!', status: 'success'
          //   });
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }, 
      async addToClass() {
         /**
         * Add a student to a class.
         */
         const requestOptions = {
              method: 'PATCH',
              headers: {'Content-Type': 'application/json'},
              credentials: 'same-origin', 
              body: JSON.stringify({ "studentName": this.newstudent })
          };
        const url = `/api/class/add/${this.classid}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.getClass();
          this.$set(this.alerts, 'Successfully added a student!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully added a student!'), 3000);
          // this.$store.commit('alert', {
          //     message: 'Successfully added your source!', status: 'success'
          //   });
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
        this.newstudent = '';
      },
      async removeFromClass(studentID) {
         /**
         * Remove a student from a class.
         */
         const requestOptions = {
              method: 'PATCH',
              headers: {'Content-Type': 'application/json'},
              credentials: 'same-origin', 
              body: JSON.stringify({ "studentId": studentID })
          };
        const url = `/api/class/remove/${this.classid}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.getClass();
          this.$set(this.alerts, 'Successfully removed a student!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully removed a student!'), 3000);
          // this.$store.commit('alert', {
          //     message: 'Successfully added your source!', status: 'success'
          //   });
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
      async removeClass() {
         /**
         * Remove a class.
         */
         const requestOptions = {
              method: 'DELETE',
              headers: {'Content-Type': 'application/json'},
              credentials: 'same-origin', 
              body: JSON.stringify({})
          };
        const url = `/api/class/${this.classid}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          this.classExists = false;
          // this.getClass();
          this.$set(this.alerts, 'Successfully removed a class!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully removed a class!'), 3000);
          // this.$store.commit('alert', {
          //     message: 'Successfully removed a source!', status: 'success'
          //   });
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  section {
    display: flex;
    flex-direction: column;
  }
  
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  
  button {
      margin-right: 10px;
  }

  #myProgress {
  width: 100%;
  background-color: grey;
}

#myBar {
  height: 30px;
  background-color: green;
}
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  </style>
  