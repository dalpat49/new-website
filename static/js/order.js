const search= ()=>{
    let input, filter , table , tr, td,  txtValue;
    input =document.getElementById("search");
    filter =  input.value.toUpperCase();
    table = document.getElementById("orderTable");
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
