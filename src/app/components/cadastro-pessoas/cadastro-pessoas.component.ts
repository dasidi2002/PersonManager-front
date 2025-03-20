import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroPessoasService, LegalPersonRequest, NaturalPersonRequest, Person } from './cadastro-pessoas.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { CadastroPessoasDetalheComponent } from './cadastro-pessoas-detalhe/cadastro-pessoas-detalhe.component';

@Component({
  selector: 'app-cadastro-pessoas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    InputMaskModule,
    InputSwitchModule,
    ToastModule,
    ConfirmDialogModule,
    BadgeModule,
    SelectButtonModule,
    HttpClientModule,
    CadastroPessoasDetalheComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cadastro-pessoas.component.html',
  styleUrl: './cadastro-pessoas.component.css'
})
export class CadastroPessoasComponent implements OnInit {
  persons: Person[] = [];
  personDialog: boolean = false;
  person: any = {};
  originalPerson: any = {}; // Para armazenar os dados originais ao editar
  submitted: boolean = false;
  isPersonTypeJuridica: boolean = false;

  personTypeOptions = [
    { label: 'Física', value: false },
    { label: 'Jurídica', value: true }
  ];

  constructor(
    private pessoasService: CadastroPessoasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.pessoasService.getPersons().subscribe({
      next: (data) => {
        this.persons = data;
        if (data.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Informação', detail: 'Nenhum registro encontrado', life: 3000 });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao carregar pessoas: ${error.message || 'Erro desconhecido'}`,
          life: 5000
        });
        console.error('Erro detalhado ao carregar pessoas:', error);
      }
    });
  }

  openNew() {
    this.person = {};
    this.originalPerson = {};
    this.isPersonTypeJuridica = false;
    this.submitted = false;
    this.personDialog = true;
  }

  deletePersonConfirm(person: Person) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir ' + person.name + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePerson(person.id);
      }
    });
  }

  deletePerson(id: number) {
    this.pessoasService.deletePerson(id).subscribe({
      next: () => {
        this.persons = this.persons.filter(val => val.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pessoa excluída', life: 3000 });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir pessoa', life: 3000 });
        console.error('Erro ao excluir pessoa:', error);
      }
    });
  }

  editPerson(person: Person) {
    // Cria uma cópia dos dados originais para comparação posterior
    this.originalPerson = { ...person };
    this.person = { ...person };
    this.isPersonTypeJuridica = person.personType === 1;

    // Garantir que o zipCode seja acessível diretamente no objeto person
    if (person.address && person.address.zipCode) {
      this.person.zipCode = person.address.zipCode;
      this.originalPerson.zipCode = person.address.zipCode;
    }

    this.personDialog = true;
  }

  hideDialog() {
    this.personDialog = false;
    this.submitted = false;
  }

  savePerson() {
    this.submitted = true;

    if (!this.person.id) {
      if (!this.validateRequiredFields()) {
        return;
      }
    } else {
      if (!this.checkIfPersonChanged()) {
        this.messageService.add({
          severity: 'info',
          summary: 'Informação',
          detail: 'Nenhum campo foi alterado',
          life: 3000
        });
        return;
      }
    }

    if (this.isPersonTypeJuridica) {
      this.saveJuridicalPerson();
    } else {
      this.saveNaturalPerson();
    }
  }

  validateRequiredFields(): boolean {
    if (!this.person.name?.trim()) {
      return false;
    }

    if (!this.person.documentNumber?.trim()) {
      return false;
    }

    if (this.isPersonTypeJuridica && !this.person.companyName?.trim()) {
      return false;
    }

    if (!this.isPersonTypeJuridica && !this.person.birthDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Data de nascimento é obrigatória para pessoa física',
        life: 3000
      });
      return false;
    }

    

    return true;
  }

  saveJuridicalPerson(): void {
    const legalPerson: LegalPersonRequest = {
      name: this.person.name || '',
      documentNumber: this.person.documentNumber || '',
      zipCode: this.person.zipCode || '',
      companyName: this.person.companyName || ''
    };

    if (this.person.id) {
      // Atualização
      this.pessoasService.updateLegalPerson(this.person.id, legalPerson).subscribe({
        next: () => this.handleSuccess('Pessoa jurídica atualizada'),
        error: (error) => this.handleError('Erro ao atualizar pessoa jurídica', error)
      });
    } else {
      // Criação
      this.pessoasService.createLegalPerson(legalPerson).subscribe({
        next: () => this.handleSuccess('Pessoa jurídica criada'),
        error: (error) => this.handleError('Erro ao criar pessoa jurídica', error)
      });
    }
  }

  saveNaturalPerson(): void {
    const naturalPerson: NaturalPersonRequest = {
      name: this.person.name || '',
      documentNumber: this.person.documentNumber || '',
      zipCode: this.person.zipCode || '',
      birthDate: this.person.birthDate || null
    };

    if (this.person.id) {
      // Atualização
      this.pessoasService.updateNaturalPerson(this.person.id, naturalPerson).subscribe({
        next: () => this.handleSuccess('Pessoa física atualizada'),
        error: (error) => this.handleError('Erro ao atualizar pessoa física', error)
      });
    } else {
      // Criação
      this.pessoasService.createNaturalPerson(naturalPerson).subscribe({
        next: () => this.handleSuccess('Pessoa física criada'),
        error: (error) => this.handleError('Erro ao criar pessoa física', error)
      });
    }
  }

  checkIfPersonChanged(): boolean {
    if (this.person.name !== this.originalPerson.name) return true;
    if (this.person.documentNumber !== this.originalPerson.documentNumber) return true;
    if (this.person.zipCode !== this.originalPerson.zipCode) return true;

    if (this.isPersonTypeJuridica) {
      if (this.person.companyName !== this.originalPerson.companyName) return true;
    } else {
      const originalDate = this.originalPerson.birthDate ? new Date(this.originalPerson.birthDate) : null;
      const currentDate = this.person.birthDate ? new Date(this.person.birthDate) : null;

      if (originalDate && currentDate) {
        if (originalDate.toDateString() !== currentDate.toDateString()) return true;
      } else if (originalDate !== currentDate) {
        return true;
      }
    }

    return false;
  }

  handleSuccess(detail: string) {
    this.personDialog = false;
    this.loadPersons();
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail, life: 3000 });
  }

  handleError(detail: string, error: any) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail, life: 3000 });
    console.error(detail, error);
  }

  getPersonTypeLabel(personType: number): string {
    return personType === 1 ? 'Jurídica' : 'Física';
  }
}
