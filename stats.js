const { createApp } = Vue
const app = createApp({
    data(){
        return{
            eventos : [],
            listaCategoriasEventosPasados : [],
            listaCategoriasEventosFuturos : [],
            eventosPasados : [],
            eventosFuturos : [],
            listaSegundaTabla : [],
            listaTercerTabla : [],
            listaPrimerTabla : []
        }
    },
    created(){
        fetch( 'https://mindhub-xj03.onrender.com/api/amazing' )
            .then( response => response.json() )
            .then( data => { 
                this.eventos = data.events
                this.listaCategoriasEventosPasados = Array.from( new Set((data.events.filter(evento => evento.date > data.currentDate)).map(evento => evento.category)))
                this.listaCategoriasEventosFuturos = Array.from( new Set((data.events.filter(evento => evento.date < data.currentDate)).map(evento => evento.category)))
                this.eventosFuturos = data.events.filter(evento => evento.date < data.currentDate)
                this.eventosPasados = data.events.filter(evento => evento.date > data.currentDate)

                // 1er tabla
                let firstTable = []
                let porcentajes = data.events.map(event => (event.assistance * 100) / event.capacity).filter(e => e > 0)
                let max = Math.max(...porcentajes)
                let min = Math.min(...porcentajes)
                let capacity = data.events.map(event => event.capacity)
                let maxCapacity = Math.max(...capacity)
                firstTable.push((data.events[(porcentajes.indexOf(max))]).name, (data.events[(porcentajes.indexOf(min))]).name, (data.events[capacity.indexOf(maxCapacity)]).name)
                this.listaPrimerTabla = firstTable

                // 2da tabla
                this.juntadoraTabla(this.listaCategoriasEventosPasados, 
                    this.calculadoraGanancias(this.eventosPasados, this.listaCategoriasEventosPasados, 'estimate'),
                    this.calculadoraAsistencia(this.eventosPasados, this.listaCategoriasEventosPasados, 'estimate'),
                    'listaSegundaTabla')

                // 3er tabla
                this.juntadoraTabla(this.listaCategoriasEventosFuturos, 
                    this.calculadoraGanancias(this.eventosFuturos, this.listaCategoriasEventosFuturos, 'assistance'),
                    this.calculadoraAsistencia(this.eventosFuturos, this.listaCategoriasEventosFuturos, 'assistance'),
                    'listaTercerTabla')
            }
            )
            .catch( err => console.log( err ) )
    },
    methods: {
        calculadoraGanancias(list, listaCategoriasFuturasPasadas, propiedad){
            let dict = {}
            for (let i of listaCategoriasFuturasPasadas){
                dict[i] = 0
                for (j of list){
                    if (j.category.includes(i)){
                        dict[i] += (j[propiedad]*j.price)
                    }
                }
            }
            return dict
        },

        calculadoraAsistencia(list, listaCategoriasFuturasPasadas, propiedad){
            let dict = {}
            let contador 
            for (let i of listaCategoriasFuturasPasadas){
                dict[i] = 0
                contador = 0
                for (let j = 0; j < list.length; j++){
                    if (list[j].category.includes(i)){
                        dict[i] += ((list[j][propiedad]*100) / list[j].capacity)
                        contador += 1
                    }
                }
                dict[i] = dict[i] / contador
            }
            return dict
        },

        juntadoraTabla(listaEventos, ganancias, asistencia, tabla){
            for (let i = 0; i < listaEventos.length; i++){
                this[tabla].push({nombre : listaEventos[i], ganancia : ganancias[listaEventos[i]], asistencia : parseInt(asistencia[listaEventos[i]])})
            }
        }
    }
})

app.mount('#appStats')