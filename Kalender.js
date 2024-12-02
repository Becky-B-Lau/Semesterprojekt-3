// Globale variabler
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// URL til API (Flask-server)
const API_URL = "http://127.0.0.1:5001/"; // Endpoint til at hente data

// Render kalenderen
function renderCalendar(month, year) {
    const daysContainer = document.getElementById("days");
    const monthYear = document.getElementById("monthYear");

    // Opdater måned og år
    monthYear.textContent = `${monthNames[month]} ${year}`;

    // Ryd eksisterende dage
    daysContainer.innerHTML = "";

    // Find første dag i måneden
    const firstDay = new Date(year, month, 1).getDay(); // Søndag = 0, Mandag = 1, osv.
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Tilpas første dag til at starte ugen på mandag
    const adjustedFirstDay = (firstDay === 0 ? 6 : firstDay - 1);

    // Udfyld tomme pladser før den første dag i måneden
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyCell = document.createElement("li");
        emptyCell.classList.add("empty");
        daysContainer.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("li");
        const dayText = document.createElement("span");
        dayText.textContent = day; // Sæt dagens nummer i span
        dayCell.appendChild(dayText);
    
        // Beregn datoen for den aktuelle dag
        const currentDate = new Date(year, month, day);
    
        // Marker tidligere dage
        if (currentDate < today) {
            dayCell.classList.add("past-circle"); // Tidligere dage får en cirkel
        }
    
        // Marker fremtidige dage
        if (currentDate > today) {
            dayCell.classList.add("future"); // Fremtidige dage bliver grå
        }
    
        // Marker den aktuelle dag
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayCell.classList.add("active");
        }
    
        // Tilføj data-dato-attribut
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayCell.setAttribute("data-date", dateStr);
    
        daysContainer.appendChild(dayCell);
    }

    // Hent data fra API og opdater farverne
    fetchStepData(month, year);
}

async function fetchStepData(month, year) {
    try {
        const response = await fetch('http://127.0.0.1:5001/'); // Hent data fra API
        const data = await response.json(); // Konverter data til JSON

        // Debug: Log API-data for at sikre, at det er korrekt
        console.log("API data:", data);

        // Gennemgå alle dage i kalenderen
        document.querySelectorAll(".days li").forEach((dayElement) => {
            const date = dayElement.getAttribute("data-date"); // Hent data-dato-attribut
            if (date) {
                // Find data for den aktuelle dag
                const stepData = data.find((entry) => entry.date === date);

                if (stepData) {
                    // Marker dag baseret på skridttællerdata
                    if (stepData.step >= 10000) {
                        dayElement.classList.add("goal-met"); // Grøn cirkel
                        console.log(`${date}: Grøn (Nået mål)`);
                    } else {
                        dayElement.classList.add("goal-not-met"); // Rød cirkel
                        console.log(`${date}: Rød (Ikke nået mål)`);
                    }
                } else {
                    console.log(`${date}: Ingen data`);
                }
            }
        });
    } catch (error) {
        console.error("Fejl ved hentning af skridttællerdata:", error);
    }
}

// Skift måned
function changeMonth(direction) {
    currentMonth += direction;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar(currentMonth, currentYear);
}

// Initialiser kalenderen
renderCalendar(currentMonth, currentYear);
