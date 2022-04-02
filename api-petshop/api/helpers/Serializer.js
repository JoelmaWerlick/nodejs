const UnsuportedValue = require("../errors/UnsupportedValue");
const jsontoxml = require("jsontoxml");

class Serializer {
  constructor(contentType) {
    this.contentType = contentType;
  }

  json(data) {
    return JSON.stringify(data);
  }

  xml(data) {
    let xmlKey = this.tagSingular;
    if (Array.isArray(data)) {
      xmlKey = this.tagPlural;
      data = data.map((singleObject) => {
        return {
          [this.tagSingular]: singleObject,
        };
      });
    }
    return jsontoxml({ [xmlKey]: data });
  }

  serialize(data) {
    data = this.filter(data);
    if (this.contentType === "application/json") {
      return this.json(data);
    }
    if (this.contentType === "application/xml") {
      return this.xml(data);
    }
    throw new UnsuportedValue(this.contentType);
  }

  filterPublicData(data) {
    const newObject = {};

    this.publicFields.forEach((field) => {
      if (data.hasOwnProperty(field)) {
        newObject[field] = data[field];
      }
    });

    return newObject;
  }

  filter(data) {
    if (Array.isArray(data)) {
      data = data.map((singleObject) => this.filterPublicData(singleObject));
    } else {
      data = this.filterPublicData(data);
    }
    return data;
  }
}

class SerializerFornecedor extends Serializer {
  constructor(
    contentType,
    extraFields,
    tagSingular = "Fornecedor",
    tagPlural = "Fornecedores"
  ) {
    super(contentType);
    this.publicFields = ["id", "categoria"].concat(
      extraFields || []
    );
    this.tagSingular = tagSingular;
    this.tagPlural = tagPlural;
  }
}

class SerializerProduto extends Serializer {
  constructor(
    contentType,
    extraFields,
    tagSingular = "Produto",
    tagPlural = "Produtos"
  ) {
    super(contentType);
    this.publicFields = ["id", "titulo", "preco", "estoque"].concat(
      extraFields || []
    );
    this.tagSingular = tagSingular;
    this.tagPlural = tagPlural;
  }
}

class SerializeError extends Serializer {
  constructor(
    contentType,
    extraFields,
    tagSingular = "Error",
    tagPlural = "Errors"
  ) {
    super(contentType);
    this.publicFields = ["idError", "message", "fields"].concat(
      extraFields || []
    );
    this.tagSingular = tagSingular;
    this.tagPlural = tagPlural;
  }
}

module.exports = {
  Serializer: Serializer,
  SerializerFornecedor: SerializerFornecedor,
  SerializerProduto: SerializerProduto,
  SerializeError: SerializeError,
  acceptedContentTypes: ["application/json", "application/xml"],
};
