const QUOTE_API_URL = "https://zenquotes.io/api/random"; // URL til ZenQuotes API

const appQuote = Vue.createApp({
    data() {
        return {
            date: new Date().toLocaleDateString(), // Dagens dato
            quote: "Indlæser citat...", // Standardtekst, mens citat hentes
            author: "" // Standard forfatter (tom indtil citat hentes)
            
        };
    },
    methods: {
        async fetchQuote() {
            try {
                // Send en GET-anmodning til ZenQuotes API
                const response = await fetch(QUOTE_API_URL);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // Konverter API-svaret til JSON

                // Opdater data med citatet og forfatteren
                this.quote = data[0].q; // Selve citatet
                this.author = data[0].a; // Forfatteren
            } catch (error) {
                console.error("Fejl ved hentning af citat:", error);
                // Hvis der opstår en fejl, vis en fejlmeddelelse
                this.quote = "Kunne ikke hente citat.";
                this.author = "";
            }
        }
    },
    mounted() {
        this.fetchQuote(); // Hent citatet, når komponenten er indlæst

        // Opdater citatet hver 24 timer (86400000 ms = 24 timer)
        setInterval(this.fetchQuote, 86400000);
    }
}).mount('#appQuote');