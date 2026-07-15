# Mini Gerador de Roteiros - Processo Seletivo FHT

Este projeto é uma versão simplificada de uma plataforma de geração de materiais de vendas, desenvolvido como parte do teste técnico para a vaga de Desenvolvedor(a) Júnior de Produto na FHT.

A aplicação consiste em uma página web (Frontend estático) integrada a um servidor em Node.js (Backend), que se comunicam via requisições JSON para validar campos e gerar um mini-roteiro de vendas estruturado.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript.
* **Backend:** Node.js, Express.

---

## 🚀 Como Executar o Projeto

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina antes de prosseguir.

### 1. Clonar o Repositório
```bash
git clone https://github.com/Samuel-Sj/fht-desafio-dev
cd cd fht-desafio-dev

2. Instalar as Dependências

Na raiz do projeto (onde se encontra o arquivo package.json), execute:
Bash

npm install

3. Iniciar o Servidor

Para colocar a aplicação no ar, rode:
Bash

node ./backend/server.js

O console exibirá a mensagem: Servidor rodando na porta 3000.
4. Acessar a Aplicação

Abra o seu navegador de preferência e acesse:

http://localhost:3000

Para acessar o formulário dois cliques no index.html

🐛 Resolução do Bug (Parte B)
O Problema Original

A função fornecida inicialmente para a geração do roteiro apresentava a seguinte estrutura:
JavaScript

function gerarRoteiro (dados) {
    const publico = dados.publico.toLowerCase();
    const linhas = [
        "Oferta: " + dados.nomeOferta,
        "Para quem é: " + publico,
        "O que você promete: " + dados.resultado,
    ];
    return linhas.join("\n");
}

Causa do Bug:
O erro ocorria devido à falta de validação dos dados de entrada. Se o objeto dados chegasse incompleto (com algum campo undefined, null ou simplesmente ausente), a aplicação quebrava.
Mais especificamente:

    Se a propriedade publico não fosse enviada, tentar chamar o método .toLowerCase() em algo indefinido (dados.publico.toLowerCase()) disparava um erro crítico (TypeError: Cannot read properties of undefined (reading 'toLowerCase')), derrubando o servidor.

    Se qualquer outro campo não fosse preenchido, o backend continuava gerando e devolvendo um roteiro com lacunas vazias (ex: "Oferta: "), prejudicando a experiência do usuário e aceitando dados corrompidos.

A Solução Aplicada

Para sanar o bug e blindar o backend contra dados inválidos ou incompletos, a função foi refatorada para isolar as responsabilidades e garantir integridade:
JavaScript

function gerarRoteiro(dados) {
    try {
        // 1. Sanitização: Garante que as variáveis existam (fallback para string vazia) e remove espaços inúteis nas pontas
        const nomeOferta = (dados.nomeOferta || "").trim();
        const publico = (dados.publico || "").trim();
        const resultado = (dados.resultado || "").trim();

        // 2. Validação Restrita: Bloqueia a geração se houver campos em branco
        if (!nomeOferta || !publico || !resultado) {
            console.log("Algumas informações do roteiro não estão preenchidas pelo usuário!");
            return null; // Retorna null para sinalizar erro de requisição (Bad Request)
        }

        // 3. Formatação segura do roteiro
        const linhas = [
            "Oferta: " + nomeOferta,
            "Para quem é: " + publico.toLowerCase(),
            "O que você promete: " + resultado
        ];

        return linhas.join("\n");

    } catch (error) {
        console.error("Não foi possível gerar o roteiro. Erro:", error);
        return null;
    }
}

O que mudou com a correção:

    Tratamento de Strings: Adição do fallback || "" associado ao método .trim(), que impede que campos preenchidos apenas com espaços vazios passem despercebidos pela validação.

    Controle de Fluxo na Rota: Caso a função retorne null devido a dados incompletos, a rota /forms do Express responde imediatamente com um HTTP Status 400 (Bad Request) e um JSON descritivo: { "erro": "Dados incompletos !" }.

    Tratamento de Exceções: Implementação de um bloco try/catch para impedir que erros imprevistos parem o processo do servidor.


---
