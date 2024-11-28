const { createApp } = Vue;

createApp({
    data() {
        return {
            steps: 0, // Aktuelle skridt
            goal: 10000, // Dagligt mål
            percentage: 0, // Procentdel
            chart: null, // Chart.js reference
            achievedCount: 0, // Antal gange målet er nået
            images: [ // Liste over billeder
                './Images/Træ 0.png',
                './Images/Træ 1.png',
                './Images/Træ 2.png',
                './Images/Træ 3.png',
                './Images/Træ 4.png',
                './Images/Træ 5.png'
            ],
            currentImage: null // Det billede, der aktuelt vises
            
        };
    },
    methods: {
        // Hent data fra Flask-serveren
        async fetchSteps() {
            try {
                const response = await fetch('http://127.0.0.1:5001/'); // Flask API endpoint
                const data = await response.json();
            
                // Opdater Vue-data
                this.steps = data.step;
                this.goal = 10000
                // Beregn procentdel i frontend
                this.percentage = Math.min((this.steps / this.goal) * 100, 100); // Begræns til 100%
               
                // Kontrollér, om målet er nået
                this.checkGoalAchieved();

                // Opdater diagram
                this.updateChart();
            } catch (error) {
                console.error('Fejl ved hentning af skridttællerdata:', error);
            }
        },

        // Kontrollér, om målet er nået og vis nyt billede
        checkGoalAchieved() {
            const newAchievedCount = Math.floor(this.steps / this.goal);

            // Hvis der er nye opnåelser, opdater billedet
            if (newAchievedCount > this.achievedCount) {
                this.achievedCount = newAchievedCount;

                // Opdater billedet, hvis der stadig er flere billeder
                if (this.achievedCount <= this.images.length) {
                    this.currentImage = this.images[this.achievedCount - 1];
                }
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