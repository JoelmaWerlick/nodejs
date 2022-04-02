class UnsupportedValue extends Error {
  constructor(
    contentType,
    message,
    status = 406
  ) {
    if(!message){
      message=`O tipo de conteudo ${contentType} nao é suportado`
    }
    super(message);
    this.status = status;
    this.idError = 3;
  }
}

module.exports = UnsupportedValue;
