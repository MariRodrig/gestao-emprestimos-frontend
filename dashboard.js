const token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const btnSair = document.getElementById("btnSair");

btnSair.addEventListener("click", function() {
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
});

async function carregarEquipamentos() {
    const token = sessionStorage.getItem("token");

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

        if (!response.ok) {
            console.error("Erro ao buscar equipamentos:", response.status);
            return;
        }

        const equipamentos = await response.json();

        console.log("Equipamentos recebidos:", equipamentos);

        const total = equipamentos.length;

const disponiveis = equipamentos.filter(
    equipamento => equipamento.disponivel === true
).length;

const emprestados = equipamentos.filter(
    equipamento => equipamento.disponivel === false
).length;

document.getElementById("equipamentosEmprestados").textContent = emprestados;

document.getElementById("totalEquipamentos").textContent = total;

document.getElementById("equipamentosDisponiveis").textContent = disponiveis;

    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

carregarEquipamentos();

async function carregarEmprestimos() {
    const token = sessionStorage.getItem("token");

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

        console.log("Empréstimos recebidos:", emprestimos);

        const atrasados = emprestimos.filter(
    emprestimo => emprestimo.atrasado === true
).length;

document.getElementById("emprestimosAtrasados").textContent = atrasados;

    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

carregarEmprestimos();