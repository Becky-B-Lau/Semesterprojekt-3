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

    // Udfyld dage i måneden
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("li");
        dayCell.textContent = day;

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

// Hent skridttællerdata fra API
async function fetchStepData(month, year) {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Gennemgå kalenderens dage og sammenlign med API-data
        document.querySelectorAll(".days li").forEach((dayElement) => {
            const date = dayElement.getAttribute("data-date");
            if (date) {
                const stepData = data.find((entry) => entry.date === date); // Find data for datoen

                if (stepData) {
                    // Marker dag som grøn eller rød baseret på skridtdata
                    if (stepData.step >= 10000) {
                        dayElement.classList.add("green");
                    } else {
                        dayElement.classList.add("red");
                    }
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
