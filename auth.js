function verificarSessao(response) {
    if (response.status === 401) {
        sessionStorage.removeItem("token");
        window.location.href = "login.html";
        return false;
    }

    return true;
}