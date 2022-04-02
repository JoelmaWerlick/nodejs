class NotFound extends Error {
  constructor(message = "Fornecedor Nao Encontrado", status = 404) {
    super(message);
    this.status = status;
    this.idError = 0;
  }
}

module.exports = NotFound;
