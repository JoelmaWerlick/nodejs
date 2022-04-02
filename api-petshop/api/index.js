const express = require("express");
const config = require("config");
const acceptedContentTypes =
  require("./helpers/Serializer").acceptedContentTypes;

const SerializeError = require("./helpers/Serializer").SerializeError;

const app = express();

app.use(express.json());

// middleware para checagem de tipo de conteudo pedido
app.use((request, response, next) => {
  let requestedContentType = request.header("Accept");
  console.log(requestedContentType)

  if (requestedContentType == "*/*" || requestedContentType =="text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9") {
    requestedContentType = "application/json";
  }

  if (acceptedContentTypes.indexOf(requestedContentType) === -1) {
    response.status(406).end();
    return;
  }

  response.setHeader("Content-Type", requestedContentType);
  next();
});

//middleware para permitir sites externos acessarem nossa api (cors)
app.use((request, response, next) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set
  next();
});
//rotas
const fornecedores = require("./routes/fornecedores/");
app.use("/api/fornecedores", fornecedores);
const fornecedoresv2 = require("./routes/fornecedores/routes.v2");
app.use("/api/v2/fornecedores", fornecedoresv2);

// middleware para tratamento de errors
app.use((err, request, response, next) => {
  const serializer = new SerializeError(response.getHeader("Content-Type"));

  response.status(err.status ? err.status : 500).send(
    serializer.serialize({
      idError: err.idError,
      message: err.message,
      fields: err.fields,
    })
  );
});

app.listen(config.get("api.porta"), () =>
  console.log(`servidor iniciado na porta ${config.get("api.porta")}!`)
);
