
/*const displayFilteredFoods = (foods)=> {

    // building the random aspect
    const shuffledFoods = foods.sort(()=> Math.random() - 0.5);
    
    shuffledFoods.forEach(food => {
        if (food.rating == 5){
            let card = document.createElement('section');
            let logo = document.createElement('img');
            let name = document.createElement('p');
            let price = document.createElement('p');
            let keyIngredient = document.createElement('p');
            
            logo.setAttribute('alt', `${food.name} logo`);
            logo.setAttribute('src', food.image_file_name);
            logo.setAttribute('loading', 'lazy');
            name.textContent = food.name;
            price.textContent = food.price;
            keyIngredient.textContent = food.key_ingredients;

            card.appendChild(logo);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(keyIngredient);
            const cards = document.querySelector('.food-cards');

            cards.appendChild(card);
        
        }
    });
}

async function getFoodsData() {
    const url = 'https://nnocj.github.io/wdd231/richslice/data/food.json';
    const response = await fetch(url);
    const data = await response.json();
    // console.table(data.prophets);
    displayFilteredFoods(data.foods)
    
}

getFoodsData();*/

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