const app = require("express").Router();
const repository = require("../../../repositories/ProdutoRepository");
const Produto = require("../../../model/Produtos");
const Serializer = require("../../../helpers/Serializer").SerializerProduto;

app.options("/:", (_, response) => {
  response.set("Access-Control-Allow-Methods", "GET,POST");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
});
app.get("/", async (req, res) => {
  const idFornecedor = req.fornecedor.id;
  const produtos = await repository.listar(idFornecedor);
  const serializer = new Serializer(res.getHeader("Content-Type"));
  res.set(
    "x-powered-by",
    "https://www.linkedin.com/in/luisfelipedepaulacosta/"
  );
  res.send(serializer.serialize(produtos));
});
app.post("/", async (req, res, next) => {
  try {
    const idFornecedor = req.fornecedor.id;
    const dados = req.body;
    const produtoParaCadastrar = Object.assign({}, dados, {
      fornecedor: idFornecedor,
    });
    const produto = new Produto(produtoParaCadastrar);
    await produto.criar();
    res.set(
      "x-powered-by",
      "https://www.linkedin.com/in/luisfelipedepaulacosta/"
    );

    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);
    res.set(
      "Location",
      `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`
    );
    const serializer = new Serializer(res.getHeader("Content-Type"));
    res.status(201).send(serializer.serialize(produto));
  } catch (err) {
    next(err);
  }
});

app.options("/:id", (_, response) => {
  response.set("Access-Control-Allow-Methods", "GET,PUT,DELETE,HEAD");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
});
app.get("/:id", async (req, res, next) => {
  try {
    const dados = {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    };
    const produto = new Produto(dados);
    await produto.carregar();
    res.set(
      "x-powered-by",
      "https://www.linkedin.com/in/luisfelipedepaulacosta/"
    );

    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);

    const serializer = new Serializer(res.getHeader("Content-Type"), [
      "dataCriacao",
      "dataAtualizacao",
      "fornecedor",
      "versao",
    ]);
    res.send(serializer.serialize(produto));
  } catch (err) {
    next(err);
  }
});
app.head("/:id", async (req, res, next) => {
  try {
    const dados = {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    };
    const produto = new Produto(dados);
    await produto.carregar();
    res.set(
      "x-powered-by",
      "https://www.linkedin.com/in/luisfelipedepaulacosta/"
    );
    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);
    res.end();
  } catch (err) {
    next(err);
  }
});
app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const idFornecedor = req.fornecedor.id;
  const produto = new Produto({ id, fornecedor: idFornecedor });
  await produto.apagar();
  res.set(
    "x-powered-by",
    "https://www.linkedin.com/in/luisfelipedepaulacosta/"
  );

  res.status(204).end();
});
app.put("/:id", async (req, res, next) => {
  try {
    const dados = Object.assign({}, req.body, {
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    });

    const produto = new Produto(dados);

    await produto.atualizar();
    await produto.carregar();
    res.set(
      "x-powered-by",
      "https://www.linkedin.com/in/luisfelipedepaulacosta/"
    );

    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});


app.options("/:id/diminuir-estoque", (_, response) => {
  response.set("Access-Control-Allow-Methods", "POST");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.status(204).end();
});
// minha versao
app.post("/:id/diminuir-estoque", async (req, res, next) => {
  try {
    const produto = new Produto({
      id: req.params.id,
      fornecedor: req.fornecedor.id,
    });

    const quantidade = req.body.quantidade;
    await produto.diminuirEstoque(quantidade);

    await produto.carregar();
    res.set(
      "x-powered-by",
      "https://www.linkedin.com/in/luisfelipedepaulacosta/"
    );

    res.set("ETag", produto.versao);
    const timestamp = new Date(produto.dataAtualizacao).getTime();
    res.set("Last-Modified", timestamp);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// versao do curso
// app.post("/:id/diminuir-estoque", async (req, res, next) => {
//   try {
//     const produto = new Produto({
//       id: req.params.id,
//       fornecedor: req.fornecedor.id,
//     });

//     await produto.carregar();

//     const quantidade = req.body.quantidade;
//     produto.estoque = produto.estoque - quantidade;
//     produto.diminuirEstoque();
//     res.status(204).end();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = app;
