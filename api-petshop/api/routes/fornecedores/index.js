const app = require("express").Router();
const repository = require("../../repositories/FornecedorRepository");
const Fornecedor = require("../../model/Fornecedores");
const SerializerFornecedor =
  require("../../helpers/Serializer").SerializerFornecedor;

app.options("/", (request, response, next) => {
  response.set("Access-Control-Allow-Methods", "GET, POST");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
});

app.get("/", async (_, response) => {
  const fornecedores = await repository.listar();
  const serializer = new SerializerFornecedor(
    response.getHeader("Content-Type"),
    ["empresa"]
  );
  response.send(serializer.serialize(fornecedores));
});

app.post("/", async (request, response, next) => {
  try {
    const dadosDoFornecedor = request.body;
    const fornecedor = new Fornecedor(dadosDoFornecedor);
    await fornecedor.criar();
    const serializer = new SerializerFornecedor(
      response.getHeader("Content-Type"),
      ["empresa"]
    );
    response.status(201).send(serializer.serialize(fornecedor));
  } catch (err) {
    next(err);
  }
});

app.options("/:id", (request, response, next) => {
  response.set("Access-Control-Allow-Methods", "GET,PUT,DELETE");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
});
app.get("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const fornecedor = new Fornecedor({ id: id });
    await fornecedor.carregar();
    const serializer = new SerializerFornecedor(
      response.getHeader("Content-Type"),
      ["empresa", "email", "dataCriacao", "dataAtualizacao", "versao"]
    );
    response.send(serializer.serialize(fornecedor));
  } catch (err) {
    next(err);
  }
});

app.put("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const dadosDoFornecedorAtualizados = request.body;

    const fornecedor = new Fornecedor({ id, ...dadosDoFornecedorAtualizados });
    await fornecedor.atualiza({ ...dadosDoFornecedorAtualizados });

    const serializer = new SerializerFornecedor(
      response.getHeader("Content-Type"),
      ["empresa"]
    );

    response.send(serializer.serialize(fornecedor));
  } catch (err) {
    next(err);
  }
});

app.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const fornecedor = new Fornecedor({ id });
    await fornecedor.deletar();

    const serializer = new SerializerFornecedor(
      response.getHeader("Content-Type"),
      ["message", "fornecedor", "empresa"]
    );

    response.send(
      serializer.serialize({
        message: "fornecedor deletado",
        fornecedor: serializer.filter(fornecedor),
      })
    );
  } catch (err) {
    next(err);
  }
});

const verificarExisteFornecedor = async (req, res, next) => {
  try {
    const id = req.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });
    await fornecedor.carregar();
    req.fornecedor = fornecedor;
    next();
  } catch (err) {
    next(err);
  }
};

const produtos = require("./produtos");
app.use("/:idFornecedor/produtos", verificarExisteFornecedor, produtos);

module.exports = app;
