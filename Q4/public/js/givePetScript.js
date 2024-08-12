
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


//------------------GIVE PET form validation:
document.getElementById("registration-form").addEventListener("submit", function(event2){
    //avoid submitting default
    event2.preventDefault();

    //collect all element values
    let animal = document.querySelector('input[name="animal"]:checked');
    let r_breed = document.getElementById("pet-select").value;
    let otherBreed = document.getElementById("other-breed").value;
    let r_age = document.getElementById("age-selector").value;
    let r_gender = document.getElementById("gender-selector").value;
    let friendlyDog = document.querySelector('input[name="friendly-dogs"]:checked');
    let friendlyCat = document.querySelector('input[name="friendly-cats"]:checked');
    let friendlyKid = document.querySelector('input[name="friendly-kids"]:checked');
    //let addInfo = document.getElementById("give-text").value;
    let ownerFirstName = document.getElementById("first-name").value;
    let ownerLastName = document.getElementById("last-name").value;
    let ownerEmail = document.getElementById("email").value;

    //console.log("email:", ownerEmail);
    let r_errorMessage = document.getElementById("error-message");
    let r_error = '';
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if(!animal){
        r_error += "Please select which animal you\'d like to register<br>";
    }
    if(!r_breed && !otherBreed){
        r_error += "Please provide the breed of your pet<br>";
    }
    if(!r_age){
        r_error += "Please provide the age of your pet<br>";
    }
    if(!r_gender){
        r_error += "Please provide the gender of your pet<br>";
    }
    if(!friendlyDog || !friendlyCat || !friendlyKid){
        r_error += "Please provide your pets friendliness characteristics<br>";
    }
    if(!ownerFirstName){
        r_error += "Please provide your first name<br>";
    }
    if(!ownerLastName){
        r_error += "Please provide your last name<br>";
    }
    if(!ownerEmail){
        r_error += "Please provide your email<br>";
    } else if(!emailRegex.test(ownerEmail)){
        r_error += "Your email is not valid, please try again<br>";
    }

    console.log(r_error);
    if(r_error){
        r_errorMessage.innerHTML = r_error;
        r_errorMessage.style.display = 'block';
        r_errorMessage.classList.remove('success');
        r_errorMessage.classList.add('error');
    } else {
        r_errorMessage.innerHTML = 'Form submitted successfully!';
        r_errorMessage.style.display = 'block';
        r_errorMessage.classList.remove('error');
        r_errorMessage.classList.add('success');
    }

});