import Vue from 'vue';
import store from './store';
import api from './api';

import moment from 'moment';

const updateStore = function(){

    // Bookings
    api.get('/api/booking/')
    .then( (res) => {
        store.state.rents = res.data.filter( (el) => {
            return !el.retrieveDate;
        });

        store.state.bookings = res.data.filter( (el) => {
            return el.retrieveDate;
        });

        this.movementOnNextDays();
    }).catch( (err) => {
    console.log('API Error:', err);
    });

    // Books
    api.get('/api/books')
    .then(res => {
        store.state.books = res.data;
    })
    .catch(err => {
        console.log('API Error:', err);
    });

    // Users
    api.get('/api/users')
    .then(res => {
        store.state.users = res.data;
    })
    .catch(err => {
        console.log('API Error:', err);
    });
}

const nextDays = function(){
    moment.locale('pt-BR');
    let date = new Date();
    let nextDays = [];
    nextDays.push({
        date: moment(date).format('DD/MM/YYYY'),
        formattedDate: 'Hoje'
    });

    for(let i = 1; i < 7; i++){
        if(i === 1){
            nextDays.push({
                date: moment(date).add(i, 'd').format('DD/MM/YYYY'),
                formattedDate: 'Amanhã'
            });
            continue;
        }
        nextDays.push({
            date: moment(date).add(i, 'd').format('DD/MM/YYYY'),
            formattedDate: moment(date).add(i, 'd').format('DD/MM')
        });
    }

    return nextDays;
}

const movementOnNextDays = function(){
    let fluxValues = [];

    let nextDays = this.nextDays();
    nextDays = nextDays.map(el => el.date);

    for(let i = 0; i < nextDays.length; i++){
        let movementCount = 0;
        let bookingsMovementCount;
        bookingsMovementCount = store.state.bookings.filter( (el) => {
            return el.retrieveDate === nextDays[i] || el.delivery === nextDays[i];
        });
        movementCount += bookingsMovementCount.length;

        let rentsMovementCount;
        rentsMovementCount = store.state.rents.filter( (el) => {
            return el.delivery === nextDays[i];
        });
        movementCount += rentsMovementCount.length;

        fluxValues.push(movementCount);
    }
    store.dispatch('registerFluxValues', fluxValues);
}


const validateBooking = function(book, duration, type, retrieveDate){
    // 'Return false' means its validated and available!

    retrieveDate = retrieveDate || null; // Optional parameter
    if(duration > 30)
        return 'O período máximo de aluguel é de 30 dias.';

    if(book.amountUsed < book.quantity){
        return false;
    }else{
        let maxDate = moment(new Date(), 'DD-MM-YYYY'); // The farest user can rent
        let minDate; // The nearest user can start renting
        let today = new Date();
        today = moment(today);

        let bookingPresences = store.state.bookings.filter( (el) => {
            return el.bookId === book._id;
        });
        
        let rentPresences = store.state.rents.filter( (el) => {
            return el.bookId === book._id;
        });

        let presences = rentPresences.concat(bookingPresences);
        
        // Every date will represent unavailability in that day...

        if(type === 'rent'){
            let hasMaxDate = false;

            minDate = moment(presences[0].delivery, "DD-MM-YYYY"); // Starts minDate with any delivery date

            for(let i = 0; i < presences.length; i++){
                if(presences[i].retrieveDate){ // Se não existir uma data reservada, não terá um limite máximo de dias
                    hasMaxDate = true;
                    if(moment(presences[i].retrieveDate, "DD-MM-YYYY").isAfter(maxDate))
                        maxDate = moment(presences[i].retrieveDate, "DD-MM-YYYY");
                }

                if(moment(presences[i].delivery, "DD-MM-YYYY").isBefore(minDate))
                    minDate = moment(presences[i].delivery, "DD-MM-YYYY");

            }

            if(hasMaxDate){
                if(today.add(duration, 'd').isBefore(moment(maxDate)))
                    return false;
                else{
                    if(today.diff(maxDate, 'days') >= 2){
                        return 'Este livro não pode ser alugado com essa duração porque já está reservado'
                        + ' para outra pessoa no dia ' + maxDate.format('DD/MM') + '. O máximo, portanto, é'
                        + ' de ' + today.diff(maxDate, 'days') + ' dias.';
                    }else
                        return 'Este livro não pode ser alugado hoje porque já está em uso por outra pessoa. '
                        + 'O mesmo estará disponível no dia ' + minDate.format('DD/MM') + '!';
                }
            }else{
                return 'Este livro não pode ser alugado com essa duração porque já está reservado'
                + ' para outra pessoa. O mesmo estará disponível no dia ' + minDate.format('DD/MM') + '!';
            }

        }else{
            let sameDate = false;
            minDate = moment(presences[0].delivery, "DD-MM-YYYY"); // Starts minDate with any delivery date
            for(let i = 0; i < presences.length; i++){
                if(presences[i].retrieveDate){ // Se não existir uma data reservada, não terá um limite máximo de dias
                    if(moment(presences[i].retrieveDate, 'DD-MM-YYYY').format('DD/MM/YYYY') === retrieveDate.format('DD/MM/YYYY'))
                        sameDate = true;
                    if(moment(presences[i].retrieveDate, "DD-MM-YYYY").isAfter(maxDate))
                        maxDate = moment(presences[i].retrieveDate, "DD-MM-YYYY");
                }

                if(moment(presences[i].delivery, "DD-MM-YYYY").isBefore(minDate))
                    minDate = moment(presences[i].delivery, "DD-MM-YYYY");

            }

            if(sameDate)
                return 'Este livro não pode ser reservado nesse dia porque já estará em uso por outra pessoa.';

            if(retrieveDate.isBefore(moment(minDate))){
                if(retrieveDate.add(duration, 'd').isBefore(moment(maxDate)))
                    return false;
                else{
                    if(retrieveDate.diff(maxDate, 'days') >= 2){
                        return 'Este livro não pode ser alugado com essa duração porque já está reservado'
                        + ' para outra pessoa no dia ' + maxDate.format('DD/MM') + '. O máximo, portanto, é'
                        + ' de ' + today.diff(maxDate, 'days') + ' dias.';
                    }else
                        return 'Este livro não pode ser reservado nesse dia porque já estará em uso por outra pessoa.';
                }
            }else{
                if(retrieveDate.isAfter(moment(maxDate)))
                    return false;
                else{
                    if(retrieveDate.isBefore(moment(maxDate))){
                        if(retrieveDate.add(duration, 'd').isBefore(moment(maxDate)))
                            return false;
                        else{
                            return 'Não é possível reservar este livro com essa duração porque outra pessoa já reservou '
                            + 'o livro para o dia ' + maxDate.format('DD/MM') + '.';
                        }
                    }
                }
            }

        }
    }
}


const util = {
    updateStore,
    nextDays,
    movementOnNextDays,
    validateBooking
}

Vue.prototype.$util = util;

export default util;