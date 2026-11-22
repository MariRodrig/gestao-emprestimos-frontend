
console.log("Colaboradores.js carregado!");

const token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


const tabelaColaboradores = document.getElementById("tabelaColaboradores");

async function carregarColaboradores() {
    try {
        const response = await fetch(
            "https://gestao-emprestimos-x3we.onrender.com/colaboradores",
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!verificarSessao(response)) {
    return;
}

        if (!response.ok) {
            console.error("Erro ao buscar colaboradores:", response.status);
            return;
        }

        const colaboradores = await response.json();

        tabelaColaboradores.innerHTML = "";

        colaboradores.forEach(colaborador => {
            const linha = document.createElement("tr");

            const dados = [
                colaborador.id,
                colaborador.nome,
                colaborador.email,
                colaborador.cargo
            ];

            dados.forEach(valor => {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            });

            tabelaColaboradores.appendChild(linha);
        });

    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

carregarColaboradores();


const formColaborador = document.getElementById("formColaborador");

formColaborador.addEventListener("submit", async function(event) {
    event.preventDefault();

    console.log("Formulário de colaborador enviado!");

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const cargo = document.getElementById("cargo").value;
    const mensagem = document.getElementById("mensagemCadastro");

    try {
        const response = await fetch(
            "https://gestao-emprestimos-x3we.onrender.com/colaboradores",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    cargo: cargo
                })
            }
        );

        console.log("Status HTTP:", response.status);

        if (!verificarSessao(response)) {
    return;
}

        if (response.ok) {
            mensagem.textContent = "Colaborador cadastrado com sucesso!";
            formColaborador.reset();
            carregarColaboradores();
        } else {
            mensagem.textContent = "Não foi possível cadastrar o colaborador.";
            console.error("Erro HTTP:", response.status);
        }

    } catch (error) {
        mensagem.textContent = "Erro ao conectar com a API.";
        console.error("Erro de conexão:", error);
    }
});