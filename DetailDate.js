Vue.createApp({
    data() {
        return {
            message: "hello",
            age: 29,
            selectedDate: null,
            steps: "Indlæser...",
            phase: "-",
            imageUrl: "",
            altText: "Ingen billede tilgængeligt"
        };
    },
    methods: {
        async fetchData() {
            const urlParams = new URLSearchParams(window.location.search);
            this.selectedDate = urlParams.get("date"); // Få den valgte dato fra URL
        
            try {
                const response = await fetch('http://127.0.0.1:5001/');
                const allData = await response.json();
        
                console.log(`All Data: ${JSON.stringify(allData)}`);
        
                // Antag, at `detailDate` er en liste
                const detailDateList = allData.detailDate;
                console.log(`All Data: ${JSON.stringify(detailDateList)}`);
                console.log(detailDateList);
        
                if (Array.isArray(detailDateList)) {
                    // Find data for den valgte dato
                    const dateData = detailDateList.find(item => item[3] === this.selectedDate);
        
                    console.log("Matched dateData:", dateData);
        
                    if (dateData) {
                        // Opdater Vue data-variabler
                        this.steps = dateData[1] 
                        this.phase = dateData[2] 
                       
                    } else {
                        // Ingen data for den valgte dato
                        this.steps = "Ingen data tilgængelig for denne dato.";
                        this.phase = "0";
                        this.imageUrl = "";
                        this.altText = "Ingen billede tilgængeligt";
                    }
                } else {
                    console.error("detailDate er ikke en liste:", detailDateList);
                    this.steps = "Kunne ikke finde detailDate data.";
                }
            } catch (error) {
                console.error("Fejl ved hentning af data:", error);
                this.steps = "Kunne ikke hente data.";
                this.phase = "-";
                this.imageUrl = "";
                this.altText = "Ingen billede tilgængeligt";
            }
        }
        
    },
    mounted() {
        // Hent data, når komponenten er monteret
        this.fetchData();
    }
}).mount("#appDetailDate");