const app = require("express").Router();
const repository = require("../../repositories/FornecedorRepository");
const SerializerFornecedor =
  require("../../helpers/Serializer").SerializerFornecedor;

app.options("/", (request, response, next) => {
  response.set("Access-Control-Allow-Methods", "GET");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
});

app.get("/", async (_, response) => {
  const fornecedores = await repository.listar();
  const serializer = new SerializerFornecedor(
    response.getHeader("Content-Type")
  );
  response.send(serializer.serialize(fornecedores));
});

module.exports = app;
