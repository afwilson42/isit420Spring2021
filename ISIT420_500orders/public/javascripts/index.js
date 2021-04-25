document.addEventListener("DOMContentLoaded", function (event) {

    let PurchaseOrders = [];
    let PurchaseHour = 0;
    let PuchaseDay = 0;

    //-----make purchase record object
    let purchRecord = {
        StoreID: 0,
        SalesPersonID: 0,
        CdID: 0,
        HourPurch: 0,
        DayPurch: 0,
        PricePaid: 0
    }
    
    // -- RNG for hour increment between 1 and 5
    function dayHour () {

        let hourAdd = Math.floor(Math.random() * (5 - 1 ) + 1);

        return hourAdd;

    }

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
       
    //-----tiuestamp capture
       /*var today = new Date();
       var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
       purchRecord.HourPurch = time.toString(); */

       //purchRecord.HourPurch = timeStamp;
    

       
    //-----set day
       purchRecord.DayPurch = Math.floor(Math.random() * 365 - 1);

    //-----set time
       //purchRecord.HourPurch = Math.floor(Math.random() * (23 - 0 + 1) + 1);

       PurchaseHour = purchRecord.HourPurch + dayHour();

       if (PurchaseHour > 23) {
           PurchaseHour = PurchaseHour - 23;
           purchRecord.DayPurch + 1;
       }
       purchRecord.HourPurch = PurchaseHour;
        
    //-----set price paid
       purchRecord.PricePaid = Math.floor(Math.random() * (15 - 5 + 1)+ 5);
    }

    //Records that generate when page is loaded up and displays.
    buildOrder();
        // ---copy purchase data to web page for display
        document.getElementById("storeNum").value = purchRecord.StoreID;
        document.getElementById("salesPerID").value = purchRecord.SalesPersonID;
        document.getElementById("itemNum").value = purchRecord.CdID;
        document.getElementById("price").value = purchRecord.PricePaid;
        document.getElementById("purchTime").value = purchRecord.HourPurch;


    //  create One order button function
    document.getElementById("button1").addEventListener("click", function () {

        buildOrder();
       
    // ---copy purchase data to web page for display
       document.getElementById("storeNum").value = purchRecord.StoreID;
       document.getElementById("salesPerID").value = purchRecord.SalesPersonID;
       document.getElementById("itemNum").value = purchRecord.CdID;
       document.getElementById("price").value = purchRecord.PricePaid;
       document.getElementById("purchTime").value = purchRecord.HourPurch;

    });



    //Post one order to Node button function 
    // document.getElementById("submit").addEventListener("click", function () {

    //     // putting the the Subject in the URL for the PUT method
    //     $.ajax({
    //         url: '/NewOrder/' ,
    //         method: 'POST',
    //         dataType: 'json',
    //         contentType: 'application/json',
    //         data: JSON.stringify(purchRecord),
    //         success: function (result) {
              
    //         }
        
    
    //     });
    
    // });




    // Generate 500 records and post to database button function
    document.getElementById("fullgen").addEventListener("click", function (){



        let day = new Date();
        let hr = day.getHours();
        let min = day.getMinutes();
        var sec = day.getSeconds();
        const minAdd = 2;
        let time = "";
        
        for (i = 0; i < 500; i++){

            if(min >=60){
                hr ++;
                min -= 60;
                
            }

            if (hr >=25){
                hr = 1;
                
            }

            time = hr + ":" + min + ":" + sec;
            

            buildOrder(time); // generate a purchase record
    
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

            min += minAdd;          
            
       } // end of for loop

    }); // end of 500 orders button function




    //submit button function 
    document.getElementById("retrieve").addEventListener("click", function () {
        
        var listDiv = document.getElementById('listDiv');
        var ul = document.createElement('ul');
        listDiv.innerHTML = "";
        
         $.get("/GetRecords", function(data, status){  // AJAX get
            
            PurchaseOrders = data;  // put the returned server json data into our local array
            listDiv.appendChild(ul);
            PurchaseOrders.forEach(ProcessOneRecord); // build one li for each item in array
            function ProcessOneRecord(record, index) {
                var li = document.createElement('li');
                ul.appendChild(li);
                var listNum = index +1;
    
                li.innerHTML=li.innerHTML + listNum + ": " + " Store Number: " + record.StoreID + " Salesperson ID: " + record.SalesPersonID + " Item Number: " + record.CdID + " Price: " + record.PricePaid + " Purchase Time: " + record.HourPurch + " Purchase Day: " + record.DayPurch;
            
            }
        }); 
    });
});