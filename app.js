const EventBus = new Vue()

Vue.component('tuto-query', {
  template: '<input @input="typing" v-model="query" type="text" placeholder="Cherchez la formation de vos rêves ! :D" class="self-center bg-white h-16 text-lg text-gray-700 px-4 rounded shadow-lg mb-10 md:mb-16 w-full md:w-3/4 lg:w-1/2">',
  data() {
    return {
      query: ''
    }
  },
  methods: {
    typing() {
      EventBus.$emit('typing', this.query)
    }
  }
})

Vue.component('tuto-list', {
  template: `
  <transition-group name="tuto-rotate" class="flex flex-wrap justify-center -mx-4">
    <tuto-list-item v-for="tuto in tutos" :key="tuto.id" :tuto="tuto"></tuto-list-item>
  </transition-group>
  `,
  props: {
    tutos: {
      required: true,
      type: Array
    }
  }
})

Vue.component('tuto-list-item', {
  template: `
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-6 sm:mb-8">
    <div class="shadow-lg flex flex-col h-full">
      <img :src="tuto.img" class="rounded-t">
      <div class="flex-grow flex bg-white rounded-b flex-col items-center px-4">
        <h1 class="text-2xl font-thin py-4 text-gray-700 text-center">{{ tuto.name }}</h1>
        <p class="text-center w-10/12 text-gray-600 mx-auto mb-auto">{{ tuto.content }}</p>
        <a :href="tuto.url" target="_blank" class="border-2 border-solid border-gray-600 hover:border-gray-800 hover:text-gray-800 p-2 text-gray-600 text-sm font-medium mt-6 mb-8 rounded">Voir un extrait</a>
      </div>
    </div>
  </div>
  `,
  props: {
    tuto: {
      required: true,
      type: Object
    }
  }
})

Vue.component('tuto-error', {
  template: '<h1 v-show="error.active" class="text-center font-hairline text-2xl sm:text-3xl md:text-4xl text-white">{{ error.message }}</h1>',
  props: {
    error: {
      required: true,
      type: Object
    }
  }
})

const vm = new Vue({
  el: '#app',
  created() {
    EventBus.$on('typing', query => {
      this.typing(query)
    })
    this.import()
  },
  data: {
    tutos: [],
    error: {
      active: false,
      message: ''
    },
    update: null
  },
  methods: {
    import(query = null) {
      const uri = encodeURIComponent(query)
      axios.get(query ? `data.php?q=${uri}` : 'data.php')
        .then(response => {
          if (response.data.length) {
            this.error.active = false
            this.tutos = response.data
          } else {
            this.error.active = true
            this.error.message = 'Désolé. Pas de résultat :('
          }
        })
        .catch(() => {
          this.error.active = true
          this.error.message = 'Une erreur s\'est produite :('
        })
    },
    typing(query) {
      clearTimeout(this.update)
      this.update = setTimeout(() => {
        this.tutos = []
        this.import(query)
      }, 750)
    }
  }
})
