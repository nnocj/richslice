

async function apiFetch(){
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=5.56&lon=-0.195&units=metric&appid=a244bc26af47b3c6480016ed8d1e9aa2";
    try {
        const response = await fetch(url);
        if (response.ok){
            const data = await response.json();
            displayResults(data);

        }
        else {
            throw Error(await response.text('Error fetching API'));
        }
    }
    catch (error) {
        console.log(error);
    }
};
apiFetch();


function displayResults(data){
    // select HTML elements in the document
    const weatherIcon = document.createElement('img');
    const currentTemp = document.createElement('p');
    const captionDesc = document.createElement('p');

    //unique
    const weatherInfo = ` 
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon of ${data.weather[0].description}">
                            <section>   
                                <b>${data.main.temp} ℃</b>
                                <p>${data.weather[0].description}</p>
                                <p>Humidity: ${data.main.humidity}%</p>
                            </section>`;

   //get info for my homepage 
   const weatherCard = document.querySelector('#weather-content');
   weatherCard.innerHTML = weatherInfo;

}



//get forecast

async function apiFetchForeCast(){
    const url = "https://api.openweathermap.org/data/2.5/forecast?lat=5.56&lon=-0.195&units=metric&appid=a244bc26af47b3c6480016ed8d1e9aa2";
    try {
        const response = await fetch(url);
        if (response.ok){
            const data = await response.json();
            displayForeCast(data);
        }
        else {
            throw Error(await response.text());
        }
    }
    catch (error) {
        console.log("Error fetching forecast:", error);
    }
};
apiFetchForeCast();

function displayForeCast(data){
    const forecastCard = document.querySelector('#forecast-content');
    forecastCard.innerHTML = '';  // Clear previous content

    const forecastList = data.list;
    const daysDisplayed = new Set();  // Track displayed days

    for (let i = 0; i < forecastList.length; i++) { 
        const forecast = forecastList[i];
        const forecastDate = new Date(forecast.dt_txt);
        const dayOfWeek = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
        

        
        if (!daysDisplayed.has(dayOfWeek) && forecastDate.getHours() === 12) {
            daysDisplayed.add(dayOfWeek);
            
            const forecastItem  = `
                <div class="forecast-day">
                    <p>${dayOfWeek} - <b>${forecast.main.temp} ℃</b></p>
                </div>
            `;
            
            forecastCard.innerHTML += forecastItem;

            // Stop after displaying 3 days
            if (daysDisplayed.size >= 3){
                break;
            }
        }
    }
}
