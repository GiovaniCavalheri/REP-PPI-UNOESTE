import exprees from "express";

const server = exprees();
const PORT = 3000;

server.use(express.urlencoded({ extended: true }));

// ==> Rota raiz
server.get("/calcular", (requisicao, resposta) => {
  const idade = Number(requisicao.query.idade);
  const salario_base = Number(requisicao.query.salario_base);
  const anoContratacao = Number(requisicao.query.anoContratacao);
  const matricula = Number(requisicao.query.matricula);
  const sexo = requisicao.query.sexo;

  // ==> validando idade
  if (idade < 16) {
    response.send("Idade Inválida, insira novamente;");
  }

  // ==> validando salario
  if (isNaN(salario_base)) {
    response.send("O salario base não é um número real válido.");
  }

  // ==> validando ano de contratacao
  if (
    isNaN(anoContratacao) ||
    !Number.isInteger(anoContratacao) ||
    anoContratacao < 1960
  ) {
    response.send(
      "O ano de contratação deve ser um numero inteiro válido maior ou igual a 1960.",
    );
  }

  // ==> verificando a matricula
  if (isNaN(matricula) || !Number.isInteger(matricula) || matricula <= 0) {
    response.send(
      "A matricula deve ser um numero inteiro válido maior que zero.",
    );

    if (sexo !== "M" && sexo !== "F") {
      response.send("Não foi possível realizar o cálculo, dados inválidos");
    }
  }
  const anoAtual = 2026;
  const tempoEmpresa = anoAtual - anoContratacao;

  let novoSalario = 0;

  if (idade >= 18 && idade <= 39) {
    if (sexo == "M" || sexo == "m") {
      if (tempoEmpresa < 10) {
        const desconto = salario_base * 0.1;
        novoSalario = salario_base - desconto;
      } else {
        novoSalario = salario_base + 17;
      }
    }
  }

  resposta.send({ novoSalario });
});

server.listen(PORT, () => {
  console.log(` Servidor express rodando na Porta: http://localhost:${PORT}/`);
});
