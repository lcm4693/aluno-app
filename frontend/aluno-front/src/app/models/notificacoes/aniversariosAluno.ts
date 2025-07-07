export class AniversarioAluno {
  constructor(
    public idNotificacao: number,
    public lida: Boolean,
    public nomeAluno: string,
    public idAluno: number,
    public dataAniversario: Date,
    public mensagem: string
  ) {}
}
