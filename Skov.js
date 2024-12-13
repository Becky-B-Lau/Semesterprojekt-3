const appSkov = Vue.createApp({
  data() {
    return {
      message: "hello",
      counter_tree: 0, // This is fetched from the backend
      imageUrl: './Images/Træ5_small.png', // Image source
    };
  },
  methods: {
    async fetchSkov() {
      try {
        // Fetch data from the backend (replace URL with your actual backend endpoint)
        const response = await fetch('https://restfulonazura-g8dhdmhedpbuc4e4.northeurope-01.azurewebsites.net/'); 
        const data = await response.json();

        // Update the counter_tree with the value from the backend
        this.counter_tree = data.counter_tree; // Expecting data like { counter_tree: 4 }

        // Recalculate the trees in rows after fetching the data
        this.calculateRows();
      } catch (error) {
        console.error('Error fetching tree count:', error);
      }
    },
    showTreeId(id) {
      alert('Træ nr: ' + id);
    }
  },
  mounted() {
    // Fetch tree count from backend when the app loads
    this.fetchSkov();

    // Refresh the tree count every 5 seconds
    setInterval(this.fetchSkov, 5000);
  }
}).mount('#appSkov');
