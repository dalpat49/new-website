let message = document.getElementById("messageDiv").textContent;
if(message === ""){
    document.getElementById("messageDiv").classList.add("d-none")
}
setInterval (function (){
    document.getElementById ('messageDiv').style.display="none";
    },2000);
    
console.log("working")

function validateForm(){
    let name = document.forms["queryForm"]['name'].value;
    let email = document.forms["queryForm"]['email'].value;
    let subject = document.forms["queryForm"]['subjectOfQuery'].value;
    let query = document.forms["queryForm"]['Query'].value;

    if(name ===""){
        document.getElementById("nameErr").innerText = "Name should not be blank.";
        return false;
    }
    else
    {
        document.getElementById("nameErr").innerText = "";

    }
    if(email ===""){
        document.getElementById("emailErr").innerText = "Please write your email.";
        return false;
        
    }
    else{
        document.getElementById("emailErr").innerText = "";

    }
    if(subject ===""){
        document.getElementById("subjectErr").innerText = "Please write your subject.";
        return false;

    }
    else{
        document.getElementById("subjectErr").innerText = "";
    }
    if(query ===""){
        document.getElementById("messageErr").innerText = "Please write your query.";
        return false;

    }
    else{
        document.getElementById("messageErr").innerText = "";

    }
}