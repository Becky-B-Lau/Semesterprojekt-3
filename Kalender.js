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
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log("API-data struktur:", data);

        // Kontroller, om data er korrekt struktureret
        if (data.date && Array.isArray(data.date)) {
            const step = data.step || 0; // Brug den fælles skridtværdi

            document.querySelectorAll(".days li").forEach((dayElement) => {
                const date = dayElement.getAttribute("data-date");

                if (date) {
                    console.log("Kalender-dato:", date);

                    // Tjek, om datoen findes i API'ets dato-array
                    if (data.date.includes(date)) {
                        console.log(`Dato fundet: ${date}, Skridt: ${step}`);

                        // Opdater dagfarve baseret på skridtværdier
                        if (step >= 10000) {
                            // Tilføj den grønne klasse
                            dayElement.classList.add("goal-met");
                            dayElement.classList.remove("goal-not-met");

                            // Debug-log for at sikre, at det bliver grønt
                            console.log(`Dag opdateret til grøn: ${date}`);

                            // Brug inline-styling til at teste, om styling bliver anvendt korrekt
                            dayElement.style.backgroundColor = "#7ABA78";
                            dayElement.style.color = "white";
                        } else {
                            // Tilføj den røde klasse
                            dayElement.classList.add("goal-not-met");
                            dayElement.classList.remove("goal-met");

                            // Debug-log for at sikre, at det bliver rødt
                            console.log(`Dag opdateret til rød: ${date}`);

                            // Brug inline-styling til at teste, om styling bliver anvendt korrekt
                            dayElement.style.backgroundColor = "red";
                            dayElement.style.color = "white";
                        }
                    }
                }
            });
        } else {
            console.error("Data er ikke korrekt struktureret:", data);
        }
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
