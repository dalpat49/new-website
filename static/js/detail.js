
let plusBtn = document.getElementById("plus");
let minusBtn = document.getElementById("minus");
let inputField = document.getElementById("quantity");

  

   plusBtn.addEventListener("click",(e)=>{
         e.preventDefault();
         let currentValue =  Number(inputField.value) || 0;
         inputField.value = currentValue + 1;
         
         
        

    })
   minusBtn.addEventListener("click",(e)=>{
    e.preventDefault();
  
        let currentValue =  Number(inputField.value) || 0;
        inputField.value = currentValue - 1;
   
      

    })
    