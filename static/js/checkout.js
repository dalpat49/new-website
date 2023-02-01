var allltotal=localStorage.getItem("all_total");
document.getElementById("totalAmmount").innerHTML = (allltotal);

var sub_total_of_cart_products=localStorage.getItem("sub_total");
document.getElementById("sub_total_ammount").innerHTML = (sub_total_of_cart_products);

var shipping_charge_for_products=localStorage.getItem("shippingChargeForProduct");
document.getElementById("shipping_charge_for_ammount").innerHTML = (shipping_charge_for_products);



document.getElementById("subtotal").value = (sub_total_of_cart_products);
document.getElementById("shipping_charge_of_all_products").value = (shipping_charge_for_products);
document.getElementById("total_ammount_of_all_products").value = (allltotal);


function checkoutFormValidation(){

        let name = document.forms["checkOutForm"]["name"].value;
        let email = document.forms["checkOutForm"]["email"].value;
        let number = document.forms["checkOutForm"]["number"].value;
        let addressline1 = document.forms["checkOutForm"]["address_line1"].value;
        let addressline2 = document.forms["checkOutForm"]["address_line2"].value;
        let country = document.forms["checkOutForm"]["country"].value;
        let city = document.forms["checkOutForm"]["city"].value;
        let state = document.forms["checkOutForm"]["state"].value;
        let zipcode = document.forms["checkOutForm"]["zipcode"].value;

        if(name === "")
        {
            document.getElementById("nameErr").innerHTML = "Name input can't be empty.";
            return false;
        }
        else{
            document.getElementById("nameErr").innerHTML = "";

        }
        if(email === "")
        {
            document.getElementById("emailErr").innerHTML = "Email input can't be empty.";
            return false;
        }
        else{
            document.getElementById("Err").innerHTML = "";

        }
        if(number === "")
        {
            document.getElementById("numberErr").innerHTML = "Number input can't be empty.";
            return false;
        }
        else{
            document.getElementById("numberErr").innerHTML = "";

        }
        if(addressline1 === "")
        {
            document.getElementById("address1Err").innerHTML = "Address input can't be empty.";
            return false;
        }
        else{
            document.getElementById("address1Err").innerHTML = "";

        }
        if(addressline2 === "")
        {
            document.getElementById("address2Err").innerHTML = "Address input can't be empty.";
            return false;
        }
        else{
            document.getElementById("address2Err").innerHTML = "";

        }
        if(city === "")
        {
            document.getElementById("cityErr").innerHTML = "City input can't be empty.";
            return false;
        }
        else{
            document.getElementById("cityErr").innerHTML = "";

        }
        if(state === "")
        {
            document.getElementById("stateErr").innerHTML = "State input can't be empty.";
            return false;
        }
        else{
            document.getElementById("stateErr").innerHTML = "";

        }
        if(county === "")
        {
            document.getElementById("countryErr").innerHTML = "Country input can't be empty.";
            return false;
        }
        else{
            document.getElementById("countryErr").innerHTML = "";

        }
        if(zipcode === "")
        {
            document.getElementById("zipcodeErr").innerHTML = "Zipcode input can't be empty.";
            return false;
        }
        else{
            document.getElementById("zipcodeErr").innerHTML = "";

        }
}