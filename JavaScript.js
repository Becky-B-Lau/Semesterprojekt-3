const{createApp} = vue;
createApp({
    data(){
        return calculate_percentage(200, 10000)
    },
    
    methods:{
        Calculate_Goal(){
            this.calculate_percentage.push(200, 10000)
        }
    }

}).mount('#app');
