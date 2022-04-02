const repository = require("../repositories/ProdutoRepository");
const InvalidFields = require("../errors/InvalidFields");
const MissingData = require("../errors/MissingData");

class Produto {
  constructor({
    id,
    titulo,
    preco,
    estoque,
    fornecedor,
    dataCriacao,
    dataAtualizacao,
    versao,
  }) {
    this.id = id;
    this.titulo = titulo;
    this.preco = preco;
    this.estoque = estoque;
    this.fornecedor = fornecedor;
    this.dataCriacao = dataCriacao;
    this.dataAtualizacao = dataAtualizacao;
    this.versao = versao;
  }
  async carregar() {
    const produto = await repository.buscarPorId(this.id, this.fornecedor);

    this.titulo = produto.titulo;
    this.preco = produto.preco;
    this.estoque = produto.estoque;
    this.dataAtualizacao = produto.dataAtualizacao;
    this.dataCriacao = produto.dataCriacao;
    this.versao = produto.versao;
  }

  async atualizar() {
    const dadosParaAtualizar = {};

    if (typeof this.titulo === "string" && this.titulo.length > 0) {
      dadosParaAtualizar.titulo = this.titulo;
    }
    if (typeof this.preco === "number" && this.preco > 0) {
      dadosParaAtualizar.preco = this.preco;
    }
    if (typeof this.estoque === "number") {
      dadosParaAtualizar.estoque = this.estoque;
    }

    if (Object.keys(dadosParaAtualizar).length === 0) {
      throw new MissingData();
    }

    return await repository.atualizar(
      {
        id: this.id,
        fornecedor: this.fornecedor,
      },
      dadosParaAtualizar
    );
  }

  validar() {
    const errors = {};
    if (typeof this.titulo !== "string" || this.titulo.length === 0) {
      errors["titulo"] = `O Campo titulo é invalido `;
    }
    if (typeof this.preco !== "number" || this.titulo.length === 0) {
      errors["preco"] = `O Campo preco é invalido `;
    }

    if (Object.keys(errors).length > 0) {
      throw new InvalidFields(errors);
    }
  }

  async criar() {
    this.validar();
    const resultado = await repository.inserir({
      titulo: this.titulo,
      preco: this.preco,
      estoque: this.estoque,
      fornecedor: this.fornecedor,
    });

    this.id = resultado.id;
    this.dataCriacao = resultado.dataCriacao;
    this.dataAtualizacao = resultado.dataAtualizacao;
    this.versao = resultado.versao;
  }

  async apagar() {
    return await repository.remover(this.id, this.fornecedor);
  }
  // minha versao
  async diminuirEstoque(quantidade) {
    await this.carregar();

    if (
      typeof quantidade === "number" &&
      quantidade > 0 &&
      quantidade <= this.estoque
    ) {
      this.estoque -= quantidade;
      return await repository.atualizar(
        {
          id: this.id,
          fornecedor: this.fornecedor,
        },
        { estoque: this.estoque }
      );
    } else {
      throw new Error("Quantidade invalida");
    }
  }
  // versao do curso
  // async diminuirEstoque(quantidade) {
  //   return repository.subtrair(
  //     this.id,
  //     this.fornecedor,
  //     "estoque",
  //     this.estoque
  //   );
  // }
}

module.exports = Produto;
