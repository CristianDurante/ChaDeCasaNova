const SITE_CONFIG = {
  // Nome do casal. Exemplo: "Ana e Pedro"
  coupleNames: "",

  // Caminho da foto da maquina de lavar. Troque pelo arquivo em images/.
  washingMachineImage: "images/placeholder-maquina.svg",

  pix: {
    // Nome do recebedor no Pix (max. 25 caracteres, sem acentos no QR)
    receiverName: "",
    // Chave Pix (e-mail, telefone, CPF, CNPJ ou chave aleatória)
    pixKey: "",
    // Cidade do recebedor (necessaria para o BR Code)
    city: "",
    // Valor opcional no formato 150.00. Deixe vazio para o convidado escolher.
    amount: ""
  }
};
