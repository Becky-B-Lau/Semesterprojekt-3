const { createApp } = Vue;

createApp({
    data() {
        return {
            steps: 0, // Aktuelle skridt
            goal: 10000, // Dagligt mål
            percentage: 0, // Procentdel
            chart: null, // Chart.js reference
            
        };
    },
    
    methods: {
        // Hent data fra Flask-serveren
        async fetchSteps() {
            try {
                const response = await fetch('http://127.0.0.1:5001/'); // Flask API endpoint

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
            
                // Opdater Vue-data
                this.steps = data.step;
                this.goal = 10000
                // Beregn procentdel i frontend
                this.percentage = Math.min((this.steps / this.goal) * 100, 100); // Begræns til 100%
               
                // Opdater diagram
                this.updateChart();
            } catch (error) {
                console.error('Fejl ved hentning af skridttællerdata:', error);
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
                        backgroundColor: ['#0A6847', '#e0e0e0'] // Pink for opnået, grå for manglende
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