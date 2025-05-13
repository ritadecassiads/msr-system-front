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
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  convertToDate(dateString: string): Date {
  const cleanedDate = dateString.replace(/\//g, '');

  if (cleanedDate.length === 8) {
    const day = parseInt(cleanedDate.substring(0, 2), 10);
    const month = parseInt(cleanedDate.substring(2, 4), 10) - 1; // Meses começam do 0
    const year = parseInt(cleanedDate.substring(4, 8), 10);

    return new Date(year, month, day);
  } else {
    throw new Error('Formato de data inválido');
  }
}

  formatCpf(value: string): string {
    let cpf = value.replace(/\D/g, '');
    
    if (cpf.length > 11) {
      cpf = cpf.slice(0, 11);
    }
    
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

  isCpfValid(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    console.log("cpf", cpf);

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    console.log("false", cpf);

      return false;
    }

    let sum: number;
    let remainder: number;

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

  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
  
    if (cleaned.length === 11) {
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
  
    return phone;
  }
}
