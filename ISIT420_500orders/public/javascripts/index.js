document.addEventListener("DOMContentLoaded", function (event) {

    let PurchaseOrders = [];

    //-----make purchase record object
    let purchRecord = {
        storeNumber: 0,
        salesPersonID: 0,
        itemNumber: 0,
        timePurch: 0,
        pricePaid: 0
    }

    function buildOrder(timeStamp){
        //------ store number and sales person ID generator
        let storeSelect = Math.floor(Math.random() * 6 + 1);

        let salesPersonSelect = Math.floor(Math.random() * 4 + 1);
    
        switch(storeSelect){
            case 1:
                purchRecord.storeNumber = 98053;
                purchRecord.salesPersonID = salesPersonSelect;
                break;
            
            case 2:
                purchRecord.storeNumber = 98007;
                purchRecord.salesPersonID = salesPersonSelect + 4;
                break;
            
            case 3:
                purchRecord.storeNumber = 98077;
                purchRecord.salesPersonID = salesPersonSelect + 8;
                break;

            case 4:
                purchRecord.storeNumber = 98055;
                purchRecord.salesPersonID = salesPersonSelect + 12;
                break;

            case 5:
                purchRecord.storeNumber = 98011;
                purchRecord.salesPersonID = salesPersonSelect + 16;
                break;

            case 6:
                purchRecord.storeNumber = 98046;
                purchRecord.salesPersonID = salesPersonSelect + 20;
                break;

            default:
                break;
        }

    //------- item number generation
       let itemSelect = Math.floor(Math.random() * 10 + 1);
        
       switch(itemSelect){
            case 1:
                purchRecord.itemNumber = 123456;
                break;
            case 2:
                purchRecord.itemNumber = 123654;
                break;
            case 3:
                purchRecord.itemNumber = 321456;
                break;
            case 4:
                purchRecord.itemNumber = 321654;
                break;
            case 5:
                purchRecord.itemNumber = 654123;
                break;
            case 6:
                purchRecord.itemNumber = 654321;
                break;
            case 7:
                purchRecord.itemNumber = 543216;
                break;
            case 8:
                purchRecord.itemNumber = 354126;
                break;
            case 9:
                purchRecord.itemNumber = 621453;
                break;
            case 10:
                purchRecord.itemNumber = 623451;
                break;
            default:
                break;
       }
       
    //-----tiuestamp capture
       /*var today = new Date();
       var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
       purchRecord.timePurch = time.toString(); */

       purchRecord.timePurch = timeStamp;
      
        
    //-----set price paid
       purchRecord.pricePaid = Math.floor(Math.random() * (15 - 5 + 1)+ 5);
    }


    //  create One order button function
    document.getElementById("button1").addEventListener("click", function () {

        buildOrder();
       
    // ---copy purchase data to web page for display
       document.getElementById("storeNum").value = purchRecord.storeNumber;
       document.getElementById("salesPerID").value = purchRecord.salesPersonID;
       document.getElementById("itemNum").value = purchRecord.itemNumber;
       document.getElementById("price").value = purchRecord.pricePaid;
       document.getElementById("purchTime").value = purchRecord.timePurch;

    });



    //Post one order to Node button function 
    document.getElementById("submit").addEventListener("click", function () {

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




    // Generate 450 records and post to database button function
    document.getElementById("fullgen").addEventListener("click", function (){

        let day = new Date();
        let hr = day.getHours();
        let min = day.getMinutes();
        var sec = day.getSeconds();
        const minAdd = 2;
        let time = "";
        
        for (i = 0; i < 450; i++){

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
                url: '/NewFourFifty/' ,
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

    }); // end of 450 orders button function




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
    
                li.innerHTML=li.innerHTML + listNum + ": " + " Store Number: " + record.storeNumber + " Salesperson ID: " + record.salesPersonID + " Item Number: " + record.itemNumber + " Price: " + record.pricePaid + " Purchase Time: " + record.timePurch;
            
            }
        }); 
    });
});