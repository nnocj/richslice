const foodUrl = 'https://nnocj.github.io/richslice/data/food.json';
const foodContainer = document.querySelector('.food-cards');
const dialog = document.getElementById('food-dialog');
const dialogContent = document.querySelector('.dialog-content');

const displayFoods = (foods) => {
    foods.forEach((food) => {
        const card = document.createElement('section');
        card.classList.add('food-card');

        const title = document.createElement('h2');
        title.textContent = food.name.trim();

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = food.image_file_name;
        img.alt = `Image of ${food.name}`;
        img.loading = 'lazy';
        img.classList.add('food-img');

        figure.appendChild(img);

        const price = document.createElement('p');
        price.innerHTML = `<strong>Price:</strong> ${food.price || food[" price"]}`;

        const origin = document.createElement('p');
        origin.innerHTML = `<strong>Origin:</strong> ${food.origin || food.Origin}`;

        const description = document.createElement('p');
        description.textContent = food.description?.replace(/:$/, '') || "No description available.";

        card.appendChild(title);
        card.appendChild(figure);
        card.appendChild(price);
        card.appendChild(origin);
        card.appendChild(description);

        // Add click to open dialog
        card.addEventListener('click', () => {
            dialogContent.innerHTML = `
                <h2>${food.name.trim()}</h2>
                <img src="${food.image_file_name}" alt="${food.name}" loading="lazy" />
                <p><strong>Price:</strong> ${food.price || food[" price"]}</p>
                <p><strong>Origin:</strong> ${food.origin || food.Origin}</p>
                <p><strong>Rating:</strong> ${"★".repeat(food.rating)} (${food.rating}/5)</p>
                <p><strong>Key Ingredients:</strong> ${food.key_ingredients}</p>
                <p>${food.description?.replace(/:$/, '')}</p>
                <button id="close-dialog">Close</button>
            `;
            dialog.showModal();
            document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
           
        });

        foodContainer.appendChild(card);
    });
};

async function getFoodData() {
    const response = await fetch(foodUrl);
    const data = await response.json();
    displayFoods(data.foods);
}

getFoodData();


document.addEventListener('click', (e) => {
    if (dialog.open) {
        dialog.close();
    }
});
