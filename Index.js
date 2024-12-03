// URL til 3. parts service for citater
const QUOTE_API_URL = "https</meta>://zenquotes.io/api/random"; // Eksempel API til citater

// Funktion til at hente citat
function fetchDailyQuote() {
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
}

// Kald funktionen, når siden indlæses
fetchDailyQuote();