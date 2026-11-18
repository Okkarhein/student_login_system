
const form = document.getElementById("registration-form");
const resultDialog = document.getElementById("result-dialog");

const dialogTitle = document.getElementById("dialog-title");
const dialogMessage = document.getElementById("dialog-message");

const viewButton = document.getElementById("view-entry");
const viewRecordsButton = document.getElementById("view-records");
const okButton = document.getElementById("confirm-save");

const nameInput = document.getElementById("student-name");
const submitButton = form.querySelector(".submit-button");

let isSaving = false;
let dialogMode = "confirm";

// Display result dialog
function showResult(title, message) {
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;

    if (!resultDialog.open) {
        resultDialog.showModal();
    }
}

// Handle registration form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    dialogMode = "confirm";
    viewButton.hidden = true;

    dialogTitle.textContent = "Confirm registration";
    dialogMessage.textContent =
        "Click OK to save your student registration.";

    resultDialog.showModal();
});

// Save registration to PHP
async function saveRegistration() {
    isSaving = true;

    okButton.disabled = true;
    okButton.textContent = "Saving...";
    submitButton.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
                "Accept": "application/json"
            }
        });

        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            throw new Error(
                responseText || "The server returned an invalid response."
            );
        }

        if (!response.ok || !result.success) {
            dialogMode = "error";
            viewButton.hidden = true;

            showResult(
                "Could not save",
                result.message || "Please try again."
            );

            return;
        }

        // Registration saved successfully
        dialogMode = "saved";
        viewButton.hidden = false;

        showResult(
            "Saved successfully",
            result.message
        );

    } catch (error) {
        dialogMode = "error";
        viewButton.hidden = true;

        showResult(
            "Could not save",
            error.message || "Could not connect to the server."
        );

    } finally {
        isSaving = false;

        okButton.disabled = false;
        okButton.textContent = "OK";
        submitButton.disabled = false;
    }
}

// View newly registered entry
viewButton.addEventListener("click", function () {
    if (dialogMode === "saved") {
        window.location.href = "view&edit.html";
    }
});

// View all student records
viewRecordsButton.addEventListener("click", function () {
    window.location.href = "view&edit.html";
});

// Handle OK button
okButton.addEventListener("click", function () {
    if (isSaving) {
        return;
    }

    if (dialogMode === "confirm") {
        saveRegistration();
        return;
    }

    resultDialog.close();

    if (dialogMode === "saved") {
        form.reset();
    } else {
        nameInput.focus();
    }
});