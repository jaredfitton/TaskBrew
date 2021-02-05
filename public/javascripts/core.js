function assignScriptToClick(id, handler) {
    $("#"+id).on("click", handler)
}

function assignParameterizedScriptToClick(id, handler, param) {
    $("#"+id).on("click", () => {handler(param)});
}

function assignScriptToRadio(name, handler) {
    $(`input:radio[name="${name}"]`).on('change', function () {
        handler($(this).val())
    });
}

function formatDateString(rawDate, options) {
    let datej = new Date(rawDate)
    return datej.toLocaleDateString(undefined, options)
}

function formatTimeString(rawDate, options) {
    let datej = new Date(rawDate)
    return datej.toLocaleTimeString(undefined, options)
}