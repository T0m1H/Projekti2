async function fetchTheaters() {
    const url = "http://www.finnkino.fi/xml/TheatreAreas/";
    try {
        const response = await fetch(url);
        const textData = await response.text();
        const parser = new DOMParser();
        const xmlData = parser.parseFromString(textData, "text/xml");

        const theaters = xmlData.querySelectorAll("TheatreArea");
        const select = document.getElementById("theater-select");

        // Lisätään jokainen teatteri valikon vaihtoehdoksi
        theaters.forEach(theater => {
            const id = theater.querySelector("ID").textContent;
            const name = theater.querySelector("Name").textContent;

            const option = document.createElement("option");
            option.value = id;
            option.textContent = name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching theaters:", error);
    }
}

function populateDateDropdown() {
    const select = document.getElementById("date-select");
    select.innerHTML = ""; 
    // Lisätään seuraavat 7 päivää päivämäärävalikkoon
    for (let i = 0; i < 7; i++) { // viikko
        const date = new Date();
        date.setDate(date.getDate() + i);
        const formattedDate = date.toISOString().split("T")[0]; 

        const option = document.createElement("option");
        option.value = formattedDate;
        option.textContent = date.toLocaleDateString();
        select.appendChild(option);
    }
}

async function fetchMovies() {
    const theaterId = document.getElementById("theater-select").value;
    const date = document.getElementById("date-select").value;
    const url = `http://www.finnkino.fi/xml/Schedule/?area=${theaterId}&dt=${date}`;

    try {
        const response = await fetch(url);
        const textData = await response.text();
        const parser = new DOMParser();
        const xmlData = parser.parseFromString(textData, "text/xml");

        const shows = xmlData.querySelectorAll("Show");
        const container = document.getElementById("movie-container");
        container.innerHTML = ""; 

        shows.forEach(show => {
            const title = show.querySelector("Title").textContent;
            const length = show.querySelector("LengthInMinutes").textContent;
            const image = show.querySelector("Images EventMediumImagePortrait").textContent;
            const startTime = show.querySelector("dttmShowStart").textContent;

            const card = document.createElement("div");
            card.className = "movie-card";
            card.innerHTML = `
                <img src="${image}" alt="${title}">
                <h3>${title}</h3>
                <p><strong>Duration:</strong> ${length} minutes</p>
                <p><strong>Showtime:</strong> ${new Date(startTime).toLocaleString()}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    fetchTheaters();
    populateDateDropdown();
});
