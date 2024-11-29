// Globale variabler
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

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
        emptyCell.classList.add("empty"); // Tilføj en klasse til tomme felter, hvis styling er nødvendig
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

        daysContainer.appendChild(dayCell);
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