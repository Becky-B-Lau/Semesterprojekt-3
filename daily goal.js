// Importerer `createApp` fra Vue-biblioteket
const { createApp } = Vue;

// Opretter en ny Vue-app
createApp({
    // Definerer appens data (tilstand)
    data() {
        return {
            steps: 6500, // Hardkodet antal skridt
            goal: 10000, // Hardkodet mål
            percentage: 0, // Procentdelen beregnes
            chart: null // Reference til cirkeldiagrammet
        };
    },
    
    // Definerer metoder (funktioner), der kan bruges i appen
    methods: {
        // Funktion til at beregne procentdelen og opdatere diagrammet
        updatePercentage() {
            this.percentage = (this.steps / this.goal) * 100; // Beregner procent
            this.updateChart(); // Opdaterer diagrammet
        },

        // Funktion til at initialisere cirkeldiagrammet
        initChart() {
            const ctx = document.getElementById('stepsChart').getContext('2d'); // Sørg for korrekt ID
            this.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [this.percentage, 100 - this.percentage], // Dynamisk data
                        backgroundColor: ['#4caf50', '#e0e0e0'], // Farver
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '70%', // Gør diagrammet hul i midten
                    plugins: {
                        legend: {
                            position: 'bottom' // Flyt legend til bunden
                        }
                    }
                }
            });
        },

        // Funktion til at opdatere diagrammets data
        updateChart() {
            if (this.chart) {
                this.chart.data.datasets[0].data = [this.percentage, 100 - this.percentage];
                this.chart.update();
            }
        }
    },

    // Funktion, der køres, når appen er monteret (klar til brug)
    mounted() {
        this.updatePercentage(); // Beregn procentdelen
        this.initChart(); // Initialiser diagrammet
    }
}).mount('#app');

