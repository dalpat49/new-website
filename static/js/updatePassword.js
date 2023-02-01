function showPassword() {
    var pass = document.getElementById("password");
    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}


const userLoginFormValidation = () => {
    const email = document.forms["user-login-form"]["email"].value;
    const password = document.forms["user-login-form"]["password"].value;

    if (email === "") {
        document.getElementById("emailErr").innerHTML = "Email field cannot be empty.";
    }
    else {
        document.getElementById("emailErr").innerHTML = "";

    }

    if (password === "") {
        document.getElementById("passwordErr").innerHTML = "Password field cannot be empty.";
    }
    else {
        document.getElementById("passwordErr").innerHTML = "";

    }
}
//upadte poassword function
const ChangeUserPasswordFormValidations = () => {
    const email = document.forms["ChangeUserPasswordForm"]["email"].value;
    const password = document.forms["ChangeUserPasswordForm"]["password"].value;
    const confirmPassword = document.forms["ChangeUserPasswordForm"]["confirmPassword"].value;


    if (email === "") {

        document.getElementById("emailErr").innerHTML = "Email field can not be empty.";
        return false;

    } else {
        document.getElementById("emailErr").innerHTML = "";

    }
    if (confirmPassword != password) {
        document.getElementById(passwordErr).innerHTML = "Your passsword does not match.";
    }

    if (password === "") {

        document.getElementById("passwordErr").innerHTML = "Password field can not be empty.";
        return false;

    } else {
        document.getElementById("passwordErr").innerHTML = "";

    }

    if (confirmPassword === "") {

        document.getElementById("confirmPasswordErr").innerHTML = "Please confirm your password.";
        return false;

    } else {
        document.getElementById("confirmPasswordErr").innerHTML = "";

    }

}

//update user profile.
const userProfileUpdateFormValidations = () => {
    let name = document.forms["updateUserProfileForm"]["name"].value;
    let number = document.forms["updateUserProfileForm"]["number"].value;
    let addressline1 = document.forms["updateUserProfileForm"]["addressline1"].value;
    let addressline2 = document.forms["updateUserProfileForm"]["addressline2"].value;
    let city = document.forms["updateUserProfileForm"]["city"].value;
    let state = document.forms["updateUserProfileForm"]["state"].value;
    let country = document.forms["updateUserProfileForm"]["country"].value;
    let zipcode = document.forms["updateUserProfileForm"]["zipcode"].value;

    if (name === "") {
        document.getElementById("nameErr").innerHTML = "Pleaes enter your name.";
        return false;
    } else {
        document.getElementById("nameErr").innerHTML = "";
    }


    if (number == "") {
        document.getElementById("numberErr").innerHTML =
            "Please enter your number.";

        return false;
    }
    else {
        document.getElementById("numberErr").innerHTML = "";
    }

    if (addressline1 == "") {
        document.getElementById("address1Err").innerHTML =
            "Address field can't be empty.";

        return false;
    }
    else {
        document.getElementById("address1Err").innerHTML = "";
    }

    if (addressline2 == "") {
        document.getElementById("address2Err").innerHTML = "Address field can't be empty.";

        return false;
    }
    else {
        document.getElementById("address2Err").innerHTML = "";
    }

    if (city == "") {
        document.getElementById("cityErr").innerHTML = "City field can't be empty.";

        return false;
    }
    else {
        document.getElementById("cityErr").innerHTML = "";
    }

    if (state == "") {
        document.getElementById("stateErr").innerHTML =
            "State field can't be empty";

        return false;
    }
    else {
        document.getElementById("stateErr").innerHTML = "";
    }

    if (country == "") {
        document.getElementById("countryErr").innerHTML =
            "Country field can't be empty.";

        return false;
    }
    else {
        document.getElementById("countryErr").innerHTML = "";
    }
    if (zipcode == "") {
        document.getElementById("zipcodeErr").innerHTML =
            "Zipcode field can't be empty.";

        return false;
    }
    else {
        document.getElementById("zipcodeErr").innerHTML = "";
    }


}

//registration form validation

