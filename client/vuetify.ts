import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
    theme: {
      themes: {
        light: {
        //   primary: "#14C6FF",
        //   secondary: "#424242",
        //   accent: "#82B1FF",
            primary: "#645E9D",
            secondary: "#6C969D",
            accent: "#99d5c9",
            darkpurple: "#392b58",
            error: "#FF5252",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FFC107",
            lightblue: "#14c6FF",
            yellow: "#FFCF00",
            pink: "#FF1976",
            orange: "#FF8657",
            magenta: "#C33AFC",
            darkblue: "#1E2D56",
            gray: "#909090",
            neutralgray: "#9BA6C1",
            green: "#2ED47A",
            red: "#FF5c4E",
            darkblueshade: "#308DC2",
            lightgray: "#BDBDBD",
            lightpink: "#FFCFE3",
            white: "#FFFFFF",
            fieryrose: "f45b69",
            black: "000000"
        }
      }
    }
}

export default new Vuetify(opts)