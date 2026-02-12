import exprees from "express";

const server = exprees();
const PORT = 3000;

server.get("/", (request, response) => {
  response.send("Servidor express rodando. \nVocê está na página Inicial.");
});


server.listen(PORT, () => {
  console.log(` Servidor Express rodando na Porta: http://localhost:${PORT}/`);
});

