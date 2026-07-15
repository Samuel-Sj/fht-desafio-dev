const form = document.querySelector(".form-submit");
const resultadoDiv = document.getElementById("resultadoRoteiro");

async function SubmitForm() {
    const dados = Object.fromEntries(new FormData(form));

    try {
        const response = await fetch("http://localhost:3000/forms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro:", data.erro);
            alert(data.erro);
            return;
        }

        console.log("Roteiro gerado:", data.roteiro);

        if (data.roteiro) {
            resultadoDiv.innerText = data.roteiro;
            resultadoDiv.style.display = "block"; 
        }

    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao conectar com o servidor.");
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    SubmitForm();
});