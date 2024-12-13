const appSkov = Vue.createApp({
  data() {
    return {
      message: "hello",
      counter_tree: 0, // This is fetched from the backend
      imageUrl: './Images/Træ5_small.png', // Image source
      id: 0,
      dato: "x",
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
    async showTreeId(id) {
      this.id = id;
      try {
          // Fetch data from the backend (replace URL with your actual backend endpoint)
          const response = await fetch('https://restfulonazura-g8dhdmhedpbuc4e4.northeurope-01.azurewebsites.net/'); 
          const data = await response.json();
  
          // Put all data into variable
          const rawData = data.first_counter_tree; 
  
          // Convert array of arrays to array of objects
          const allData = rawData.map(item => ({
              counter_tree: item[0],  // First value in sub-array is counter_tree
              date: item[1]          // Second value in sub-array is date
          }));
  
          // Find the date for the matching counter_tree (id)
          const matchingTree = allData.find(tree => tree.counter_tree === id);
  
          // If a match is found, set the date; otherwise, handle no match
          if (matchingTree) {
              this.date = matchingTree.date;
          } else {
              this.date = "Dato ikke fundet"; // Handle case where ID is not found
          }
  
      } catch (error) {
          console.error("Error fetching data:", error);
          this.date = "Fejl ved hentning af data";
      }
  
      // Show date in an alert
      if (this.date == "Dato ikke fundet" || this.date == "Fejl ved hentning af data")
      {
        alert('Whoops. ' + this.date);
      }

      else {
        alert('Du har tilføjet Træ nr: ' + id + '\nDen ' + this.date + "\nHvor er du bare sej!");
      }

      }
 
  
  },
  mounted() {
    // Fetch tree count from backend when the app loads
    this.fetchSkov();

    // Refresh the tree count every 5 seconds
    setInterval(this.fetchSkov, 5000);
  }
}).mount('#appSkov');
