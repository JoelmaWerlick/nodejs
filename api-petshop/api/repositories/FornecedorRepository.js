const Migration = require("../database/migrations/MigrationFornecedor");
const NotFound = require("../errors/NotFound");

module.exports = {
  listar() {
    return Migration.findAll({ raw: true });
  },
  inserir(fornecedor) {
    return Migration.create(fornecedor);
  },
  async buscarPorId(id) {
    const encontrado = await Migration.findOne({ where: { id: id } });
    if (!encontrado) {
      throw new NotFound();
    }
    return encontrado;
  },
  async atualizar(id, dadosParaAtualizar) {
    return Migration.update(dadosParaAtualizar, {
      where: {
        id: id,
      },
    });
  },
  async deletar(id) {
    return Migration.destroy({
      where: {
        id: id,
      },
    });
  },
};
