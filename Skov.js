const appSkov = Vue.createApp({
  data() {
    return {
      message: "hello",
      counter_tree: 0, // This is fetched from the backend
      imageUrl: './Images/Træ5_small.png', // Image source
      treesInRows: [] // To hold the number of images in each row
    };
  },
  methods: {
    async fetchSkov() {
      try {
        // Fetch data from the backend (replace URL with your actual backend endpoint)
        const response = await fetch('http://127.0.0.1:5001'); 
        const data = await response.json();

        // Update the counter_tree with the value from the backend
        this.counter_tree = data.counter_tree; // Expecting data like { counter_tree: 4 }

        // Recalculate the trees in rows after fetching the data
        this.calculateRows();
      } catch (error) {
        console.error('Error fetching tree count:', error);
      }
    },

    calculateRows() {
      // Create rows based on counter_tree, each row can have up to 12 trees
      const rows = [];
      let row = [];
      for (let i = 1; i <= this.counter_tree; i++) {
        row.push(i); // Add tree to the current row
        if (row.length === 12) {
          rows.push(row); // Push row with 12 trees to rows
          row = []; // Start a new row
        }
      }
      if (row.length > 0) {
        rows.push(row); // Push any remaining trees in the last row
      }
      this.treesInRows = rows; // Update the rows data
    }
  },
  mounted() {
    // Fetch tree count from backend when the app loads
    this.fetchSkov();

    // Refresh the tree count every 5 seconds
    setInterval(this.fetchSkov, 5000);
  }
}).mount('#appSkov');
