from pydantic import BaseModel, Field, field_validator
from typing import Optional


class AlunoInputDTO(BaseModel):
    nome: str = Field(..., description="Nome do aluno")
    nivel: str = Field(..., description="Nível de proficiência")
    idade: Optional[int] = Field(
        None, description="Idade (opcional, deve ser número positivo)"
    )

    @field_validator("nome")
    @classmethod
    def validar_nome(cls, valor: str) -> str:
        if not valor or not valor.strip():
            raise ValueError("O nome é obrigatório")
        return valor.strip()

    @field_validator("nivel")
    @classmethod
    def validar_nivel(cls, valor: str) -> str:
        niveis_validos = {"A1", "A2", "B1", "B2", "C1"}
        if valor not in niveis_validos:
            raise ValueError("Nível inválido. Use A1, A2, B1, B2 ou C1")
        return valor

    @field_validator("idade")
    @classmethod
    def validar_idade(cls, valor: Optional[int]) -> Optional[int]:
        if valor is not None and valor <= 0:
            raise ValueError("Idade deve ser um número positivo")
        return valor
