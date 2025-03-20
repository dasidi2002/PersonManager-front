import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Person {
  id: number;
  name: string;
  documentNumber: string;
  address: Address;
  personType: number;
  birthDate: string | null;
  companyName: string | null;
}

export interface NaturalPersonRequest {
  name: string;
  documentNumber: string;
  zipCode: string;
  birthDate: string;
}

export interface LegalPersonRequest {
  name: string;
  documentNumber: string;
  zipCode: string;
  companyName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CadastroPessoasService {
  private baseUrl = 'https://localhost:7059/api/Persons';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na API:', error);

    let errorMessage = 'Ocorreu um erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  getPersons(): Observable<Person[]> {
    console.log('Fazendo requisição GET para:', this.baseUrl);
    return this.http.get<Person[]>(this.baseUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  createNaturalPerson(person: NaturalPersonRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/natural`, person, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  createLegalPerson(person: LegalPersonRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/legal`, person, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateNaturalPerson(id: number, person: NaturalPersonRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/natural/${id}`, person, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLegalPerson(id: number, person: LegalPersonRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/legal/${id}`, person, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
