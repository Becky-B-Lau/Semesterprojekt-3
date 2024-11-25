const{createApp} = vue;
createApp({
    data(){
        return {
            steps: 200,
            goal: 10000,
            percentage: 0,
            apiUrl: 'http://127.0.0.1:5000/calculate_percentage'
        };
    },
    
    methods:{
        async updatePercentage()
        {
            try
            {
                const respones = await axios.post(this.apiUrl,{
                    current: this.steps,
                    total: this.goal
                });
                this.percentage= respones.data.percentage;                
            } catch(error){console.error('Error udregn procent:',error)};
        },        
        AddStep(amount){
            this.steps +=amount
            this.updatePercentage();
        },
        Calculate_Goal(){
            this.calculate_percentage.push(200, 10000)
        }
    },
    mounted(){this.updatePercentage();}

}).mount('#app');
