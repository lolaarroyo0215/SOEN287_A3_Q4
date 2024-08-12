
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

//------------------FIND PET form validation:
document.getElementById("application-form").addEventListener("submit", function(event){
    //avoid default sub
    event.preventDefault();

    //get application form elements
    let pet = document.querySelector('input[name="pet"]:checked');
    let age = document.querySelector('input[name="age"]:checked');
    let gender = document.getElementById("gender").value;
    let dogBreeds = document.querySelectorAll('input[name="dbreed"]:checked');
    let catBreeds = document.querySelectorAll('input[name="cbreed"]:checked');
    let friendliness = document.querySelectorAll('input[name="friend"]:checked');

    let errorMessage = document.getElementById('error-message');

    let error = '';

    if(!pet){
        error += "Please select a pet to adopt<br>";
    }
    if(dogBreeds.length === 0 && catBreeds.length === 0){
        error += "Please select at least one breed preference<br>";
    }
    if(friendliness.length === 0){
        error += "Please select at least one friendliness requirement<br>";
    }
    if(!age) {
        error += "Please enter your age preferences<br>";
    }
    if(!gender){
        error += "Please select a gender preference<br>";
    }

    if(error){
        errorMessage.innerHTML = error;
        errorMessage.style.display = 'block';
        errorMessage.classList.remove('success');
        errorMessage.classList.add('error');
    } else {
        errorMessage.innerHTML = 'Form submitted successfully!';
        errorMessage.style.display = 'block';
        errorMessage.classList.remove('error');
        errorMessage.classList.add('success');

        this.submit();
    }
});
