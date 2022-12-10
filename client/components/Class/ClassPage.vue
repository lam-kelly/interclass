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
        <section v-if="$store.state.currentClass">
          <div class="text-h4">Welcome to {{ this.teacherName }}'s class!</div>
            <!-- <header>
          <h2>Welcome to {{ this.teacherName }}'s class!</h2>
        </header> -->
        <v-progress-linear
        color="light-green darken-4"
        height="10"
        :value="$store.state.currentClass.totalPoints"
        striped
      ></v-progress-linear>
        <!-- <div id="myProgress">
          <div id="myBar" :style="{width: this.classpoints + '%'}"></div>
        </div> -->
        <section>
          <div class="text-h5">Points: {{ $store.state.currentClass.totalPoints }}</div>
        <!-- <header>
          <h2>Points: {{ this.classpoints }}</h2>
        </header> -->
        </section>
        <br>
        
        <StudentComponent />
        <!-- <section>
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
      </section> -->

        <section v-if="$store.state.role === 'teacher'">
          <AddStudentComponent />
        <!-- <header>
            <h2>Add a student</h2>
        </header>
        <p>Type a student's username, and hit enter:</p>
        <input v-model="newstudent" @keyup.enter="addToClass()"/> -->
        <div class="text-h5">Delete the class?</div>
        <!-- <header> 
          <h2>Delete the class?</h2>
        </header> -->
        <v-btn class="deleteclass" rounded color="red" @click="removeClass">
                Remove Class
        </v-btn>
        <!-- <button class="deleteclass" @click="removeClass()">
                <i>Remove Class</i>
            </button>  -->
        </section>
        </section>

        <section v-else>
          <section v-if="$store.state.role === 'teacher'">
            <div class="text-h2">Create a new class!</div>
            <!-- <header>
            <h2>Create a new class!</h2>
            </header> -->
            <v-btn rounded color="primary" @click="createClass">
                Create
        </v-btn>
            <!-- <button @click="createClass()"> Create </button> -->
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
  import StudentComponent from '@/components/Class/StudentComponent.vue';
  import AddStudentComponent from '@/components/Class/AddStudentComponent.vue';
  
  export default {
    name: 'ClassPage',
    components: {StudentComponent, AddStudentComponent},
    data() {
      return {
        // classExists: false,
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
        // classExists: function(value) {
        //     this.getClass();
        // }
    },
    created() {
      // this.$store.commit('getCurrentClass');
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
            // if (!this.classExists){
            //   this.classExists = true;
            // }
            // this.classid = res['_id'];
            // this.classpoints = res['totalPoints'];
            this.teacherName = res['teacher']['username'];
            this.$store.commit('setCurrentClass', res);

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
          // this.$store.commit('getCurrentClass');
          // this.getClass();
          this.$store.commit('setCurrentClass', res.class);
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
        const url = `/api/class/add/${this.$store.state.currentClass._id}`;
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
        const url = `/api/class/remove/${this.$store.state.currentClass._id}`;
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
        const url = `/api/class/${this.$store.state.currentClass._id}`;
        try {
          const r = await fetch(url, requestOptions);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          // this.classExists = false;
          this.$store.commit('setCurrentClass', null);
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
  