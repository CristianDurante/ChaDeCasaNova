# Chá de Casa Nova

Landing page responsiva para receber contribuições por Pix em um convite digital de chá de casa nova.

## Como usar localmente

1. Abra o projeto na raiz.
2. Execute:
   - `python -m http.server 3000`
3. Acesse `http://localhost:3000`.

## Configuração do Pix

Edite o arquivo `js/config.js` e preencha:

- `coupleNames`
- `washingMachineImage`
- `pix.receiverName`
- `pix.pixKey`
- `pix.city`
- `pix.amount` (opcional)

## Deploy na Vercel

1. Envie esse projeto para um repositório GitHub.
2. Importe o repositório na Vercel.
3. Use a configuração padrão de projeto estático.
4. Publique a aplicação.

A página já está pronta para funcionar como site estático sem build step.
