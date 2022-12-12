<template>
    <main>
        <v-card-title primary-title class="justify-center pa-10">
        <div>
            <div class="text-h1">Welcome to InterClass</div>
            <p class="text-center">Use InterClass to view classes, competitions, assignments, and more!</p>
        </div>
        </v-card-title>
        <v-expansion-panels>
            <v-expansion-panel>
            <v-expansion-panel-header>
                What is InterClass?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                Growing up, we all know how hard it is to do homework or pay attention in class. That's where InterClass comes in. 
                <br/> <br/> InterClass helps make learning fun and easy, allowing classes to complete assignments, earn points and rewards, and compete against other classes. InterClass keeps students engaged in learning and motivated to complete assignments, and is best aimed towards elementary school classes for when teachers want to introduce concepts like basic math. 
                <br/> <br/> If this all sounds like everything you've always wanted, come join us in the magic of InterClass!
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                I'm a teacher. How do I make a class?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                When you start out on InterClass, the first thing to do is to look at the Class page. 
                <br/> <br/> The Class page shows the amount of points your class has earned, and all of the students in your class. 
                If you do not have a class, you can first create a class, then add students into your class or remove students from your class. 
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                What are competitions?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                Competitions are a way for classes to compete against each other. Students can work through the same assignments and earn points for their class.
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                I'm a teacher. How do I make a competition? How do I join a competition?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                Once you have a class, you can either create a new competition or join an ongoing competition on the Competition page. 
                <br/> <br/> You can start a new competition by entering a name for the competition and clicking "Create". An example of a name could be "Unit 1 Math".
                <br/> <br/> Alternatively, you can join a competition by entering in the ID of an existing competition and clicking "Join". 
                Afterwards, you can leave or end the competition that you are currently in. 
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                I'm a student. Why can't I join a class or a competition?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                You will be added to a class by your teacher. Once your teacher joins a competition, you and all other students in your class will be automatically added to the competition.
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                What is an assignment? 
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                Assignments are what students can work through and solve in a competition to earn points. An assignment is made of one or more problems. 
                <br/> <br/> A problem has a question, four answer choices, a correct answer, and a point value. When a student solves a problem, they earn the points for that problem for their class. 
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                I'm a teacher, and I just joined a competition. How do I make an assignment? 
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                When you join a competition, you have the option to create a new assignment. 
                <br/> <br/> First, give your assignment a name, like "Fractions Practice". 
                Once you've made the assignment, you can add new problems to the assignment. For each problem, you can enter in the question, the point value, and the four answer choices. You can mark the correct answer by checking the checkbox next to an answer choice. 
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                I'm a student in a competition. How do I know if I already completed an assignment?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                Good question! When you go to the Competition page and click on an assignment, you will be able to view all of the problems in the assignment. Each problem will show either "Solved" or "Not Solved" for you.
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                I'm a student working on an assignment. I resubmitted a problem, but I didn't get any points this time. Why is that?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                The first time you completed a problem in an assignment, you earned the points for that problem for your class. Afterwards, you can practice solving the problems again for better understanding, but you will not earn more points for resubmitting.
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                What are hints? How do I use them?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                Hints are rewarded to students in a class once the class's total points reaches a milestone goal during a competition. A student can use hints on an assignment to eliminate incorrect answer choices. The amount of hints is limited, so be sure to use them carefully! 
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                What are alliances? 
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                An alliance is automatically formed between the bottom two classes in a competition. In an alliance, any points that a class gains are given to both classes. The alliance is removed once a class advances up, and a new alliance is automatically formed between the last two classes.
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                Why can't my class join an alliance? 
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                Alliances are meant to help reduce pressure on classes and make competitions friendlier, by giving a helping hand to the bottom two classes. Since alliances are automatically formed to help these classes, you cannot create your own alliance or opt-in to join an alliance. 
            </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
            <v-expansion-panel-header>
                How can I see how well my class is doing in a competition?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                You can use the Leaderboard page to view the current points of the classes participating in the competition. Alternatively, you can also view your own class's points on the Class page.
            </v-expansion-panel-content>
            </v-expansion-panel>

        </v-expansion-panels>
        <!-- <section>
            <div class="text-h1">Welcome to InterClass</div>
        </section>
        <p class="text-center">Use InterClass to view classes, competitions, assignments, and more!</p> -->
    </main>
</template>

<script>

export default {
  name: 'HomePage',
  components: {

  }
};
</script>