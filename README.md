# **siscoaf-xml-builder-for-register**
Construa XML para o SISCOAF a partir do Escriba Register

### **O que é?**
Uma simples ferramenta para coletar informações de protocolos do software Escriba Register e gerar um lote XML compatível com o SISCOAF.

### **Para quem é?**
Para cartórios que utilizam o Escriba Register e ainda não tem outra forma de enviar os registros para o SISCOAF senão pela interface do próprio SISCOAF, que, dependendo da quantidade de pessoas relacionadas, pode ser muito trabalhoso.

### **Por que?**
No momento em que este sistema está sendo desenvolvido, não há uma ferramenta no Escriba Register que auxilie no envio desses registros ao SISCOAF.

### **Quais as limitações?**
Este sistema foi pensado para ser extremamente simples, deve apenas relacionar as pessoas que constam no protocolo indicado e permitir gerar um XML que possa ser enviado ao SISCOAF. Nada mais!

### **Como instalar?**
Este projeto depende de:
  * Node JS v12.16;
  * Yarn v1.24;
  * React JS v16.13.

Uma vez satisfeitos esses requisitos, clone o repositório e siga com a instalação:
  - Na raiz do projeto execute: yarn install;
  - Na pasta "client" execute: yarn install && yarn build;
  - De volta à pasta raiz, crie o arquivo ".env" e forneça as variáveis necessárias;
  - Então, execute: yarn start.

Após esses passos o projeto deve estar funcionando!

### **Como instalar com Docker?**
  - Baixe os arquivos "Dockerfile" e "docker-compose.yml" para uma pastas;
  - Crie o arquivo ".env" com as variáveis necessárias;
  - Execute "docker-compose up".

Após esses passos o projeto deve estar funcionando!

### **Arquivo .env**
Esse arquivo deve ficar na raiz do diretório, juntos aos arquivos do docker e do "package.json".

Seu conteúdo deve informar:
  - **MYSQL_HOST**: o hostname ou IP do servidor do Escriba Register, onde serão feitas as consultas;
  - **MYSQL_PORT**: a porta do banco de dados;
  - **MYSQL_USER**: o usuário do banco de dados;
  - **MYSQL_PASSWORD**: a senha do banco de dados;
  - **MYSQL_DB**: qual bando de dados utilizar (geralmente é o sqlreg3);
  - **NODE_ENV**: informar o modo de execução do backend (developmente ou production). Se não for informado, subtende-se que é dev. Caso seja executado o comando "yarn start" essa opção será sobrescrita para "production";
  - **BACKEND_PORT**: a porta que o serviço utilizará. Ao iniciar o sistema em modo de produção seu acesso se dará por esta porta (Ex.: http://meu.host:8099). Obs.: em modo de desenvolvimento, o frontend vai ser executado pelos "react scripts", na porta "3000";
  - **APP_DEFAULT_CITY**: a cidade para autopreenchimento do formulário;
  - **APP_DEFAULT_STATE**: a sigla do estado/UF para autopreenchimento do formulário;
  - **APP_DEFAULT_NOTIFIERID**: o CPF ou CNPJ da pessoa cadastrada ao SISCOAF.