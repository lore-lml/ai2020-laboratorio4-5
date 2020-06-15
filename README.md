# Applicazioni Internet Lab 4-5 PoliTO
Author: Lorenzo Limoli

## Istruzioni Avvio

1. Run `npm install`
2. Run `npm run start-all`
3. Aprire il browser all'indirizzo `https://localhost:4200` (importante che sia HTTPS in quanto ssl è attivo)

In alternativa al punto (2.) aprire un terminale e lanciare `npm start` 
e in un secondo terminale `npm run json-server`

## Implementazioni Extra

- Di ogni azione viene notificato il successo tramite `snackbar` con possibilità di effettuare rollback
- Inserito un badge che visualizza il numero degli utenti selezionati tramite checkbox anche su pagine diverse
- La checkbox master sull'header della `mat-table` agisce solamente sulle checkbox degli studenti presenti in quella pagina
- Abilitati proxy (`localhost:3000 -> https://localhost:4200/api`) e ssl

## Modalità di utilizzo

1. L'unico account registrato ha le seguenti credenziali:<br>
    Email: `olivier@mail.com`<br>
    Password: `bestPassw0rd`

2. Navigazione
    - La tab `Studenti` e la tab della sidenav `Applicazioni Internet` redirigono alla stessa view
    - La tab della sidenav `Programmazione di Sistema` redirige alla view `Page Not Found`
    - La home page mostra `Home` quando non si è loggati e `Benvenuto {email}` in caso contrario
    - Quando si fa `logout` si viene rediretti alla home page
    - Quando il token jwt scade o avviene qualche errore durante le richieste http, 
    l'applicazione effettua un logout automatico

3. Nella searchbar è stato applicato un `tempo di debounce` prima di applicare effettivamente il filtro

4. Durante un login appaiono dei campi di errore nel caso in cui email e password non soddisfino
i requisiti minimi di formattazione e un altro campo di errore che appare a seguito della http
request non andata a buon fine





