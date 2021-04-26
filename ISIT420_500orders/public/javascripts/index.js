document.addEventListener("DOMContentLoaded", function (event) {

    /* declare variables */
    let PurchaseHour = 0;
    let PurchaseDay = 1;

    // make purchase record object
    let purchRecord = {
        StoreID: 0,
        SalesPersonID: 0,
        CdID: 0,
        HourPurch: 0,
        DayPurch: 0,
        PricePaid: 0
    }
    
    /* function to generate day and hour for records when submitting */
    function incrementTime(){
        let hourIncrement = Math.floor(Math.random() * 5) + 1;
        PurchaseHour += hourIncrement;
        if(PurchaseHour >23){
            PurchaseHour -= 23;
            PurchaseDay ++;
        }
        
    }

    /* function to randomly create an order */
    function buildOrder(){
        //------ store number and sales person ID generator
        let storeSelect = Math.floor(Math.random() * 6 + 1);

        let salesPersonSelect = Math.floor(Math.random() * 4 + 1);
    
        switch(storeSelect){
            case 1:
                purchRecord.StoreID = 98053;
                purchRecord.SalesPersonID = salesPersonSelect;
                break;
            
            case 2:
                purchRecord.StoreID = 98007;
                purchRecord.SalesPersonID = salesPersonSelect + 4;
                break;
            
            case 3:
                purchRecord.StoreID = 98077;
                purchRecord.SalesPersonID = salesPersonSelect + 8;
                break;

            case 4:
                purchRecord.StoreID = 98055;
                purchRecord.SalesPersonID = salesPersonSelect + 12;
                break;

            case 5:
                purchRecord.StoreID = 98011;
                purchRecord.SalesPersonID = salesPersonSelect + 16;
                break;

            case 6:
                purchRecord.StoreID = 98046;
                purchRecord.SalesPersonID = salesPersonSelect + 20;
                break;

            default:
                break;
        }

         //------- item number generation
        let itemSelect = Math.floor(Math.random() * 10 + 1);
        
        switch(itemSelect){
            case 1:
                purchRecord.CdID = 123456;
                break;
            case 2:
                purchRecord.CdID = 123654;
                break;
            case 3:
                purchRecord.CdID = 321456;
                break;
            case 4:
                purchRecord.CdID = 321654;
                break;
            case 5:
                purchRecord.CdID = 654123;
                break;
            case 6:
                purchRecord.CdID = 654321;
                break;
            case 7:
                purchRecord.CdID = 543216;
                break;
            case 8:
                purchRecord.CdID = 354126;
                break;
            case 9:
                purchRecord.CdID = 621453;
                break;
            case 10:
                purchRecord.CdID = 623451;
                break;
            default:
                break;
       }
    
        
    //-----set price paid
       purchRecord.PricePaid = Math.floor(Math.random() * (15 - 5 + 1)+ 5);

    } // end of buildOrder

    /*  function to publish contents of record to web html elements */
    function publishRecord () {
        document.getElementById("storeNum").value = purchRecord.StoreID;
        document.getElementById("salesPersonID").value = purchRecord.SalesPersonID;
        document.getElementById("cdID").value = purchRecord.CdID;
        document.getElementById("price").value = purchRecord.PricePaid;
    }

    // make an order at page load
    buildOrder();
    
    // copy order to web page at page load
    publishRecord();
        

//-------------------------------------------------------------------------------------------------

    /*  create One order button function */
    document.getElementById("button1").addEventListener("click", function () {

        buildOrder();
        publishRecord();

    });

    /* Post one order to Node button function */
    document.getElementById("submit").addEventListener("click", function () {

        // increment time for new record
        incrementTime();

        // add time to the record
        purchRecord.HourPurch = PurchaseHour;
        purchRecord.DayPurch = PurchaseDay;


    // putting the the Subject in the URL for the PUT method
         $.ajax({
             url: '/NewOrder/' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
           data: JSON.stringify(purchRecord),
           success: function (result) {
           }
        });
    });


    /* Generate 500 records and post to database button function */
    document.getElementById("fullgen").addEventListener("click", function (){
        
        for (i = 0; i < 500; i++){         

            buildOrder(); // generate a purchase record

            // increment time for new record
            incrementTime();

            // add time to the record
            purchRecord.HourPurch = PurchaseHour;
            purchRecord.DayPurch = PurchaseDay;
    
            // send purchase record to mongo db
            $.ajax({
                url: '/FiveHundredRecords/' ,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(purchRecord),
                success: function (result) {
                    console.log("added new purchase record")
                }
    
            });        
            
       } // end of for loop

    }); // end of 500 orders button function

    
});