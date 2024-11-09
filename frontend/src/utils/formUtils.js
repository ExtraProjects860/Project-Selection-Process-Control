
export const validateForm = (formData) => {
  const { email, password, cpf, phone, birthdate } = formData;

  // Validação do email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'E-mail inválido. Certifique-se de que contém "@" e um domínio.';
  }

  // Validação da senha
 
if(password) {
    if (password.length < 8 || password.length > 16) {
      return 'A senha deve ter no mínimo 8 e no máximo 16 caracteres, conter pelo menos uma letra, um número e um caracter especial.';
    }
    

    if (!/[a-zA-Z]/.test(password)) {
      return 'A senha deve conter pelo menos uma letra.';
    }
  

    if (!/[0-9]/.test(password)) {
      return 'A senha deve conter pelo menos um número.';
    }
  
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'A senha deve conter pelo menos um caractere especial.';
    }
  }
  

    if (cpf) {
  const isValidCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false;
    }
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    return remainder === parseInt(cpf.substring(10, 11));
  };


  if (!isValidCPF(cpf)) {
    return 'CPF inválido.';
  }
}


  const phonePattern = /^\(?\d{2}\)? ?\d{5}-?\d{4}$/; // Ex: (11) 91234-5678 ou 11912345678
  if (!phonePattern.test(phone)) {
    return 'Telefone inválido. Deve conter DDD e 9 dígitos.';
  }

if(birthdate) {
  const birthDate = new Date(birthdate);
  const today = new Date();
  if (birthDate > today) {
    return 'A data de nascimento não pode ser uma data futura.';
  }

  return null; 
};

}

export const handleErrorResponse = (error) => {
  if (error.response) {
    return error.response.data.message || 'Ocorreu um erro durante a solicitação.';
  } else if (error.request) {
    return 'Nenhuma resposta recebida do servidor.';
  } else {
    return 'Erro ao configurar a requisição: ' + error.message;
  }
};
