function openTaskModal(taskID) {
    $("#taskModal").modal("show")

    $.get(`/providers/task-data?task=${taskID}`)
        .done((data, status, jqxhr) => {
            console.log(JSON.stringify(data))

            $("#taskName").val(data.task.name)
            $("#difficultyRange").val(data.task.complexity)
            $("#dueDate").val(data.task.dueDate)
            $("#dueTime").val(data.task.dueTime)
            $("#descriptionTextArea").val(data.task.description)

            var slider = document.getElementById("difficultyRange");
            var difficultyLabel = document.getElementById("difficultyLabel");
            var brewLevelParagraph = document.getElementById("brewLevel");

            let brewLevel = ["Decaf", "Instant Coffee with Creamer", "Drip", "Pour Over", "French Press",
                "Ristretto", "Straight Black Coffee", "Espresso", "Double Shot", "Triple Shot"];
            brewLevelParagraph.innerHTML = "Brew Level: " + brewLevel[parseInt(slider.value)-1];
            difficultyLabel.innerHTML = "Difficulty: " + slider.value;
            brewLevelParagraph.innerHTML = "Brew Level: " + brewLevel[parseInt(slider.value)-1];

            let si = $("#statusInput").empty()
                .append($("<option disabled value>Choose...</option>"))

            $.each(data.stages, (i, stage) => {
                console.log(`Stage: ${JSON.stringify(stage)}`)
                let dom
                if (stage.id === data.task.stageID) {
                    dom = `<option value="${stage.id}" selected>${stage.name}</option>option>`
                } else {
                    dom = `<option value="${stage.id}">${stage.name}</option>option>`
                }

                si.append($(dom))
            })

            let ci = $("#courseInput").empty()
                .append($("<option disabled value>Choose...</option>"))

            $.each(data.courses, (i, course) => {
                let dom
                if (course.id === data.task.courseID) {
                    dom = `<option value="${course.id}" selected>${course.num}</option>option>`
                } else {
                    dom = `<option value="${course.id}">${course.num}</option>option>`
                }

                ci.append($(dom))
            })

            let noneDom
            if (data.task.courseID) {
                noneDom = "<option value>None</option>"
            } else {
                noneDom = "<option selected value>None</option>"
            }

            ci.append($(noneDom))

            $(`#taskInput option[value=${data.task.type}]`).prop('selected', true)

            $("#handleTask").text("Update Task")
            $("#tmSubmitLink").val("/handlers/update-task?task="+taskID)
        })
        .fail((jqxhr, status, error) => {
            $("#taskModal").modal("hide")
        })
}

function openCreateTaskModal() {
    $("#taskModal").modal("show")

    $.get(`/providers/form-data`)
        .done((data, status, jqxhr) => {
            $("#taskName").val("")
            $("#difficultyRange").val(1)
            $("#dueDate").val("")
            $("#dueTime").val("")
            $("#descriptionTextArea").val("")

            let si = $("#statusInput").empty()
                .append($("<option disabled selected value>Choose...</option>"))

            $.each(data.stages, (i, stage) => {
                let dom = `<option value="${stage.id}">${stage.name}</option>option>`

                si.append($(dom))
            })

            let ci = $("#courseInput").empty()
                .append($("<option disabled selected value>Choose...</option>"))

            $.each(data.courses, (i, course) => {
                let dom = `<option value="${course.id}">${course.num}</option>option>`

                ci.append($(dom))
            })

            ci.append($("<option value>None</option>"))

            // let types = ["Assignment", "Reading", "Project", "Exam", "Quiz", "Task"]
            // let ti = $("#taskInput").empty()
            //     .add($("<option disabled selected value>Choose...</option>"))
            //
            // $.each(types, (i, type) => {
            //     let dom = `<option value="${type}">${type}</option>option>`
            //
            //     ti.add($(dom))
            // })

            $("#handleTask").text("Create Task")
            $("#tmSubmitLink").val("/handlers/create-task")
        })
        .fail((jqxhr, status, error) => {
            $("#taskModal").modal("hide")
        })
}

function openAddMeeting(course) {
    $("#courseMeetingModal").modal("show")

    $("#cmPostLink").val("/handlers/add-meeting?course="+course)
}

function openAddResource(course) {
    $("#courseResourceModal").modal("show")

    $("#crPostLink").val("/handlers/add-resource?course="+course)
}