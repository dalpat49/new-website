
let message = document.getElementById("messageDiv").textContent;
if (message === "") {
  document.getElementById("messageDiv").classList.add("d-none");
}

setInterval(function () {
  document.getElementById("messageDiv").style.display = "none";
}, 2000);
