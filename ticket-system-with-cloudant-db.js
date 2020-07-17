/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
    
    // Load async
    const async = require('async');
  
    // Load the client library by adding the following require definition:
    const Cloudant = require('@cloudant/cloudant');
    
    /*===================================
    PROVIDE YOUR CREDENTIALS AND DB HERE:
    ===================================*/
    
    // Initialize the client library by supplying your credentials:
    const cloudant = new Cloudant({ url: 'YOUR-CLOUDANT-URL-HERE', plugins: { iamauth: { iamApiKey: 'YOUR-CLOUDANT-API-KEY-HERE' } } });

    // db to be used
    const db = cloudant.db.use('YOUR-DB-NAME-HERE');
                
    /*=================================*/

    const main = async (params) => {
        
        // define a returnString
        let returnString = '';
        
        // define the params
        ticketOperation = params.ticketOperation;
        ticketStatus = params.ticketStatus;
        ticketDescription = params.ticketDescription;
        ticketContact = params.ticketContact;
        
        // switch statement to define rules 
        switch(ticketOperation){
            case 'createTicket':
                
                // create db (only necessary if you do not have a db yet)
                //await cloudant.db.create('watson_db', {partitioned: false});
                //console.log('creating db ...');
                
                // create a new ticket number
                let randomSixFigureNr = Math.floor(Math.random() * (999999 - 100000)) + 100000;
                let ticketNumber = 'T-' + randomSixFigureNr;
                
                // document to add - notice the two-part _id
                const doc = { _id: `Ticket: ${ticketNumber}` , Status: ticketStatus, Description: ticketDescription, Contact: ticketContact }
                console.log('document is being prepared ...');
                
                // insert the document
                await db.insert(doc);
                console.log('inserting new doc ... '); 
                
                // return message with returnString
                returnString = `Ihr Ticket ${ticketNumber} wurde nun erstellt und hat folgende Beschreibung : ${ticketDescription} . Der Status ist: ${ticketStatus} . Wir werden Sie kontaktieren unter ${ticketContact} . Bitte merken Sie sich ihre Ticketnummer ${ticketNumber} . Danke!`;
                return { message: returnString };
        
                break;
            case 'verifyTicket':
                
                // ticketNumber is only required to verify ticket
                let verifyTicketNumber = params.verifyTicketNumber; 
                console.log('Verifying ' + verifyTicketNumber);
                
                // fetch a document by its id
                let ticketVerification = await db.get(`Ticket: ${verifyTicketNumber}`);
                let ticketVerificationJSONstringify = JSON.stringify(ticketVerification, null, 2);
                console.log('The following information about the ticket is available: ' + ticketVerificationJSONstringify);
                
                // return message with returnString
                returnString = `Vielen Dank für Ihre Anfrage! Zu Ihrem Ticket gibt es folgende Informationen:\n ` + ticketVerificationJSONstringify;
                return { message: returnString };
                
                break;
            
            default:
                console.log('An error has ocurred, please try again later ...');
                
                // return message with returnString
                returnString = `Das hat leider nicht geklappt. Versuchen Sie es bitte nochmal.`;
                return { message: returnString };
        }
        
     }
     


    

  


      