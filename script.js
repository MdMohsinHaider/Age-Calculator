// Helper for select dropdowns
function populateSelect(id, start, end, padZero = false) {
    let sel = document.getElementById(id);
    sel.innerHTML = "";
    for (let i = start; i <= end; i++) {
        let val = padZero && i < 10 ? "0" + i : i;
        let option = document.createElement("option");
        option.value = val;
        option.text = val;
        sel.appendChild(option);
    }
}

// Months dropdown
function populateMonths(id) {
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let sel = document.getElementById(id);
    sel.innerHTML = "";
    months.forEach((m, i) => {
        let option = document.createElement("option");
        option.value = i;
        option.text = m;
        sel.appendChild(option);
    });
}

// Set today's date as default
function setTodayDefaults() {
    let today = new Date();
    document.getElementById("todayDay").value = today.getDate() < 10 ? "0"+today.getDate() : today.getDate();
    document.getElementById("todayMonth").value = today.getMonth();
    document.getElementById("todayYear").value = today.getFullYear();
    document.getElementById("todayHour").value = today.getHours() < 10 ? "0"+today.getHours() : today.getHours();
    document.getElementById("todayMinute").value = today.getMinutes() < 10 ? "0"+today.getMinutes() : today.getMinutes();
}

// Initial population
window.onload = function() {
    populateSelect("dobDay", 1, 31, true);
    populateSelect("dobYear", 1900, new Date().getFullYear());
    populateMonths("dobMonth");
    populateSelect("dobHour", 0, 23, true);
    populateSelect("dobMinute", 0, 59, true);

    populateSelect("todayDay", 1, 31, true);
    populateSelect("todayYear", 1900, new Date().getFullYear()+1);
    populateMonths("todayMonth");
    populateSelect("todayHour", 0, 23, true);
    populateSelect("todayMinute", 0, 59, true);

    setTodayDefaults();
};

let countdownInterval = null;

// Calculate logic on button click
document.getElementById("calcBtn").onclick = function() {
    let d = parseInt(document.getElementById("dobDay").value);
    let m = parseInt(document.getElementById("dobMonth").value);
    let y = parseInt(document.getElementById("dobYear").value);
    let hr = parseInt(document.getElementById("dobHour").value);
    let min = parseInt(document.getElementById("dobMinute").value);

    let td = parseInt(document.getElementById("todayDay").value);
    let tm = parseInt(document.getElementById("todayMonth").value);
    let ty = parseInt(document.getElementById("todayYear").value);
    let thr = parseInt(document.getElementById("todayHour").value);
    let tmin = parseInt(document.getElementById("todayMinute").value);

    let dob = new Date(y, m, d, hr, min);
    let today = new Date(ty, tm, td, thr, tmin);

    // Calculate age in years, months, days
    let ageY = today.getFullYear() - dob.getFullYear();
    let ageM = today.getMonth() - dob.getMonth();
    let ageD = today.getDate() - dob.getDate();

    if (ageD < 0) {
        ageM -= 1;
        let prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        ageD += prevMonth.getDate();
    }
    if (ageM < 0) {
        ageY -= 1;
        ageM += 12;
    }

    // Find weekday name
    let daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let weekday = daysOfWeek[dob.getDay()];

    // % of age completed until next birthday
    let lastBirthday = new Date(today.getFullYear(), m, d, hr, min);
    if (today < lastBirthday) lastBirthday.setFullYear(today.getFullYear()-1);
    let nextBirthday = new Date(lastBirthday.getFullYear()+1, m, d, hr, min);
    let completed = Math.floor(((today - lastBirthday)/(nextBirthday-lastBirthday))*100);

    let countdownDays = Math.ceil((nextBirthday-today)/(1000*60*60*24));

    document.getElementById("result").innerHTML = `
        <div><b>Born on:</b> <span style="color:#9400d3">${weekday}</span></div>
        <div><b>Completed:</b> <span style="color:#9400d3">${completed}%</span></div>
        <div><b>Next Birthday:</b> <span style="color:#9400d3">${countdownDays}</span></div>
        <div><b>Countdown to Next Birthday:</b> <span id="birthdayCountdown" style="color:#2e008b"></span></div>
        <div><b>Age:</b> <span style="color:#2e008b">${ageY} years, ${ageM} months, and ${ageD} day${ageD!==1?"s":""} old.</span></div>
    `;

    if (countdownInterval) clearInterval(countdownInterval);

    // Live countdown function
    function updateBirthdayCountdown() {
        const now = new Date();
        const diff = nextBirthday - now;
        if (diff <= 0) {
            document.getElementById('birthdayCountdown').textContent = 'Happy Birthday!';
            clearInterval(countdownInterval);
            return;
        }
        let totalSeconds = Math.floor(diff / 1000);
        let days = Math.floor(totalSeconds / (3600 * 24));
        let hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;
        document.getElementById('birthdayCountdown').textContent =
            `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }
    updateBirthdayCountdown();
    countdownInterval = setInterval(updateBirthdayCountdown, 1000);
};
