const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

function gerarRoteiro(dados) {
    try {
        const publico = (dados.publico || "").toLowerCase().trim();

        const linhas = [
            "Oferta: " + (dados.nomeOferta || "").trim(),
            "Para quem é: " + publico,
            "O que você promete: " + (dados.resultado || "").trim()
        ];

        const vazio = linhas.some(linha => linha.endsWith(": "));

        if (vazio) {
            console.log(
                "Algumas informações do roteiro não estão preenchidas pelo usuário!"
            );
            return null;

        }

        return linhas.join("\n");

    } catch (error) {
        console.error(
            "Não foi possível gerar o roteiro. Erro:",
            error
        );

        return;
    }
}

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/index.html")
    );

    res.send("Root")
});


app.post("/forms", (req, res) => {

    const data = req.body;

    const roteiro = gerarRoteiro(data);

    if (!roteiro) {
        return res.status(400).json({
            erro: "Dados incompletos !"
        });
    }

    res.status(200).json({
        roteiro
    });
});


app.use((req, res) => {
    res.status(404).json({
        erro: "Rota não encontrada"
    });
});
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});