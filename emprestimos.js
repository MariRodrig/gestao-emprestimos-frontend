console.log("Emprestimos.js carregado!");

const token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


const selectColaborador = document.getElementById("colaborador");


let colaboradores = []

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

        colaboradores = await response.json();

        colaboradores.forEach(colaborador => {
            const option = document.createElement("option");

            option.value = colaborador.id;
            option.textContent = colaborador.nome;

            selectColaborador.appendChild(option);
        });

    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}


const selectEquipamento = document.getElementById("equipamento");

let equipamentos = [];

async function carregarEquipamentos() {

    selectEquipamento.innerHTML =
    '<option value="">Selecione um equipamento</option>';

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

        if (!response.ok) {
            console.error("Erro ao buscar equipamentos:", response.status);
            return;
        }

        equipamentos = await response.json();

       equipamentos
    .filter(equipamento => equipamento.disponivel === true)
    .forEach(equipamento => {
            const option = document.createElement("option");

            option.value = equipamento.id;
            option.textContent = equipamento.nome;

            selectEquipamento.appendChild(option);
        });

    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

carregarEquipamentos();

const formEmprestimo = document.getElementById("formEmprestimo");
const mensagem = document.getElementById("mensagemEmprestimo");

formEmprestimo.addEventListener("submit", async function(event) {
    event.preventDefault();

    const colaboradorId = Number(selectColaborador.value);
    const equipamentoId = Number(selectEquipamento.value);

    try {
        const response = await fetch(
            "https://gestao-emprestimos-x3we.onrender.com/emprestimos",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    equipamentoId: equipamentoId,
                    colaboradorId: colaboradorId
                })
            }
        );

        if (!verificarSessao(response)) {
            return;
        }

        if (response.ok) {
            mensagem.textContent = "Empréstimo registrado com sucesso!";
            formEmprestimo.reset();

              await carregarEquipamentos();
              await carregarEmprestimos();

        } else {
           const erro = await response.json();

    mensagem.textContent =
        erro.mensagem || "Não foi possível registrar o empréstimo.";

    console.error("Erro HTTP:", response.status);
        }

    } catch (error) {
        mensagem.textContent = "Erro ao conectar com a API.";
        console.error("Erro de conexão:", error);
    }
});

const tabelaEmprestimos = document.getElementById("tabelaEmprestimos");

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

async function carregarEmprestimos() {
    try {
        const response = await fetch(
            "https://gestao-emprestimos-x3we.onrender.com/emprestimos",
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
            console.error("Erro ao buscar empréstimos:", response.status);
            return;
        }

        const emprestimos = await response.json();

        tabelaEmprestimos.innerHTML = "";

        emprestimos.forEach(emprestimo => {
            const linha = document.createElement("tr");

const colaborador = colaboradores.find(
    c => c.id === emprestimo.colaboradorId
);

const equipamento = equipamentos.find(
    e => e.id === emprestimo.equipamentoId
);


            const dados = [
                emprestimo.id,
              colaborador ? colaborador.nome : "Não encontrado",
              equipamento ? equipamento.nome : "Não encontrado",
              formatarData(emprestimo.dataEmprestimo),
               formatarData(emprestimo.dataPrevistaDevolucao),
                emprestimo.dataDevolucao
                    ? "Devolvido"
                    : emprestimo.atrasado
                        ? "Atrasado"
                        : "Em aberto"
            ];

            dados.forEach(valor => {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            });

            // Coluna reservada para o botão de devolução
            const celulaAcoes = document.createElement("td");

if (!emprestimo.dataDevolucao) {
    const botaoDevolver = document.createElement("button");

    botaoDevolver.textContent = "Devolver";

    botaoDevolver.addEventListener("click", function() {
    devolverEmprestimo(emprestimo.id);
});

    celulaAcoes.appendChild(botaoDevolver);
}

linha.appendChild(celulaAcoes);

            tabelaEmprestimos.appendChild(linha);
        });

    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

async function devolverEmprestimo(id) {
    const confirmar = confirm("Deseja confirmar a devolução deste equipamento?");

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(
            `https://gestao-emprestimos-x3we.onrender.com/emprestimos/${id}/devolucao`,
            {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!verificarSessao(response)) {
            return;
        }

        if (response.ok) {
            alert("Equipamento devolvido com sucesso!");

            await carregarEmprestimos();
            await carregarEquipamentos();
        } else {
             const erro = await response.json();

    alert(erro.mensagem || "Não foi possível registrar a devolução.");

    console.error("Erro ao devolver equipamento:", response.status);
        }

    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro ao conectar com a API.");
    }
}

async function iniciarPagina() {
    await carregarColaboradores();
    await carregarEmprestimos();
    await carregarEmprestimos();
}

iniciarPagina();