const QUOTE_API_URL = "https://zenquotes.io/api/random"; // Eksempel API til citater

const appQuote = Vue.createApp ({
    data() {
            return {
                date: new Date().toLocaleDateString(), // Standard dato
                quoute: "Don't be afraid of death", // Standard fase (hentes fra databasen)
                author: "Minato" 
            };
        },
        methods: {
            async fetchQuote() {
                try {
                    // Fetch citat fra din backend
                    const response = await fetch('http://127.0.0.1:5001'); // Ændr URL til din endpoint
                    const data = await response.json();

                    // Opdater dataen
                    this.date = data.date; 
                    this.quote = data.quote; 
                    this.author = data.author;
                } catch (error) {
                    console.error('Fejl ved hentning af citat:', error);
                }
            },
            fetchDailyQuote() {
                axios.get(QUOTE_API_URL)
                    .then(response => {
                        const quoteData = response.data;
                        const quoteElement = document.getElementById("daily-quote");
                        
                        // Opdater citat-tekst
                        quoteElement.textContent = `"${quoteData.content}" - ${quoteData.author}`;
                    })
                    .catch(error => {
                        console.error("Fejl ved hentning af citat:", error);
                        document.getElementById("daily-quote").textContent = "Kunne ikke hente citat.";
                    });
            },
            mounted() {
                this.fetchQuote();
    
                setInterval(this.fetchQuote, 86400000);
            }
    }
}).mount('#appQuote');