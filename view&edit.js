
const tableBody = document.getElementById('userTableBody');
const loadError = document.getElementById('loadError');

// Load registered students from PHP
fetch('VUD.php?action=getUsers&_=' + Date.now(), {
    cache: 'no-store'
})
    .then(async response => {
        const responseText = await response.text();
        let data;

        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error(
                'VUD.php returned a non-JSON response. Check its PHP/database error: ' +
                responseText.slice(0, 250)
            );
        }

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || 'Could not load student records.'
            );
        }

        return data;
    })

    .then(data => {
        if (!Array.isArray(data.users)) {
            throw new Error(
                'The server response did not contain a student list.'
            );
        }

        // Display message when there are no students
        if (data.users.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td class="empty-state" colspan="5">
                        No student records found yet.
                    </td>
                </tr>
            `;
            return;
        }

        // Display student records
        data.users.forEach(user => {
            const row = document.createElement('tr');

            // Student information
            [
                user.student_id,
                user.student_name,
                user.student_email,
                user.student_gender
            ].forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value || '';
                row.appendChild(cell);
            });

            // Action buttons
            const actions = document.createElement('td');

            // Edit button
            const editLink = document.createElement('a');
            editLink.className = 'button button-primary';
            editLink.href =
                'update.html?id=' +
                encodeURIComponent(user.student_id);
            editLink.textContent = 'Edit';

            // Delete button
            const deleteLink = document.createElement('a');
            deleteLink.className = 'button button-danger';
            deleteLink.href =
                'VUD.php?delete_id=' +
                encodeURIComponent(user.student_id);
            deleteLink.textContent = 'Delete';

            actions.className = 'table-actions';
            actions.append(editLink, deleteLink);

            row.appendChild(actions);
            tableBody.appendChild(row);
        });
    })

    .catch(error => {
        loadError.textContent = error.message;
        loadError.hidden = false;
    });