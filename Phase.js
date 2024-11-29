// Globale variabler
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const API_URL = "https://din-backend-url.dk/get-steps"; // Udskift med din API URL

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
        // Marker tidligere dage
        else if (
            (year < today.getFullYear()) ||
            (year === today.getFullYear() && month < today.getMonth()) ||
            (year === today.getFullYear() && month === today.getMonth() && day < today.getDate())
        ) {
            dayCell.classList.add("past");
        }

        dayCell.setAttribute("data-date", `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        daysContainer.appendChild(dayCell);
    }

    // Hent data fra API og opdater farverne
    updateDayColors(month, year);
}

function updateDayColors(month, year) {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // Gå gennem data fra API
            data.forEach(entry => {
                const date = entry.date;
                const steps = entry.steps;

                // Find det tilsvarende element i kalenderen
                const dayElement = document.querySelector(`.days li[data-date='${date}']`);
                if (dayElement) {
                    if (steps >= 10000) {
                        dayElement.classList.add("green");
                    } else {
                        dayElement.classList.add("red");
                    }
                }
            });
        })
        .catch(error => console.error("Fejl ved hentning af data:", error));
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
