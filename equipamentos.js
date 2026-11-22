const token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const tabelaEquipamentos = document.getElementById("tabelaEquipamentos");
let equipamentoEditandoId = null;
let equipamentoDisponivel = true;


async function carregarEquipamentos() {
    try {
        const response = await fetch(
            "https://gestao-emprestimos-x3we.onrender.com/equipamentos",
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

if (!verificarSessao(response)) {
    return;
}

        if (!response.ok) {
            console.error("Erro ao buscar equipamentos:", response.status);
            return;
        }

        const equipamentos = await response.json();

        tabelaEquipamentos.innerHTML = "";

        equipamentos.forEach(equipamento => {
            const linha = document.createElement("tr");

            const dados = [
                equipamento.id,
                equipamento.patrimonio,
                equipamento.nome,
                equipamento.tipo,
                equipamento.disponivel ? "Sim" : "Não"
            ];

            dados.forEach(valor => {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            });

            const celulaAcoes = document.createElement("td");
            const botaoExcluir = document.createElement("button");

            const botaoEditar = document.createElement("button");

botaoEditar.textContent = "Editar";
botaoEditar.className = "btn-editar";

botaoEditar.addEventListener("click", function() {
      equipamentoEditandoId = equipamento.id;
      equipamentoDisponivel = equipamento.disponivel;


    document.getElementById("patrimonio").value = equipamento.patrimonio;
    document.getElementById("nome").value = equipamento.nome;
    document.getElementById("tipo").value = equipamento.tipo;

      document.querySelector("#formEquipamento button").textContent = "Salvar alterações";
});

            botaoExcluir.textContent = "Excluir";
            botaoExcluir.className = "btn-excluir";

            botaoExcluir.addEventListener("click", function() {
                excluirEquipamento(equipamento.id);
            });

            celulaAcoes.appendChild(botaoEditar);
            celulaAcoes.appendChild(botaoExcluir);
            linha.appendChild(celulaAcoes);

            tabelaEquipamentos.appendChild(linha);
        });

    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

carregarEquipamentos();


const formEquipamento = document.getElementById("formEquipamento");

formEquipamento.addEventListener("submit", async function(event) {
    event.preventDefault();

    const patrimonio = document.getElementById("patrimonio").value;
    const nome = document.getElementById("nome").value;
    const tipo = document.getElementById("tipo").value;
    const mensagem = document.getElementById("mensagemCadastro");

const editando = equipamentoEditandoId !== null;

const url = editando
    ? `https://gestao-emprestimos-x3we.onrender.com/equipamentos/${equipamentoEditandoId}`
    : "https://gestao-emprestimos-x3we.onrender.com/equipamentos";

const metodo = editando ? "PUT" : "POST";

    try {
    const response = await fetch(
    url,
    {
        method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    patrimonio: patrimonio,
                    nome: nome,
                    tipo: tipo,
                    disponivel: editando ? equipamentoDisponivel : true
                })
            }
        );

        if (!verificarSessao(response)) {
    return;
}

        if (response.ok) {
          mensagem.textContent = editando
    ? "Equipamento atualizado com sucesso!"
    : "Equipamento cadastrado com sucesso!";

formEquipamento.reset();
equipamentoEditandoId = null;
equipamentoDisponivel = true;

document.querySelector("#formEquipamento button").textContent = "Cadastrar";

carregarEquipamentos();



        } else {
            mensagem.textContent = editando
    ? "Não foi possível atualizar o equipamento."
    : "Não foi possível cadastrar o equipamento.";
        }

    } catch (error) {
        mensagem.textContent = "Erro ao conectar com a API.";
        console.error(error);
    }
});


async function excluirEquipamento(id) {
    const confirmar = confirm("Deseja realmente excluir este equipamento?");

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(
            `https://gestao-emprestimos-x3we.onrender.com/equipamentos/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!verificarSessao(response)) {
    return;
}

        if (response.ok) {
            alert("Equipamento excluído com sucesso!");
            carregarEquipamentos();

        } else if (response.status === 409) {
            alert("Não é possível excluir um equipamento com histórico de empréstimos.");
        } else {
            alert("Não foi possível excluir o equipamento.");
            console.error("Erro HTTP:", response.status);
        }

    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro ao conectar com a API.");
    }
}
