Vue.createApp({
    data() {
        return {
            selectedDate: null,
            footsteps: "Indlæser...",
            phase: "Indlæser...",
            image: "",
            goal: 10000, // Dagligt mål
            percentage: 0, // Procentdel
            chart: null, // Chart.js reference
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
                        this.footsteps = dateData[1] 
                        this.phase = dateData[2] 
                        if (this.phase == 0) { 
                            this.image = "Images/Træ 0.png";
                        } else if (this.phase == 1) {
                            this.image = "Images/Træ 1.png";
                        } else if (this.phase == 2) {    
                            this.image = "Images/Træ 2.png";
                        } else if (this.phase == 3) {        
                            this.image = "Images/Træ 3.png";
                        } else if (this.phase == 4) {        
                            this.image = "Images/Træ 4.png";
                        } else if (this.phase == 5) {        
                            this.image = "Images/Træ 5.png";
                        }
                       
                    } else {
                        // Ingen data for den valgte dato
                        this.footsteps = "Ingen data tilgængelig for denne dato.";
                        this.phase = "0";
                        this.image = "Images/Træ 0.png";
                    }
                } else {
                    console.error("detailDate er ikke en liste:", detailDateList);
                    this.footsteps = "Kunne ikke finde detailDate data.";
                }
            } catch (error) {
                console.error("Fejl ved hentning af data:", error);
                this.footsteps = "Kunne ikke hente data.";
                this.phase = "-";
                this.image = "Images/Træ 0.png";
            }
        },
        // Hent data fra Flask-serveren
        async fetchSteps() {
            try {
                const response = await fetch('http://127.0.0.1:5001/'); // Flask API endpoint

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const allData = await response.json();
        
                console.log(`All Data: ${JSON.stringify(allData)}`);
        
                // Antag, at `detailDate` er en liste
                const detailDateList = allData.detailDate;
                console.log(`All Data: ${JSON.stringify(detailDateList)}`);
                console.log(detailDateList);
        
                if (Array.isArray(detailDateList)) {
                    // Find data for den valgte dato
                    const dateData = detailDateList.find(item => item[3] === this.selectedDate);
                    // Opdater Vue-data
                    this.footsteps = dateData[1];
                    this.goal = 10000
          // Beregn procentdel i frontend
                    this.percentage = Math.min((this.footsteps / this.goal) * 100, 100); // Begræns til 100%
          
          // Opdater diagram
                     this.updateChart();

                }
              
            } catch (error) {
                console.error('Fejl ved hentning af skridttællerdata:', error);
            }
        },

        // Initialiser Chart.js diagrammet
        initChart() {
            const ctx = document.getElementById('detailDateChart').getContext('2d');
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
        updateChart() {
            if (this.chart) {
                this.chart.data.datasets[0].data = [this.percentage, 100 - this.percentage];
                this.chart.update();
            } else {
                console.error("Diagrammet er ikke initialiseret korrekt.");
            }
        }
        
        
    },
    mounted() {
        // Hent data, når komponenten er monteret
        this.fetchSteps();
        this.fetchData()
        .then(() => {
            this.initChart(); // Initialiser diagrammet først, når data er hentet
        })
        .catch((error) => {
            console.error("Fejl ved indlæsning af data:", error);
        });   
           
    }
}).mount("#appDetailDate");