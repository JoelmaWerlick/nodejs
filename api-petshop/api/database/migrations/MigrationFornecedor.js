const Sequilize = require("sequelize");
const sqlize = require("../connection");
const colunas = {
  empresa: {
    type: Sequilize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequilize.STRING,
    allowNull: false,
  },
  categoria: {
    type: Sequilize.ENUM("raçao", "brinquedos"),
    allowNull: false,
  },
};

const options = {
  freezeTableName: true,
  tableName: "fornecedores",
  timestamps: true,
  createdAt: "dataCriacao",
  updatedAt: "dataAtualizacao",
  version: "versao",
};

module.exports = sqlize.define("fornecedor", colunas, options);
