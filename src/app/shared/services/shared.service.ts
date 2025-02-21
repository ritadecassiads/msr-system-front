import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})

export class SharedService {
  private username: string = "";

  setUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  formatDate(dateString: Date): string {
    console.log("dateString: ", dateString);
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    console.log("date: ", `${day}/${month}/${year}`);
    return `${day}/${month}/${year}`;
  }

  formatCpf(value: string): string {
    // Remove qualquer caractere não numérico
    let cpf = value.replace(/\D/g, '');
    
    // Limita o número de caracteres a 11
    if (cpf.length > 11) {
      cpf = cpf.slice(0, 11);
    }
    
    // Formata o CPF com pontos e hífen
    if (cpf.length <= 3) {
      return cpf;
    }
    if (cpf.length <= 6) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}`;
    }
    if (cpf.length <= 9) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}`;
    }
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  }

  validateCpf(cpf: string): boolean {
    // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');

    // Validações iniciais
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let sum: number;
    let remainder: number;

    // Verificação do primeiro dígito verificador
    sum = 0;
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

    // Verificação do segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return false;
    }

    return true;
  }
}
