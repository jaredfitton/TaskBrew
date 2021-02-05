function createCourseForm() {
    let formJS = document.getElementById('courseForm');
    let form = $("#courseForm");

    if (!formJS.checkValidity()) {
        form.addClass("was-validated");
    } else {
        var formData = {
            title: $("#courseTitle").val(),
            courseNum: $("#courseNum").val(),
            color: "#FFFFFF"
        };

        console.log(formData);

        $.post("/handlers/create-course", formData, function (data, status) {
            location.href = location.href
        });
    }
}

function createCourseResourceForm() {
    let formJS = document.getElementById('courseResourceForm');
    let form = $("#courseResourceForm");

    if (!formJS.checkValidity()) {
        form.addClass("was-validated");
    } else {
        var formData = {
            title: $("#resourceTitle").val(),
            link: $("#resourceLink").val()
        };

        console.log(formData);

        $.post($("#crPostLink").val(), formData, function (data, status) {
            location.href = location.href
        });
    }
}

function createCourseMeetingForm() {
    let formJS = document.getElementById('courseMeetingForm');
    let form = $("#courseMeetingForm");

    if (!formJS.checkValidity()) {
        form.addClass("was-validated");
    } else {
        var formData = {
            title: $("#meetingTitle").val(),
            type: $("#meetingType").val(),
            days: $("#meetingDays").val()
        };

        let meetingLink = $("#meetingLink").val();

        if (meetingLink && meetingLink !== '') {
            formData["link"] = meetingLink;
        }

        console.log(formData);

        $.post($("#cmPostLink").val(), formData, function (data, status) {
            location.href = location.href
        });
    }
}
