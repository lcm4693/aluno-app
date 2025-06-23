import { Aluno } from './aluno';

interface AulaProps {
  id?: number;
  dataAula: Date;
  anotacoes: string;
  comentarios?: string;
  proximaAula?: string;
  aluno?: Aluno;
}

export class Aula {
  constructor(public props: AulaProps) {}

  get id() {
    return this.props.id;
  }

  get dataAula() {
    return this.props.dataAula;
  }

  set dataAula(dataAula) {
    this.props.dataAula = dataAula;
  }

  get anotacoes() {
    return this.props.anotacoes;
  }

  set anotacoes(anotacoes) {
    this.props.anotacoes = anotacoes;
  }

  get comentarios() {
    return this.props.comentarios;
  }

  set comentarios(comentarios) {
    this.props.comentarios = comentarios;
  }

  get proximaAula() {
    return this.props.proximaAula;
  }

  set proximaAula(proximaAula) {
    this.props.proximaAula = proximaAula;
  }

  get aluno() {
    return this.props.aluno;
  }

  set aluno(aluno) {
    this.props.aluno = aluno;
  }
  get objeto() {
    return this.props;
  }
}
