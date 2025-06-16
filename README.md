# AlunoApp

Sistema de gerenciamento de alunos estrangeiros em aulas de português.  
Organize informações pessoais, registre aulas, anotações, níveis de idioma e muito mais.

---

## 🧩 Tecnologias

- 🔥 **Frontend**: Angular 17 (standalone, PrimeNG, PrimeFlex)
- 🐍 **Backend**: Python (Flask + SQLite)
- 🧠 **Validação**: Pydantic
- ☁️ Preparado para deploy AWS (EC2, S3, Route 53)
- 📦 CI/CD planejado com GitLab

---

## 📁 Estrutura

aluno-app/
├── frontend/ # Aplicação Angular
├── backend/ # API Flask
├── .gitignore
└── README.md

---

## 🚀 Como rodar o projeto

### 🔥 Frontend (Angular)

```bash
cd frontend
npm install
ng serve

Acesse: http://localhost:4200
```

### 🐍 Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
python app.py
```

## Funcionalidades

- Cadastro e visualização de alunos

- Registro de aulas, observações e pontuações

- Upload de fotos

- Alternância entre modo de visualização e edição

- Tooltips, ícones, UX otimizada para professores
