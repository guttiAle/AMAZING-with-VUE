const { createApp } = Vue
const app = createApp({
    data(){
        return{
            // Inicializo las variables
            valorBusqueda : '',
            listaCategorias : [],
            eventos : [],
            checked : [],
            eventosFiltrados : [],
        }
    },
    created(){
        fetch( 'https://mindhub-xj03.onrender.com/api/amazing' )
            .then( response => response.json() )
            .then( data => { 
                this.listaCategorias = Array.from( new Set(data.events.map(evento => evento.category)))
                this.eventos = data.events.filter(evento => evento.date > data.currentDate)
                this.eventosFiltrados = this.eventos
            }
            )
            .catch( err => console.log( err ) )
    },
    computed : {
        filtro(){
            let filtradoBusqueda = this.eventos.filter(evento => evento.name.toLowerCase().includes(this.valorBusqueda.toLowerCase()))

            let filtradoCheck = filtradoBusqueda.filter(evento => this.checked.includes(evento.category) || this.checked.length == 0 )
            this.eventosFiltrados = filtradoCheck
        }
    }
})

app.mount('#app')