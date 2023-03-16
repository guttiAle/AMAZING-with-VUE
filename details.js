const { createApp } = Vue
const app = createApp({
    data(){
        return{
            // Inicializo las variables
            eventos : [],
            valorID :(new URLSearchParams(location.search)).get("id")
        }
    },
    created(){
        fetch( 'https://mindhub-xj03.onrender.com/api/amazing' )
            .then( response => response.json() )
            .then( data => { 
                this.eventos = data.events
            }
            )
            .catch( err => console.log( err ) )
    }
})

app.mount('#appDetails')