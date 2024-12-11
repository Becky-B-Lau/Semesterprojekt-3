const QUOTE_API_URL = "https://api.quotable.io/random"; // URL til Quotable API

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
                console.log("Fetching quote...");
                // Send en GET-anmodning til Quotes API
                const response = await fetch(QUOTE_API_URL);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // Konverter API-svaret til JSON
                console.log(data); // Log the response data to check its structure

                this.quote = data.content; // Selve citatet
                this.author = data.author; // Forfatteren
                console.log("Quote fetched:", this.quote, this.author);

                // Save the quote and the date to localStorage
                localStorage.setItem('quote', this.quote);
                localStorage.setItem('author', this.author);
                localStorage.setItem('quoteDate', this.date);
            } catch (error) {
                console.error("Fejl ved hentning af citat:", error);
                // Hvis der opstår en fejl, vis en fejlmeddelelse
                this.quote = "Kunne ikke hente citat.";
                this.author = "";
            }
        },
        loadQuote() {
            const storedDate = localStorage.getItem('quoteDate');
            if (storedDate === this.date) {
                // If the quote for today is already stored, use it
                this.quote = localStorage.getItem('quote');
                this.author = localStorage.getItem('author');
            } else {
                // Otherwise, fetch a new quote
                this.fetchQuote();
            }
        }
    },
    mounted() {
        this.loadQuote(); // Load the quote when the component is mounted
    }
}).mount('#appQuote');
