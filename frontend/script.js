
const API_URL = "http://localhost:3000/api/opportunities";

const form = document.getElementById("opportunity-form");
const list = document.getElementById("opportunities-list");
const message = document.getElementById("message");
const formHeading = document.getElementById("form-heading");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;

    setTimeout(() => {
        message.textContent = "";
        message.className = "";
    }, 4000);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

async function loadOpportunities() {
    list.textContent = "Loading opportunities...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load opportunities.");
        }

        const opportunities = await response.json();

        if (opportunities.length === 0) {
            list.textContent = "No research opportunities found.";
            return;
        }

        list.innerHTML = opportunities.map(opportunity => `
            <div class="opportunity-card">
                <h3>${escapeHTML(opportunity.title)}</h3>

                <p>${escapeHTML(opportunity.description)}</p>

                <p>
                    <strong>Research Area:</strong>
                    ${escapeHTML(opportunity.research_area)}
                </p>

                <p>
                    <strong>Faculty:</strong>
                    ${escapeHTML(opportunity.faculty_name)}
                </p>

                <p>
                    <strong>Department:</strong>
                    ${escapeHTML(opportunity.department)}
                </p>

                <p>
                    <strong>Required Skills:</strong>
                    ${escapeHTML(opportunity.required_skills)}
                </p>

                <p>
                    <strong>Available Positions:</strong>
                    ${escapeHTML(opportunity.available_positions)}
                </p>

                <p>
                    <strong>Application Deadline:</strong>
                    ${escapeHTML(String(opportunity.application_deadline).slice(0, 10))}
                </p>

                <p>
                    <strong>Status:</strong>
                    <span class="status ${
                        opportunity.status === "Open" ? "open" : "closed"
                    }">
                        ${escapeHTML(opportunity.status)}
                    </span>
                </p>

                <button onclick="editOpportunity(${Number(opportunity.id)})">
                    Edit
                </button>

                ${
                    opportunity.status === "Open"
                    ? `<button onclick="closeOpportunity(${Number(opportunity.id)})">
                        Close Opportunity
                       </button>`
                    : ""
                }

                <button class="danger"
                    onclick="deleteOpportunity(${Number(opportunity.id)})">
                    Delete
                </button>
            </div>
        `).join("");

    } catch (error) {
        list.textContent =
            "Could not connect to the server. Make sure your backend is running.";
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("opportunity-id").value;

    const opportunity = {
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim(),
        research_area: document.getElementById("research_area").value.trim(),
        faculty_name: document.getElementById("faculty_name").value.trim(),
        department: document.getElementById("department").value.trim(),
        required_skills: document.getElementById("required_skills").value.trim(),
        available_positions: Number(
            document.getElementById("available_positions").value
        ),
        application_deadline:
            document.getElementById("application_deadline").value
    };

    if (
        !opportunity.title ||
        !opportunity.description ||
        !opportunity.research_area ||
        !opportunity.faculty_name ||
        !opportunity.department ||
        !opportunity.required_skills ||
        !Number.isInteger(opportunity.available_positions) ||
        opportunity.available_positions < 1 ||
        !opportunity.application_deadline
    ) {
        showMessage("Please enter valid information in every field.", "error");
        return;
    }

    const isEditing = Boolean(id);

    try {
        const response = await fetch(
            isEditing ? `${API_URL}/${id}` : API_URL,
            {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...opportunity,
                    status: "Open"
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not save opportunity.");
        }

        showMessage(
            isEditing
                ? "Opportunity updated successfully."
                : "Opportunity created successfully.",
            "success"
        );

        resetForm();
        await loadOpportunities();

    } catch (error) {
        showMessage(error.message, "error");
    }
});

async function editOpportunity(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const opportunity = await response.json();

        if (!response.ok) {
            throw new Error(opportunity.message || "Opportunity not found.");
        }

        document.getElementById("opportunity-id").value = opportunity.id;
        document.getElementById("title").value = opportunity.title;
        document.getElementById("description").value = opportunity.description;
        document.getElementById("research_area").value = opportunity.research_area;
        document.getElementById("faculty_name").value = opportunity.faculty_name;
        document.getElementById("department").value = opportunity.department;
        document.getElementById("required_skills").value = opportunity.required_skills;
        document.getElementById("available_positions").value =
            opportunity.available_positions;
        document.getElementById("application_deadline").value =
            String(opportunity.application_deadline).slice(0, 10);

        formHeading.textContent = "Edit Research Opportunity";
        saveButton.textContent = "Update Opportunity";
        cancelButton.hidden = false;

        form.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        showMessage(error.message, "error");
    }
}

async function closeOpportunity(id) {
    if (!confirm("Are you sure you want to close this opportunity?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}/close`, {
            method: "PATCH"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not close opportunity.");
        }

        showMessage("Opportunity closed successfully.", "success");
        await loadOpportunities();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

async function deleteOpportunity(id) {
    if (!confirm("Are you sure you want to delete this opportunity?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not delete opportunity.");
        }

        showMessage("Opportunity deleted successfully.", "success");
        await loadOpportunities();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

function resetForm() {
    form.reset();
    document.getElementById("opportunity-id").value = "";
    formHeading.textContent = "Add Research Opportunity";
    saveButton.textContent = "Add Opportunity";
    cancelButton.hidden = true;
}

cancelButton.addEventListener("click", resetForm);

document.getElementById("refresh-button").addEventListener(
    "click",
    loadOpportunities
);

loadOpportunities();