

const statusBtn = document.querySelectorAll(".statusBtn");
statusBtn.forEach((e)=>{
    
    if(e.textContent === "active"){
        e.classList.add("bg-green-700");

    }
    else
    {
        e.classList.add("bg-rose-800")
    }
    
})

const search= ()=>{
    let input, filter , table , tr, td,  txtValue;
    input =document.getElementById("search");
    filter =  input.value.toUpperCase();
    table = document.getElementById("Table");
    tr = document.getElementsByTagName("tr");

    for(let i =0 ; i< tr.length;i++){
        td= tr[i].getElementsByTagName("td")[0];
        if(td){
            txtValue = td.textContent ;
            if(txtValue.toUpperCase().indexOf(filter) > -1){
                tr[i].style.display =""
            }
            else{
                tr[i].style.display ="none"
            }
        }
    }

}
