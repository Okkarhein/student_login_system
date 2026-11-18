
const userId = new URLSearchParams(window.location.search).get('id');

const loadError = document.getElementById('loadError');

// Check whether student ID exists
if (!userId) {

    loadError.textContent = 'No student ID was provided.';
    loadError.hidden = false;

} else {

    // Fetch student information from PHP
    fetch('VUD.php?action=getUser&id=' + encodeURIComponent(userId))

        .then(response => response.json().then(data => {

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || 'Could not load the student record.'
                );
            }

            return data.user;

        }))

        .then(student => {

            // Fill student information into the form
            document.getElementById('student-id').value =
                student.student_id || '';

            document.getElementById('student-name').value =
                student.student_name || '';

            document.getElementById('student-email').value =
                student.student_email || '';

            // Select the student's existing gender
            document.querySelectorAll(
                'input[name="student_gender"]'
            ).forEach(input => {

                input.checked =
                    input.value === student.student_gender;

            });

        })

        .catch(error => {

            loadError.textContent = error.message;
            loadError.hidden = false;

        });
}