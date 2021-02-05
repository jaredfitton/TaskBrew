function login(email, accessToken, displayName) {
    $.post("/handlers/signin", {token:accessToken, email:email, name:displayName}, (rez, success) => {
        window.location.href = "/"
    })
}
