const Sequelize = require("sequelize");
const sqlize = require("../connection");

const columns = {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preco: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  estoque: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  fornecedor: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: require("./MigrationFornecedor"),
      key: "id",
    },
  },
};

const options = {
  freezeTableName: true,
  tableName: "produtos",
  timestamps: true,
  createdAt: "dataCriacao",
  updatedAt: "dataAtualizacao",
  version: "versao",
};

module.exports = sqlize.define("produto", columns, options);
