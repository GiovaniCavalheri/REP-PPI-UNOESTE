import express from "express";

const server = express();
const PORT = 3000;

server.use(express.urlencoded({ extended: true }));

// Rota inicial
server.get("/", (requisicao, resposta) => {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Instruções</title>
    </head>
    <body>
      <h1>Calculadora de Reajuste Salarial</h1>
      
      <h2>Como usar:</h2>
      <p>Informe os seguintes dados na URL:</p>
      <ul>
        <li>idade - Idade do funcionário (maior que 16)</li>
        <li>sexo - M ou F</li>
        <li>salario_base - Salário base</li>
        <li>anoContratacao - Ano de contratação (maior que 1960)</li>
        <li>matricula - Número da matrícula (maior que 0)</li>
      </ul>
      
      <h3>Exemplo:</h3>
      <p>http://localhost:3000/calcular?idade=25&sexo=M&salario_base=2000&anoContratacao=2015&matricula=12345</p>
    </body>
    </html>
  `;

  resposta.send(html);
});

// Rota para calcular
server.get("/calcular", (requisicao, resposta) => {
  const idade = Number(requisicao.query.idade);
  const salario_base = Number(requisicao.query.salario_base);
  const anoContratacao = Number(requisicao.query.anoContratacao);
  const matricula = Number(requisicao.query.matricula);
  const sexo = requisicao.query.sexo;

  // ==> validando idade
  if (idade < 16) {
    return resposta.send(`
      <h1>Erro</h1>
      <p>Idade Inválida, insira novamente.</p>
      <a href="/">Voltar</a>
    `);
  }

  // ==> validando salario
  if (isNaN(salario_base)) {
    return resposta.send(`
      <h1>Erro</h1>
      <p>O salario base não é um número real válido.</p>
      <a href="/">Voltar</a>
    `);
  }

  // ==> validando ano de contratacao
  if (
    isNaN(anoContratacao) ||
    !Number.isInteger(anoContratacao) ||
    anoContratacao < 1960
  ) {
    return resposta.send(`
      <h1>Erro</h1>
      <p>O ano de contratação deve ser um numero inteiro válido maior ou igual a 1960.</p>
      <a href="/">Voltar</a>
    `);
  }

  // ==> verificando a matricula
  if (isNaN(matricula) || !Number.isInteger(matricula) || matricula <= 0) {
    return resposta.send(`
      <h1>Erro</h1>
      <p>A matricula deve ser um numero inteiro válido maior que zero.</p>
      <a href="/">Voltar</a>
    `);
  }

  if (sexo !== "M" && sexo !== "F") {
    return resposta.send(`
      <h1>Erro</h1>
      <p>Não foi possível realizar o cálculo, dados inválidos</p>
      <a href="/">Voltar</a>
    `);
  }

  const anoAtual = 2026;
  const tempoEmpresa = anoAtual - anoContratacao;

  let novoSalario = 0;

  // == primeira condicao da tabela
  if (idade >= 18 && idade <= 39) {
    if (sexo === "M" || sexo === "m") {
      let salarioReajustado = salario_base * 1.1;
      if (tempoEmpresa <= 10) {
        novoSalario = salarioReajustado - 10;
      } else {
        novoSalario = salarioReajustado + 17;
      }
    } else if (sexo === "F" || sexo === "f") {
      let salarioReajustado = salario_base * 1.08;

      if (tempoEmpresa <= 10) {
        novoSalario = salarioReajustado - 11;
      } else {
        novoSalario = salarioReajustado + 16;
      }
    }
  }

  // == segunda condicao de tabela
  if (idade >= 40 && idade <= 69) {
    if (sexo === "M" || sexo === "m") {
      let salarioReajustado = salario_base * 1.08;
      if (tempoEmpresa <= 10) {
        novoSalario = salarioReajustado - 5;
      } else {
        novoSalario = salarioReajustado + 16;
      }
    } else if (sexo === "F" || sexo === "f") {
      let salarioReajustado = salario_base * 1.1;
      if (tempoEmpresa <= 10) {
        novoSalario = salarioReajustado - 7;
      } else {
        novoSalario = salarioReajustado + 14;
      }
    }
  }

  // == ultima condicao de tabela
  if (idade >= 70 && idade <= 99) {
    if (sexo === "M" || sexo === "m") {
      let salarioReajustado = salario_base * 1.15;
      if (tempoEmpresa <= 10) {
        novoSalario = salarioReajustado - 15;
      } else {
        novoSalario = salarioReajustado + 13;
      }
    } else if (sexo === "F" || sexo === "f") {
      let salarioReajustado = salario_base * 1.17;
      if (tempoEmpresa <= 10) {
        novoSalario = salarioReajustado - 17;
      } else {
        novoSalario = salarioReajustado + 12;
      }
    }
  }

  // html com o resultado
  resposta.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Resultado</title>
    </head>
    <body>
      <h1>Resultado do Cálculo</h1>
      
      <p><strong>Matrícula:</strong> ${matricula}</p>
      <p><strong>Idade:</strong> ${idade} anos</p>
      <p><strong>Sexo:</strong> ${sexo === "M" ? "Masculino" : "Feminino"}</p>
      <p><strong>Salário Base:</strong> R$ ${salario_base}</p>
      <p><strong>Ano de Contratação:</strong> ${anoContratacao}</p>
      <p><strong>Tempo na Empresa:</strong> ${tempoEmpresa} anos</p>
      
      <h2>Novo Salário: R$ ${novoSalario}</h2>
      
      <a href="/">Voltar</a>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Servidor express rodando na Porta: http://localhost:${PORT}/`);
});
