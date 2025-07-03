export class UltimasAulas {
  constructor(
    public idAula: number,
    public idAluno: number,
    public nomeAluno: string,
    public fotoUrl: string,
    public dataAula: Date,
    public totalAulas: number
  ) {}
}
