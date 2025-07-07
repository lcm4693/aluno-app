export class AulaSemAnotacao {
  constructor(
    public idNotificacao: number,
    public nomeAluno: string,
    public idAluno: number,
    public dataAula: Date,
    public idAula: number,
    public mensagem: string,
    public lida: Boolean
  ) {}
}
