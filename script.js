// Sample attendance data
let attendance = [
    { StudentID: "S101", Name: "Aarav Das", Date: "2026-10-31", Status: "Present" },
    { StudentID: "S102", Name: "Diya Roy", Date: "2026-10-31", Status: "Absent" },
    { StudentID: "S103", Name: "Rohan Sen", Date: "2026-10-31", Status: "Present" },
    { StudentID: "S104", Name: "Mira Paul", Date: "2026-10-31", Status: "Present" },
    { StudentID: "S105", Name: "Ishaan Roy", Date: "2026-10-31", Status: "Late" },
    { StudentID: "S106", Name: "Anika Das", Date: "2026-10-31", Status: "Present" }
];

// Sample result data
let results = [
    { StudentID: "S101", Name: "Aarav Das", Marks: 487, Total: 500 },
    { StudentID: "S102", Name: "Diya Roy",  Marks: 476, Total: 500 },
    { StudentID: "S103", Name: "Rohan Sen", Marks: 392, Total: 500 },
    { StudentID: "S104", Name: "Mira Paul", Marks: 168, Total: 500 },
    { StudentID: "S105", Name: "Ishaan Roy", Marks: 304, Total: 500 },
    { StudentID: "S106", Name: "Anika Das", Marks: 272, Total: 500 }
];

// Safely display text
function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

// Calculate grade from percentage
function grade(percent) {
    if (percent >= 90) return "A+";
    if (percent >= 80) return "A";
    if (percent >= 70) return "B";
    if (percent >= 60) return "C";
    if (percent >= 40) return "D";
    return "F";
}

