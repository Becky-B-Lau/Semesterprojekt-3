// Globale variabler
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const monthNames = [
    "Januar", "Februar", "Marts", "April", "Maj", "Juni",
    "Juli", "August", "September", "Oktober", "November", "December"
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
    const firstDay = new Date(year, month, 1).getDay();
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

        // Marker tidligere dage som standard rød
        if (currentDate < today) {
            dayCell.classList.add("past-default"); // Standard rød baggrund
        }

        // Marker den aktuelle dag som hvid
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayCell.classList.add("active"); // Hvid baggrund
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
        const response = await fetch(API_URL); // Hent data fra API
        const data = await response.json(); // Konverter API-data til JSON
        console.log("API data:", data); // Debug: Log API-data

        // Gennemgå alle dage i kalenderen
        document.querySelectorAll(".days li").forEach((dayElement) => {
            const date = dayElement.getAttribute("data-date"); // Hent data-dato-attribut
            if (date) {
                // Marker som standard rød for tidligere dage
                const currentDate = new Date(date);
                if (currentDate < today) {
                    dayElement.classList.add("past-default"); // Rød som standard
                }

                // Gennemgå alle datoer i JSON-data
                const relevantEntry = data.date.find((entry) => entry === date);

                if (relevantEntry) {
                    // Opdater til grøn, hvis målet er nået
                    if (data.step >= 10000) {
                        dayElement.classList.remove("past-default"); // Fjern rød
                        dayElement.classList.add("goal-met"); // Grøn baggrund
                        console.log(`${date}: Grøn (Nået mål)`);
                    }
                }
            }
        });
    } catch (error) {
        console.error("Fejl ved hentning af data:", error);
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
