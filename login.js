const formLogin = document.getElementById("formLogin");

console.log("JavaScript carregado!");

formLogin.addEventListener("submit", async function(event) {
    event.preventDefault();

    console.log("Botão Entrar clicado!");

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch(
            "https://gestao-emprestimos-x3we.onrender.com/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );

        console.log("Status HTTP:", response.status);

        if (response.ok) {
    const dados = await response.json();

    sessionStorage.setItem("token", dados.token);

    console.log("Login realizado com sucesso!");

    window.location.href = "dashboard.html";
    
} else {
    console.log("E-mail ou senha incorretos.");
}

    } catch (error) {
        console.error("Erro ao conectar com a API:", error);
    }
});