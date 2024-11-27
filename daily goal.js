const { createApp } = Vue;

createApp({
    data() {
        return {
            steps: 0, // Aktuelle skridt
            goal: 10000, // Dagligt mål
            percentage: 0, // Procentdel
            chart: null, // Chart.js reference
            goalAchieved: false // Ny data til styring af billedets synlighed
        };
    },
    methods: {
        // Hent data fra Flask-serveren
        async fetchSteps() {
            try {
                const response = await fetch('/steps'); // Flask API endpoint
                const data = await response.json();

                // Opdater Vue-data
                this.steps = data.steps;
                this.goal = data.goal;
                this.percentage = data.percentage;

                // Kontrollér, om målet er nået
                this.checkGoalAchieved();

                // Opdater diagram
                this.updateChart();
            } catch (error) {
                console.error('Fejl ved hentning af skridttællerdata:', error);
            }
        },

        // Kontrollér og vis billede, hvis målet er nået
        checkGoalAchieved() {
            if (this.steps >= this.goal) {
                this.goalAchieved = true;
            }
        },

        // Initialiser Chart.js diagrammet
        initChart() {
            const ctx = document.getElementById('stepsChart').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Opnået', 'Manglende'],
                    datasets: [{
                        data: [this.percentage, 100 - this.percentage],
                        backgroundColor: ['#FFD1DC', '#e0e0e0'] // Pink for opnået, grå for manglende
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        },

        // Opdater Chart.js data
        updateChart() {
            if (this.chart) {
                this.chart.data.datasets[0].data = [this.percentage, 100 - this.percentage];
                this.chart.update();
            }
        }
    },
    mounted() {
        this.initChart(); // Initialiser diagrammet
        this.fetchSteps(); // Hent initiale data

        // Opdater data hvert 5. sekund
        setInterval(this.fetchSteps, 5000);
    }
}).mount('#app');