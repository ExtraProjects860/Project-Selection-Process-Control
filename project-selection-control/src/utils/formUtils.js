
export const validateForm = (formData) => {
  const { email, password, cpf, phone, birthdate } = formData;

  // Validação do email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'E-mail inválido. Certifique-se de que contém "@" e um domínio.';
  }

  // Validação da senha
 
    // Verifica o comprimento da senha
    if (password.length < 8 || password.length > 16) {
      return 'A senha deve ter no mínimo 8 e no máximo 16 caracteres, conter pelo menos uma letra, um número e um caracter especial.';
    }
    
    // Verifica se a senha contém pelo menos uma letra
    if (!/[a-zA-Z]/.test(password)) {
      return 'A senha deve conter pelo menos uma letra.';
    }
  
    // Verifica se a senha contém pelo menos um número
    if (!/[0-9]/.test(password)) {
      return 'A senha deve conter pelo menos um número.';
    }
  
    // Verifica se a senha contém pelo menos um caractere especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'A senha deve conter pelo menos um caractere especial.';
    }
  

  // Validação do CPF (pode ser melhorada com uma biblioteca específica)
  const isValidCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    // Lógica básica de validação do CPF
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

  // Validação do telefone
  const phonePattern = /^\(?\d{2}\)? ?\d{5}-?\d{4}$/; // Ex: (11) 91234-5678 ou 11912345678
  if (!phonePattern.test(phone)) {
    return 'Telefone inválido. Deve conter DDD e 9 dígitos.';
  }

  // Validação da data de nascimento
  const birthDate = new Date(birthdate);
  const today = new Date();
  if (birthDate > today) {
    return 'A data de nascimento não pode ser uma data futura.';
  }

  return null; // Se todas as validações passarem, retorne null
};

export const handleErrorResponse = (error) => {
  if (error.response) {
    // O servidor respondeu com um status diferente de 2xx
    return error.response.data.message || 'Ocorreu um erro durante a solicitação.';
  } else if (error.request) {
    // A requisição foi feita, mas não houve resposta
    return 'Nenhuma resposta recebida do servidor.';
  } else {
    // Algum erro ocorreu ao configurar a requisição
    return 'Erro ao configurar a requisição: ' + error.message;
  }
};
