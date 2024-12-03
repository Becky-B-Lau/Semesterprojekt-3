const appImage = Vue.createApp ({
    data() {
            return {
                phase: 0, // Standard fase (hentes fra databasen)
                imageUrl: './Images/Træ 0.png' // Standardbillede
            };
        },
        methods: {
            async fetchPhase() {
                try {
                    // Fetch fase fra din backend
                    const response = await fetch('http://127.0.0.1:5001'); // Ændr URL til din endpoint
                    const data = await response.json();

                    // Opdater fase og billede
                    this.phase = data.phase; // Forvent, at backend returnerer { phase: 0-5 }
                    this.updateImage();
                } catch (error) {
                    console.error('Fejl ved hentning af fase:', error);
                }
            },
            updateImage() {
                const images = [
                    './Images/Træ 0.png',
                    './Images/Træ 1.png',
                    './Images/Træ 2.png',
                    './Images/Træ 3.png',
                    './Images/Træ 4.png',
                    './Images/Træ 5.png'
                ];
            
                this.imageUrl = images[this.phase] || images[0]; // Vælg billede ud fra fase
            }
        },
        mounted() {
            // Hent fase fra backend, når appen loader
            this.fetchPhase();

            // Genopfrisk fase hver 5. sekund
            setInterval(this.fetchPhase, 5000);
        }
}).mount('#appimage');