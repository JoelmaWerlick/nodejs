const migrations = [
  {
    module: require("./migrations/MigrationFornecedor"),
    name: "fornecedores",
  },
  {
    module: require("./migrations/MigrationProdutos"),
    name: "produtos",
  },
];

async function CriarTabelas() {
  for (let counter = 0; counter < migrations.length; counter++) {
    const migration = migrations[counter];

    await migration.module
      .sync()
      .then(() => {
        console.log(`tabela ${migration.name} criada com sucesso`);
      })
      .catch(console.log);
  }
}

CriarTabelas();
