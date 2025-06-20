# 🧑‍🏫 AlunoApp

![Deploy Frontend](https://github.com/lcm4693/aluno-app/actions/workflows/deploy-frontend.yml/badge.svg)
![Deploy Backend](https://github.com/lcm4693/aluno-app/actions/workflows/deploy-backend.yml/badge.svg)
![Deploy Completo](https://github.com/lcm4693/aluno-app/actions/workflows/deploy-full.yml/badge.svg)

**AlunoApp** é um sistema para professores de português registrarem e organizarem informações sobre alunos estrangeiros de forma prática.  
Com ele, você pode cadastrar alunos, acompanhar suas aulas, anotações, níveis de idioma, fotos e mais.

---

## ⚙️ Tecnologias

- 🔥 **Frontend:** Angular 17 (standalone, PrimeNG, PrimeFlex)
- 🐍 **Backend:** Python (Flask + SQLite)
- 🧠 **Validação:** Pydantic
- ☁️ **Deploy:** AWS (EC2, S3, Route 53)
- ⚙️ **CI/CD:** GitHub Actions

---

## 📁 Estrutura de Pastas

```
aluno-app/
├── .github/           # Workflows do GitHub Actions
├── api/
│   └── alunos-app/    # Backend Flask
├── frontend/
│   └── aluno-front/   # Frontend Angular
├── .gitignore
└── README.md
```

---

## 🚀 Como Rodar o Projeto Localmente

### 🔸 Frontend (Angular)

```bash
cd frontend/aluno-front
npm install
ng serve
```

> Acesse: [http://localhost:4200](http://localhost:4200)

---

### 🔸 Backend (Flask)

```bash
cd api/alunos-app
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
python app.py
```

---

## ✨ Funcionalidades

- ✅ Cadastro e visualização de alunos
- 📆 Registro de aulas, observações e pontuações
- 🖼️ Upload e visualização de fotos
- 🔄 Alternância entre modo visualização e edição
- 🧠 UX otimizada com tooltips e ícones

---

## 📸 Imagens do sistema (em breve)

<!-- Você pode adicionar prints ou GIFs aqui -->
<!-- Exemplo:
![Tela de Aluno](docs/screenshot-aluno.png)
-->

---

## 📌 TODO / Melhorias Futuras

- 🔄 Filtro de alunos por idioma
- 📊 Painel estatístico de evolução
- 🗃️ Integração com bancos de dados externos (Mongo, PostgreSQL)
