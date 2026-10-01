// Initial appointment data

let appointments = [
    {
        id: 1,
        token: "OP-001",
        patient: "Ravi Kumar",
        age: 35,
        doctor: "Dr. Priya",
        department: "General Medicine",
        date: "2026-10-01",
        time: "09:30",
        reason: "Fever and cold",
        status: "Waiting"
    },
    {
        id: 2,
        token: "OP-002",
        patient: "Lakshmi Devi",
        age: 52,
        doctor: "Dr. Kumar",
        department: "Cardiology",
        date: "2026-10-01",
        time: "10:00",
        reason: "Chest discomfort",
        status: "Confirmed"
    },
    {
        id: 3,
        token: "OP-003",
        patient: "Arjun Reddy",
        age: 12,
        doctor: "Dr. Anitha",
        department: "Pediatrics",
        date: "2026-10-01",
        time: "10:30",
        reason: "Regular checkup",
        status: "Completed"
    },
    {
        id: 4,
        token: "OP-004",
        patient: "Suresh Babu",
        age: 44,
        doctor: "Dr. Rahul",
        department: "Orthopedics",
        date: "2026-10-01",
        time: "11:00",
        reason: "Knee pain",
        status: "Waiting"
    }
];


// Display appointments

function displayAppointments() {

    const table = document.getElementById("appointmentTable");

    const search =
        document.getElementById("searchInput").value.toLowerCase();

    const doctor =
        document.getElementById("doctorFilter").value;

    const status =
        document.getElementById("statusFilter").value;

    table.innerHTML = "";

    const filtered = appointments.filter(function (appointment) {

        const matchesSearch =
            appointment.patient.toLowerCase().includes(search);

        const matchesDoctor =
            doctor === "" || appointment.doctor === doctor;

        const matchesStatus =
            status === "" || appointment.status === status;

        return matchesSearch && matchesDoctor && matchesStatus;
    });

    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:30px;">
                    No appointments found.
                </td>
            </tr>
        `;

        updateStatistics();
        return;
    }

    filtered.forEach(function (appointment) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td><strong>${appointment.token}</strong></td>

            <td>${appointment.patient}</td>

            <td>${appointment.age}</td>

            <td>${appointment.doctor}</td>

            <td>${appointment.department}</td>

            <td>${formatTime(appointment.time)}</td>

            <td>
                <span class="status ${getStatusClass(appointment.status)}">
                    ${appointment.status}
                </span>
            </td>

            <td>
                ${
                    appointment.status !== "Completed" &&
                    appointment.status !== "Cancelled"
                    ?
                    `
                    <button
                        class="action-btn complete-btn"
                        onclick="completeAppointment(${appointment.id})">
                        ✓
                    </button>

                    <button
                        class="action-btn cancel-btn"
                        onclick="cancelAppointment(${appointment.id})">
                        ✕
                    </button>
                    `
                    :
                    "-"
                }
            </td>
        `;

        table.appendChild(row);
    });

    updateStatistics();
}


// Convert time

function formatTime(time) {

    const [hour, minute] = time.split(":");

    let h = parseInt(hour);

    const suffix = h >= 12 ? "PM" : "AM";

    h = h % 12 || 12;

    return `${h}:${minute} ${suffix}`;
}


// Status CSS class

function getStatusClass(status) {

    switch (status) {

        case "Waiting":
            return "waiting";

        case "Confirmed":
            return "confirmed";

        case "Completed":
            return "completed";

        case "Cancelled":
            return "cancelled";

        default:
            return "";
    }
}


// Update statistics

function updateStatistics() {

    document.getElementById("totalAppointments").textContent =
        appointments.length;

    document.getElementById("waitingPatients").textContent =
        appointments.filter(a => a.status === "Waiting").length;

    document.getElementById("completedAppointments").textContent =
        appointments.filter(a => a.status === "Completed").length;
}


// Complete appointment

function completeAppointment(id) {

    const appointment =
        appointments.find(a => a.id === id);

    if (!appointment) return;

    appointment.status = "Completed";

    displayAppointments();
}


// Cancel appointment

function cancelAppointment(id) {

    const appointment =
        appointments.find(a => a.id === id);

    if (!appointment) return;

    if (confirm("Are you sure you want to cancel this appointment?")) {

        appointment.status = "Cancelled";

        displayAppointments();
    }
}


// Open modal

function openModal() {

    document.getElementById("appointmentModal").style.display = "flex";

    // Set today's date

    const today =
        new Date().toISOString().split("T")[0];

    document.getElementById("appointmentDate").value = today;
}


// Close modal

function closeModal() {

    document.getElementById("appointmentModal").style.display = "none";

    document.getElementById("appointmentForm").reset();
}


// Book appointment

document
    .getElementById("appointmentForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const patientName =
            document.getElementById("patientName").value.trim();

        const patientAge =
            document.getElementById("patientAge").value;

        const doctor =
            document.getElementById("doctor").value;

        const department =
            document.getElementById("department").value;

        const date =
            document.getElementById("appointmentDate").value;

        const time =
            document.getElementById("appointmentTime").value;

        const reason =
            document.getElementById("reason").value.trim();


        // Check for duplicate doctor/time

        const duplicate =
            appointments.some(function(a) {

                return (
                    a.doctor === doctor &&
                    a.date === date &&
                    a.time === time &&
                    a.status !== "Cancelled"
                );

            });


        if (duplicate) {

            alert(
                "This doctor already has an appointment at this time."
            );

            return;
        }


        // Generate token

        const tokenNumber =
            appointments.length + 1;

        const token =
            "OP-" +
            String(tokenNumber).padStart(3, "0");


        // Create appointment

        const newAppointment = {

            id: Date.now(),

            token: token,

            patient: patientName,

            age: patientAge,

            doctor: doctor,

            department: department,

            date: date,

            time: time,

            reason: reason,

            status: "Waiting"
        };


        appointments.push(newAppointment);

        displayAppointments();

        closeModal();

        alert(
            `Appointment booked successfully!\nToken: ${token}`
        );

    });


// Close modal when clicking outside

window.addEventListener("click", function(event) {

    const modal =
        document.getElementById("appointmentModal");

    if (event.target === modal) {

        closeModal();
    }
});


// Initial display

displayAppointments();
