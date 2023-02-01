

const Search= ()=>{
    let input, filter , table , tr, td,  txtValue;
    input =document.getElementById("search");
    pName = document.querySelectorAll(".productName");
    let product =  document.querySelectorAll(".productDiv");
    filter =  input.value.toUpperCase();
    for(let i =0 ; i< pName.length;i++){

        
            txtValue = pName[i].innerText ;
            console.log(txtValue)
            if(txtValue.toUpperCase().indexOf(filter) > -1){
              product[i].style.display =""
                // console.log(pName[i])
            }
            else{
                product[i].style.display ="none"
            }
        
    }

}
const loading = document.getElementById("loding");

const load =  ()=> setInterval(() => {
    loading.style.display="none"
},3000);

Window.onload = load();





(function ($) {
   
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });



})

var btnContainer = document.getElementById("navDiv");

// Get all buttons with class="btn" inside the container
var btns = btnContainer.getElementsByClassName("navBtn");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}


let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat:26.90982945479911, lng: 75.7805907726288 },
    zoom: 15,
  });
  const marker = new google.maps.Marker({
    position:{lat: 26.90982945479911, lng:  75.7805907726288},
    map: map,
    
    title:"G-Shoppers",
 
    
  })
}

window.initMap = initMap;

