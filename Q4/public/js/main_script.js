
function getCurrentDate(){
    let myDate = new Date();
    let date = myDate.getDate();
    let month = myDate.getMonth() + 1;
    let year = myDate.getFullYear();
    let hours = myDate.getHours();
    let minutes = myDate.getMinutes();
    let seconds = myDate.getSeconds();

    //add leading zeros
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    document.getElementById("currentDate").innerHTML = `${date}-${month}-${year}- ${hours}:${minutes}:${seconds}`;
}
//update time every second
setInterval(getCurrentDate, 1000);

//call function when the page loads
document.addEventListener('DOMContentLoaded', function (){
    getCurrentDate();
})

//Load terms of service and privacy messages in the footer
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('terms').addEventListener('click', function (e) {
        e.preventDefault();
        alert("Terms of Service: \n\nThese are the terms of service. Use of this site means you agree to our terms.");
    });

    document.getElementById('privacy').addEventListener('click', function (e) {
        e.preventDefault();
        alert("Privacy Policy: \n\nWe respect your privacy. Your information will not be shared with third parties.");
    });
});

let popup = document.getElementById('popup');

function showPopup(event){
    event.preventDefault();
    document.getElementById('popup').classList.add('open-popup');

}

function submitLogout(){
    document.getElementById('logoutForm').submit();
}