// Get student initials
function initials(name) {
    return String(name || "?")
        .split(/\s+/)
        .map(part => part[0] || "")
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

// Display attendance status
function statusBadge(status) {
    let value = String(status || "").toLowerCase();
    let className = "neutral";

    if (value === "present") className = "present";
    else if (value === "absent") className = "absent";
    else if (value === "late") className = "late";

    return `<span class="badge ${className}">${esc(status || "Unknown")}</span>`;
}

// Update dashboard statistics and recent records
function renderDashboard() {
    let studentIDs = new Set([
        ...attendance.map(student => student.StudentID),
        ...results.map(student => student.StudentID)
    ]);

    document.getElementById("totalStudents").textContent = studentIDs.size;

    let present = attendance.filter(
        student => String(student.Status).toLowerCase() === "present"
    ).length;

    document.getElementById("presentCount").textContent = present;

    let attendanceRate = attendance.length
        ? (present / attendance.length) * 100
        : 0;

    document.getElementById("attendanceRate").textContent =
        attendanceRate.toFixed(1) + "%";

    let average = results.length
        ? results.reduce((sum, student) => {
            return sum + (
                Number(student.Total) > 0
                    ? Number(student.Marks) / Number(student.Total) * 100
                    : 0
            );
        }, 0) / results.length
        : 0;

    document.getElementById("averageMarks").textContent =
        average.toFixed(1) + "%";

    document.getElementById("recentAttendance").innerHTML =
        attendance.slice(0, 5).map(student => `
            <tr>
                <td>
                    <div class="student">
                        <div class="mini-avatar">
                            ${esc(initials(student.Name))}
                        </div>
                        ${esc(student.Name)}
                    </div>
                </td>
                <td>${esc(student.StudentID)}</td>
                <td>${statusBadge(student.Status)}</td>
            </tr>
        `).join("") ||
        '<tr><td colspan="3" class="empty">No attendance data.</td></tr>';

    document.getElementById("recentResults").innerHTML =
        results.slice(0, 5).map(student => {
            let percentage = Number(student.Total) > 0
                ? Number(student.Marks) / Number(student.Total) * 100
                : 0;

            let studentGrade = grade(percentage);

            return `
                <tr>
                    <td>${esc(student.Name)}</td>
                    <td>${esc(student.Subject)}</td>
                    <td>${esc(student.Marks)}/${esc(student.Total)}</td>
                    <td>
                        <span class="badge ${studentGrade === "F" ? "fail" : "pass"}">
                            ${studentGrade}
                        </span>
                    </td>
                </tr>
            `;
        }).join("") ||
        '<tr><td colspan="4" class="empty">No results data.</td></tr>';
}

// Display and search attendance records
function renderAttendance() {
    let query = (
        document.getElementById("attendanceSearch")?.value || ""
    ).toLowerCase();

    let rows = attendance.filter(student =>
        Object.values(student).some(value =>
            String(value).toLowerCase().includes(query)
        )
    );

    document.getElementById("attendanceTable").innerHTML =
        rows.map(student => `
            <tr>
                <td>${esc(student.StudentID)}</td>
                <td>
                    <div class="student">
                        <div class="mini-avatar">
                            ${esc(initials(student.Name))}
                        </div>
                        ${esc(student.Name)}
                    </div>
                </td>
                <td>${esc(student.Date)}</td>
                <td>${statusBadge(student.Status)}</td>
            </tr>
        `).join("") ||
        '<tr><td colspan="4" class="empty">No matching records.</td></tr>';

    document.getElementById("attendanceSub").textContent =
        rows.length + " record(s) shown";
}

// Display and search results
function renderResults() {
    let query = (
        document.getElementById("resultsSearch")?.value || ""
    ).toLowerCase();

    let rows = results.filter(student =>
        Object.values(student).some(value =>
            String(value).toLowerCase().includes(query)
        )
    );

    document.getElementById("resultsTable").innerHTML =
        rows.map(student => {
            let percentage = Number(student.Total) > 0
                ? Number(student.Marks) / Number(student.Total) * 100
                : 0;

            let studentGrade = grade(percentage);
            let resultStatus = studentGrade === "F" ? "Fail" : "Pass";
            let badgeClass = studentGrade === "F" ? "fail" : "pass";

            return `
                <tr>
                    <td>${esc(student.StudentID)}</td>
                    <td>${esc(student.Name)}</td>
                    
                    <td>${esc(student.Marks)}/${esc(student.Total)}</td>
                    <td>${percentage.toFixed(1)}%</td>
                    <td>
                        <span class="badge ${badgeClass}">
                            ${studentGrade}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${badgeClass}">
                            ${resultStatus}
                        </span>
                    </td>
                </tr>
            `;
        }).join("") ||
        '<tr><td colspan="7" class="empty">No matching results.</td></tr>';
}

// Refresh all sections
function refresh() {
    renderDashboard();
    renderAttendance();
    renderResults();
}

// Navigate between pages
function showView(id) {
    document.querySelectorAll(".view").forEach(view => {
        view.classList.toggle("active", view.id === id);
    });

    document.querySelectorAll(".nav button").forEach(button => {
        button.classList.toggle("active", button.dataset.view === id);
    });

    const titles = {
        dashboard: "Dashboard",
        attendance: "Attendance",
        results: "Results",
        files: "File Processor"
    };

    document.getElementById("topTitle").textContent =
        titles[id] || "Dashboard";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Navigation button events
document.querySelectorAll(".nav button").forEach(button => {
    button.addEventListener("click", () => {
        showView(button.dataset.view);
    });
});

// Open the upload page with a selected file type
function setUploadType(type) {
    document.getElementById("fileType").value = type;
    showView("files");
}

// Read CSV files, including quoted values
function parseCSV(text) {
    let rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let next = text[i + 1];

        if (char === '"' && quoted && next === '"') {
            cell += '"';
            i++;
        } else if (char === '"') {
            quoted = !quoted;
        } else if (char === "," && !quoted) {
            row.push(cell.trim());
            cell = "";
        } else if ((char === "\n" || char === "\r") && !quoted) {
            if (char === "\r" && next === "\n") i++;

            row.push(cell.trim());

            if (row.some(value => value !== "")) {
                rows.push(row);
            }

            row = [];
            cell = "";
        } else {
            cell += char;
        }
    }

    row.push(cell.trim());

    if (row.some(value => value !== "")) {
        rows.push(row);
    }

    if (!rows.length) return [];

    let headers = rows.shift().map(header =>
        header.toLowerCase().replace(/[\s_-]/g, "")
    );

    return rows.map(values => {
        let object = {};

        headers.forEach((header, index) => {
            object[header] = values[index] ?? "";
        });

        return object;
    });
}

// Import attendance or result CSV
function processFile(event) {
    let file = event.target.files[0];

    if (!file) return;

    let type = document.getElementById("fileType").value;
    let reader = new FileReader();

    reader.onload = function () {
        try {
            let parsed = parseCSV(String(reader.result || ""));

            if (!parsed.length) {
                throw new Error("The file contains no data rows.");
            }

            if (type === "attendance") {
                let mapped = parsed.map(row => ({
                    StudentID: row.studentid || row.id || "",
                    Name: row.name || row.studentname || "",
                    Date: row.date || new Date().toISOString().slice(0, 10),
                    Status: row.status || row.attendance || ""
                }));

                if (mapped.some(student =>
                    !student.StudentID || !student.Name || !student.Status
                )) {
                    throw new Error(
                        "Attendance CSV needs StudentID, Name and Status columns."
                    );
                }

                attendance = mapped;

            } else {
                let mapped = parsed.map(row => ({
                    StudentID: row.studentid || row.id || "",
                    Name: row.name || row.studentname || "",
                    Marks: Number(row.marks),
                    Total: Number(row.total || row.maxmarks || 100)
                }));

                if (mapped.some(student =>
                    !student.StudentID ||
                    !student.Name ||
                    !Number.isFinite(student.Marks) ||
                    !Number.isFinite(student.Total) ||
                    student.Total <= 0 ||
                    student.Marks < 0 ||
                    student.Marks > student.Total
                )) {
                    throw new Error(
                        "Results CSV needs StudentID, Name, Marks and Total. Marks must be between 0 and Total."
                    );
                }

                results = mapped;
            }

            refresh();

            document.getElementById("uploadMessage").innerHTML =
                `<span class="success-message">
                    Successfully imported ${parsed.length} record(s) from ${esc(file.name)}.
                </span>`;

            event.target.value = "";

        } catch (error) {
            document.getElementById("uploadMessage").innerHTML =
                `<span class="error-message">Import failed: </span>
                ${esc(error.message)}`;
        }
    };

    reader.onerror = function () {
        document.getElementById("uploadMessage").textContent =
            "Unable to read the file.";
    };

    reader.readAsText(file);
}

// Format values for CSV output
function csvEscape(value) {
    let text = String(value ?? "");

    if (/[",\n\r]/.test(text)) {
        return '"' + text.replace(/"/g, '""') + '"';
    }

    return text;
}

// Export attendance or result records
function downloadCSV(type) {
    let rows;
    let headers;
    let filename;

    if (type === "results") {
        headers = [
            "StudentID", "Name", "Marks",
            "Total", "Percentage", "Grade", "Result"
        ];

        rows = results.map(student => {
            let percentage = Number(student.Total) > 0
                ? Number(student.Marks) / Number(student.Total) * 100
                : 0;

            let studentGrade = grade(percentage);

            return {
                ...student,
                Percentage: percentage.toFixed(1) + "%",
                Grade: studentGrade,
                Result: studentGrade === "F" ? "Fail" : "Pass"
            };
        });

        filename = "student_results.csv";

    } else {
        headers = ["StudentID", "Name", "Date", "Status"];
        rows = attendance;
        filename = "attendance_records.csv";
    }

    let csv = [
        headers.join(","),
        ...rows.map(row =>
            headers.map(header => csvEscape(row[header])).join(",")
        )
    ].join("\r\n");

    let blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

// Download sample attendance CSV
function downloadSample() {
    let sample =
        "StudentID,Name,Date,Status\r\n" +
        "S101,Aarav Das,2026-10-31,Present\r\n" +
        "S102,Diya Roy,2026-10-31,Absent\r\n";

    let blob = new Blob([sample], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");

    link.href = url;
    link.download = "sample_attendance.csv";
    link.click();

    URL.revokeObjectURL(url);
}

// Initialize the frontend
refresh();