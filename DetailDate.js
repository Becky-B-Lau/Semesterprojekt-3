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
            // Læs datoen fra URL'en
            const urlParams = new URLSearchParams(window.location.search);
            this.selectedDate = urlParams.get("date");

            try {
                // Hent data fra backend eller API
                const response = await fetch('http://127.0.0.1:5001/');
                const allData = await response.json();

                // Find data for den valgte dato
                const dateData = allData[this.selectedDate];

                if (dateData) {
                    // Opdater Vue data-variabler
                    this.steps = dateData.steps || "Ingen data";
                    this.phase = dateData.phase || "-";
                    this.imageUrl = dateData.imageUrl || "";
                    this.altText = `Fase ${dateData.phase || "-"} billede`;
                } else {
                    // Ingen data for den valgte dato
                    this.steps = "Ingen data tilgængelig for denne dato.";
                    this.phase = "-";
                    this.imageUrl = "";
                    this.altText = "Ingen billede tilgængeligt";
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