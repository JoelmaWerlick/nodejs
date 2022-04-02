class MissingData extends Error {
  constructor(message = "Nao Foram Fornecido Dados para Atualizar", status = 400) {
    super(message);
    this.status = status;
    this.idError = 2;
  }
}

module.exports = MissingData;
