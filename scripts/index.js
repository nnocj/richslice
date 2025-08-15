const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.head-nav');
const animateMe = document.getElementById("animateme");
const headerTitle = document.querySelector('.header-h1');

// Hamburger menu logic
hamButton.addEventListener('click', () => {
    navigation.classList.toggle('open');
    hamButton.classList.toggle('open');
    animateMe.classList.toggle("open");
   // headerTitle.classList.toggle('hide'); // Hide the title when the hamburger is open
});


//when the light-dark button is clicked or toggled, the header should change
// light mode and dark mode
function toggleMode() {
    const header = document.querySelector('.header');
    const menu = document.querySelector('#menu');
    const footer = document.querySelector('footer');
    const body = document.querySelector('body');
    const cardh2 = document.querySelectorAll('.food-card h2');

    if (document.querySelector('form')) {
        
        const form = document.querySelector('form');
        const formLabels = form.querySelectorAll('label');
        formLabels.forEach(label => {
            label.classList.toggle('dark-mode');
        });
    }

    // Toggle dark mode for header
    header.classList.toggle('dark-mode');
    menu.classList.toggle('dark-mode');
    footer.classList.toggle('dark-mode');
    body.classList.toggle('dark-mode-body');
    cardh2.forEach(h2 => {
        h2.classList.toggle('dark-mode-card-h2');
    });
}


//shrink and expand header by tap
document.querySelector('header').addEventListener("hover", function (){
    let header = document.querySelector('header');
})

//timestamp for the form submission
document.addEventListener("DOMContentLoaded", () => {
    const timestampFeild = document.getElementById("timestamp");
    if (timestampFeild) {
        const currentDate = new Date();
        timestampFeild.value = currentDate.toISOString();
    }

})