function validateForm() {
    let name = document.forms["registrationForm"]["name"].value;
    let email = document.forms["registrationForm"]["email"].value;
    let number = document.forms["registrationForm"]["number"].value;
    let addressline1 = document.forms["registrationForm"]["addressline1"].value;
    let addressline2 = document.forms["registrationForm"]["addressline2"].value;
    let city = document.forms["registrationForm"]["city"].value;
    let state = document.forms["registrationForm"]["state"].value;
    let country = document.forms["registrationForm"]["country"].value;
    let zipcode = document.forms["registrationForm"]["zipcode"].value;
    let password = document.forms["registrationForm"]["password"].value;
    let confirmPassword = document.forms["registrationForm"]["confirmPassword"].value;

    if (name === "") {
        document.getElementById("nameErr").innerHTML = "Pleaes enter your name.";
        return false;
    } else {
        document.getElementById("nameErr").innerHTML = "";
    }

    if (email == "") {
        document.getElementById("emailErr").innerHTML = "Please enter your email.";

        return false;
    }
    else
    {
        document.getElementById("emailErr").innerHTML = "";
    }

    if (number == "") {
        document.getElementById("numberErr").innerHTML =
            "Please enter your number.";

        return false;
    }
    else
    {
        document.getElementById("numberErr").innerHTML = "";
    }

    if (addressline1 == "") {
        document.getElementById("address1Err").innerHTML =
            "Address field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("address1Err").innerHTML = "";
    }

    if (addressline2 == "") {
        document.getElementById("address2Err").innerHTML =
            "Address field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("address2Err").innerHTML = "";
    }

    if (city == "") {
        document.getElementById("cityErr").innerHTML = "City field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("cityErr").innerHTML = "";
    }

    if (state == "") {
        document.getElementById("stateErr").innerHTML =
            "State field can't be empty";

        return false;
    }
    else
    {
        document.getElementById("stateErr").innerHTML = "";
    }

    if (country == "") {
        document.getElementById("countryErr").innerHTML =
            "Country field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("countryErr").innerHTML = "";
    }
    if (zipcode == "") {
        document.getElementById("zipcodeErr").innerHTML =
            "Zipcode field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("zipcodeErr").innerHTML = "";
    }
    if (password != confirmPassword) {
        document.getElementById("confirmpasswordErr").innerHTML =
            "Your password does not match.";

        return false;
    }
    else
    {
        document.getElementById("confirmpasswordErr").innerHTML = "";
    }

    if (password == "") {
        document.getElementById("passwordErr").innerHTML =
            "Please enter your Password.";

        return false;
    }
    else
    {
        document.getElementById("passwordErr").innerHTML = "";
    }
}


//usser password and detaiols updattion
function  validateUserEditForm(){
    let name =  document.forms["editUser"]["name"].value;
    let email =  document.forms["editUser"]["email"].value;
    let number =  document.forms["editUser"]["number"].value;
    let addressline1 =  document.forms["editUser"]["Addressline1"].value;
    let addressline2 =  document.forms["editUser"]["Addressline2"].value;
    let city =  document.forms["editUser"]["City"].value;
    let state =  document.forms["editUser"]["State"].value;
    let country =  document.forms["editUser"]["Country"].value;
    let zipcode =  document.forms["editUser"]["Zipcode"].value;
    


    if(name === ""){
         document.getElementById("nameErr").innerHTML = "Name field can't be empty."
         return false;
    }
    else
    {
        document.getElementById("nameErr").innerHTML = ""

    }

    if(email === ""){
         document.getElementById("emailErr").innerHTML = "Email field can't be empty."
         return false;
    }
    else
    {
        document.getElementById("emailErr").innerHTML = "";

    }
    if(number === ""){
         document.getElementById("numberErr").innerHTML = "Email field can't be empty."
         return false;
    }
    else{

         document.getElementById("numberErr").innerHTML = "";
    }

    if(addressline1 === ""){
         document.getElementById("address1Err").innerHTML = "AddressLine 1 field can't be empty."
         return false;
    }
    else{
        document.getElementById("address1Err").innerHTML = "";
        
    }

    if(addressline2 === ""){
         document.getElementById("address2Err").innerHTML = "AddressLine 2 field can't be empty."
         return false;
    }
    else{
        document.getElementById("address2Err").innerHTML = "";
    }

    if(city === ""){
         document.getElementById("cityErr").innerHTML = "City field can't be empty."
         return false;
    }
    else{
        document.getElementById("cityErr").innerHTML = "";

    }

    if(state === ""){
         document.getElementById("stateErr").innerHTML = "State field can't be empty."
         return false;
    }
    else{
        document.getElementById("stateErr").innerHTML = "";
        
    }
    if(country === ""){
         document.getElementById("countryErr").innerHTML = "Country field can't be empty."
         return false;
    }
    else{
        document.getElementById("countryErr").innerHTML="";

    }

    if(zipcode === ""){
         document.getElementById("zipcodeErr").innerHTML = "Zipcode field can't be empty."
         return false;
    }
    else{
        document.getElementById("zipcodeErr").innerHTML = "";
    }

  
}

