console.log("hellllllooo");
let myTable = document.getElementById("productTable");
sumVal = 0;
alltotal = 0;

for (var i = 1; i < myTable.rows.length; i++) {
  sumVal = sumVal + parseInt(myTable.rows[i].cells[3].innerHTML);
}

 document.getElementById("subTotal").innerHTML =  sumVal;

subtotalAmmount = parseInt(document.getElementById("subTotal").textContent);

shipping_charge = parseInt(document.getElementById("shippingCharge").textContent);

alltotal = sumVal + shipping_charge;

document.getElementById("allTotal").innerHTML = "₹" + alltotal;
document.getElementById("total_amount").value =alltotal
localStorage.setItem("all_total", alltotal);
localStorage.setItem("sub_total", subtotalAmmount);
localStorage.setItem("shippingChargeForProduct", shipping_charge);

let message = document.getElementById("messageDiv").textContent;
if (message === "") {
  document.getElementById("messageDiv").classList.add("d-none");
}

setInterval(function () {
  document.getElementById("messageDiv").style.display = "none";
}, 2000);


const api_url ="/coupanCheckIfValidForProducts"

fetch("http://localhost:5008/coupanCheckIfValidForProducts")
.then(response => response.json()) 
.then(json => console.log(json));