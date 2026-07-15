# Mini Gerador de Roteiros - Processo Seletivo FHT

Este projeto é uma versão simplificada de uma plataforma de geração de materiais de vendas, desenvolvido como parte do teste técnico para a vaga de **Desenvolvedor(a) Júnior de Produto na FHT**.

A aplicação consiste em uma página web (**Frontend estático**) integrada a um servidor em **Node.js (Backend)**, que se comunicam via requisições JSON para validar campos e gerar um mini-roteiro de vendas estruturado.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 e JavaScript.
- **Backend:** Node.js e Express.

---

# 🚀 Como Executar o Projeto

Certifique-se de ter o **Node.js** instalado em sua máquina antes de prosseguir.

## 1. Clonar o Repositório

```bash
git clone https://github.com/Samuel-Sj/fht-desafio-dev
cd fht-desafio-dev
```

---

## 2. Instalar as Dependências

Na raiz do projeto (onde se encontra o arquivo `package.json`), execute:

```bash
npm install
```

---

## 3. Iniciar o Servidor

Para iniciar a aplicação, execute:

```bash
node ./backend/server.js
```

O console exibirá a mensagem:

```
Servidor rodando na porta 3000.
```

---

## 4. Acessar a Aplicação

Abra o navegador de sua preferência e acesse:

```
http://localhost:3000
```

Caso seja necessário acessar diretamente o formulário, abra o arquivo:

```
index.html
```

---

# 🐛 Resolução do Bug (Parte B)

## O Problema Original

A função fornecida inicialmente para geração do roteiro apresentava a seguinte estrutura:

```javascript
function gerarRoteiro(dados) {
    const publico = dados.publico.toLowerCase();

    const linhas = [
        "Oferta: " + dados.nomeOferta,
        "Para quem é: " + publico,
        "O que você promete: " + dados.resultado,
    ];

    return linhas.join("\n");
}
```

---

## Causa do Bug

O erro ocorria devido à falta de validação dos dados de entrada.

Caso o objeto `dados` chegasse incompleto (com algum campo `undefined`, `null` ou ausente), a aplicação quebrava.

### Problemas encontrados:

- Se a propriedade `publico` não fosse enviada, a chamada:

```javascript
dados.publico.toLowerCase()
```

gerava o erro:

```
TypeError: Cannot read properties of undefined (reading 'toLowerCase')
```

Esse erro interrompia a execução do servidor.

- Caso qualquer outro campo estivesse vazio, o backend continuava gerando um roteiro incompleto, como:

```
Oferta:
```

Isso permitia o envio de dados inválidos e prejudicava a experiência do usuário.

---

# ✅ A Solução Aplicada

Para corrigir o problema e proteger o backend contra dados inválidos ou incompletos, a função foi refatorada:

```javascript
function gerarRoteiro(dados) {
    try {
        // 1. Sanitização dos dados recebidos
        // Garante que as variáveis existam e remove espaços desnecessários
        const nomeOferta = (dados.nomeOferta || "").trim();
        const publico = (dados.publico || "").trim();
        const resultado = (dados.resultado || "").trim();

        // 2. Validação dos campos obrigatórios
        if (!nomeOferta || !publico || !resultado) {
            console.log("Algumas informações do roteiro não estão preenchidas pelo usuário!");
            return null;
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
```

---

# 🔎 O que mudou com a correção

## ✅ Tratamento de Strings

Foi adicionado o fallback:

```javascript
|| ""
```

junto ao método:

```javascript
.trim()
```

Isso garante que valores inexistentes ou contendo apenas espaços vazios não causem erros durante o processamento.

---

## ✅ Controle de Fluxo na Rota

Caso a função retorne `null` devido a dados incompletos, a rota `/forms` do Express responde com:

**HTTP Status: 400 (Bad Request)**

Retornando o JSON:

```json
{
    "erro": "Dados incompletos !"
}
```

---

## ✅ Tratamento de Exceções

Foi implementado um bloco:

```javascript
try/catch
```

para capturar erros inesperados e evitar que falhas internas interrompam o funcionamento do servidor.

---

# Conclusão

A correção tornou o gerador de roteiros mais seguro, evitando falhas causadas por entradas inválidas e garantindo que apenas dados completos sejam processados pela aplicação.