//calid user change password
function validateChangePasswordForm(){
    let password = document.forms["updatePasswordForm"]["password"].value;
    let cpassword = document.forms["updatePasswordForm"]["confirmPassword"].value;
    if(password != cpassword){
        document.getElementById("passwordErr").innerHTML = "Your password doesn't match.Try again!"
        return false;
   }
   else{
    document.getElementById("passwordErr").innerHTML = "";
   }

    if(password === ""){
        document.getElementById("passwordErr").innerHTML = "Password field can't be empty."
        return false;
   }
   else{
    document.getElementById("passwordErr").innerHTML = "";

   }

    if(cpassword === ""){
        document.getElementById("passconfirmPasswordErrwordErr").innerHTML = "Password confrim your password."
        return false;
   }
   else{

        document.getElementById("passconfirmPasswordErrwordErr").innerHTML ="";
   }
}


//admin profile
function changeAdminPasswordForm() {
    let adminPassword = document.forms["changeAdminPassword"]["password"].value;
    let confirmPassword = document.forms["changeAdminPassword"]["Cpassword"].value;

    if(adminPassword != confirmPassword ){
        document.getElementById("adminCpasswordErr").innerHTML = "Your password does not match. "
        return false;
    }
    else{
        document.getElementById("adminCpasswordErr").innerHTML = ""

    }

    if(adminPassword === ""){
        document.getElementById("adminPasswordErr").innerHTML = "Password field can not be empty. "
        return false;
    }
    else{
        document.getElementById("adminPasswordErr").innerHTML = ""

    }

    if(confirmPassword === ""){
        document.getElementById("adminCpasswordErr").innerHTML = "Please confirm your password. "
        return false;
    }
    else{
        document.getElementById("adminCpasswordErr").innerHTML = ""

    }
}

//admin profile
function validateAdminForm(){
    let name = document.forms["updateAdminProfileForm"]["name"].value;
    let email = document.forms["updateAdminProfileForm"]["email"].value;
    let number = document.forms["updateAdminProfileForm"]["number"].value;
    let company = document.forms["updateAdminProfileForm"]["company"].value;

    if(name === ""){
        document.getElementById("nameEr").innerHTML = "Name field can not be empty. "
        return false;
    }
    else{
        document.getElementById("nameEr").innerHTML = ""

    }

    if(email === ""){
        document.getElementById("mailErr").innerHTML = "Email field can not be empty. "
        return false;
    }
    else{
        document.getElementById("mailErr").innerHTML = ""

    }

    if(number === ""){
        document.getElementById("numberErr").innerHTML = "Number field can not be empty. "
        return false;
    }
    else{
        document.getElementById("numberErr").innerHTML = ""

    }

    if(company === ""){
        document.getElementById("companyErr").innerHTML = "Company field can not be empty. "
        return false;
    }
    else{
        document.getElementById("companyErr").innerHTML = ""

    }
   


}


// adminprofile
function validateNewAdminForm(){
    const name =  document.forms["registrationForm"]["name"].value;
    const email =  document.forms["registrationForm"]["email"].value;
    const number =  document.forms["registrationForm"]["number"].value;
    const company =  document.forms["registrationForm"]["Company"].value;
    const password =  document.forms["registrationForm"]["password"].value;
    const confirmPassword =  document.forms["registrationForm"]["confirmPassword"].value;

    if(name === ""){
        document.getElementById("nameErr").innerHTML = "Name field can not be empty. "
        return false;
    } 
    else{
        document.getElementById("nameErr").innerHTML = ""

    }


    if(email === ""){
        document.getElementById("emailErr").innerHTML = "Email field can not be empty. "
        return false;
    } 
    else{
        document.getElementById("emailErr").innerHTML = ""

    }

    if(number === ""){
        document.getElementById("numberErr").innerHTML = "Number field can not be empty. "
        return false;
    }
    else{
        document.getElementById("numberErr").innerHTML = ""

    }

     if(company === ""){
        document.getElementById("companyErr").innerHTML = "Company field can not be empty. "
        return false;
    } 
    else{
        document.getElementById("companyErr").innerHTML = ""

    }

    if(password != confirmPassword){
        document.getElementById("passwordErr").innerHTML = "Your password does not match. "
        return false;
    } 
    else{
        document.getElementById("passwordErr").innerHTML = ""

    }
    if(password === ""){
        document.getElementById("passwordErr").innerHTML = "Password field can not be empty. "
        return false;
    }
    else{
        document.getElementById("passwordErr").innerHTML = ""

    }
     if(confirmPassword === ""){
        document.getElementById("cPasswordErr").innerHTML = "Please confrim your password. "
        return false;
    } 
    else{
        document.getElementById("cPasswordErr").innerHTML = ""

    }
    
}