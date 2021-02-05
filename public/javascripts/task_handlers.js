function createTaskForm() {
    let formJS = document.getElementById('taskForm');
    let form = $("#taskForm");

    if (!formJS.checkValidity()) {
        form.addClass("was-validated");
    } else {
        var formData = {
            title: $("#taskName").val(),
            complexity: $("#difficultyRange").val(),
            dueDate: new Date(Date.parse($("#dueDate").val() + "T" + $("#dueTime").val())).toISOString()
        };

        let description = $("#descriptionTextArea").val();
        let status = $("#statusInput").val();
        let type = $("#taskInput").val();
        let course = $("#courseInput").val();
        
        if (description) {
            formData["description"] = description;
        } else {
            formData["description"] = ""
        }

        if (status !== 'Choose...') {
            formData["stage"] = status;
        } else {
            formData["stage"] = "0"
        }

        if (type !== 'Choose...') {
            formData["type"] = type;
        } else {
            formData["type"] = "Assignment"
        }

        if (course && course !== 'Choose...') {
            formData["course"] = course;
        }

        $.post($("#tmSubmitLink").val(), formData, function (data, status) {
            $("#taskModal").modal("hide")
            window.location.href = window.location.href
        });
    }
}
