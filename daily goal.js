// Importerer `createApp` fra Vue-biblioteket
const { createApp } = Vue;

// Opretter en ny Vue-app
createApp({
    // Definerer appens data (tilstand)
    data() {
        return {
            steps: 200, // Antal skridt taget
            goal: 10000, // Dagligt mål for skridt
            percentage: 0, // Procentdelen af målet, der er opnået
            apiUrl: 'http://127.0.0.1:5000/calculate_percentage', // API-adressen til procentberegning
            chart: null // Reference til cirkeldiagrammet
        };
    },
    
    // Definerer metoder (funktioner), der kan bruges i appen
    methods: {
            // Debug-metode for at teste, om Vue fungerer
            debugTest() {
                console.log("Vue fungerer korrekt!");
            alert("Vue fungerer korrekt!");
            },

                testClick() {
                    console.log("Vue virker korrekt!");
                    alert("Vue fungerer!");
                },

        // Asynkron funktion til at opdatere procentdelen baseret på nuværende skridt og mål
        async updatePercentage() {
            try {
                // Sender en POST-forespørgsel til API'et med data om skridt og mål
                const response = await axios.post(this.apiUrl, {
                    current: this.steps, // Nuværende antal skridt
                    total: this.goal // Målet for dagen
                });
                // Opdaterer `percentage` med den værdi, der returneres af API'et
                this.percentage = respones.data.percentage;    
                this.updateChart(); // Opdater cirkeldiagrammet            
            } catch (error) {
                // Logger fejl, hvis der opstår problemer med API-kaldet
                console.error('Error udregn procent:', error);
            }
        },

        // Funktion til at tilføje et antal skridt og opdatere procentdelen
        AddStep(amount) {
            this.steps += amount; // Tilføjer `amount` til det aktuelle antal skridt
            this.updatePercentage(); // Opdaterer procentdelen
        },

        // Funktion til at nulstille skridtene til 0 og opdatere procentdelen
        ResetSteps() {
            this.steps = 0; // Sætter `steps` til 0
            this.updatePercentage(); // Opdaterer procentdelen
        },

        // Funktion til at initialisere cirkeldiagrammet
        initChart() {
            const ctx = document.getElementById('stepsChart').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'doughnut', // Cirkel-diagramtype
                data: {
                    labels: ['Opnået', 'Manglende'], // Labels for sektorerne
                    datasets: [{
                        data: [this.percentage, 100 - this.percentage], // Fordeling af data
                        backgroundColor: ['#4caf50', '#e0e0e0'] // Farver: grøn for opnået, grå for manglende
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '70%' // Gør cirklen hul i midten
                }
            });
        },

        // Funktion til at opdatere diagrammet, når dataene ændres
        updateChart() {
            if (this.chart) {
                this.chart.data.datasets[0].data = [this.percentage, 100 - this.percentage];
                this.chart.update();
            }
        },

        // (Muligvis ufuldstændig) funktion til at beregne målet – denne er ikke fuldt implementeret
        Calculate_Goal() {
            this.calculate_percentage.push(200, 10000); // (Ser ud til at mangle korrekt logik her)
        },

        // Funktion til at teste cirkeldiagrammet med fiktiv data
        TestChart() {
            console.log("TestChart kaldt!"); // Tilføj debug-log
            this.steps = Math.floor(Math.random() * this.goal); // Genererer tilfældige skridt
            this.updatePercentage(); // Opdaterer procentdelen og diagrammet
        }
    },

    // Funktion, der køres, når appen er monteret (klar til brug)
    mounted() {
        // Kalder `updatePercentage` for at initialisere procentdelen
        this.updatePercentage();

        // Initialiser cirkeldiagrammet
        this.initChart();

        // Beregner antal millisekunder til midnat
        const now = new Date(); // Henter den aktuelle dato og tid
        const msUntilMidnight = new Date(
            now.getFullYear(), // Året
            now.getMonth(), // Måneden
            now.getDate() + 1, // Næste dag
            0, 0, 0 // Midnat (kl. 00:00:00)
        ) - now; // Forskellen mellem midnat og nu i millisekunder

        // Sætter en timeout til at nulstille skridt ved midnat
        setTimeout(() => {
            this.ResetSteps(); // Nulstiller skridtene til 0
            // Starter en intervalfunktion, der nulstiller skridtene hver 24. time
            setInterval(this.ResetSteps, 24 * 60 * 60 * 1000); // 24 timer i millisekunder
        }, msUntilMidnight);
    }

    // Monterer appen til HTML-elementet med id'et `#app`
}).mount('#app');

