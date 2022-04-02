class InvalidFields extends Error {
  constructor(fields, message, status = 400) {
    if (typeof message !== "string") {
      if (Object.keys(fields).length > 1) {
        message = "Campos Invalidos";
      } else {
        message = "Campo Invalido";
      }
    }
    super(message);
    this.fields = fields;
    this.status = status;
    this.idError = 1;
  }
}

module.exports = InvalidFields;
