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
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Juster første dag til at starte på mandag (om nødvendigt)
    const adjustedFirstDay = (firstDay + 6) % 7;

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