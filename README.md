# ⚡ FocusLearn — Plataforma de Estudos com Modo Foco

Plataforma web de estudos com foco em pessoas que têm dificuldade de manter a concentração. Feita com HTML, CSS e JavaScript puros — sem frameworks, sem dependências externas.

---

## 🚀 Como usar

### Opção 1 — Abrir direto no navegador
Basta abrir o arquivo `index.html` no navegador. Funciona offline.

### Opção 2 — Publicar no GitHub Pages
1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Vá em **Settings → Pages → Source: main branch / root**
4. Acesse `https://seu-usuario.github.io/nome-do-repo`

---

## 📁 Estrutura de arquivos

```
focuslearn/
├── index.html              # Página principal
├── css/
│   ├── reset.css           # Normalização base
│   ├── variables.css       # Tokens de design (cores, espaços)
│   ├── layout.css          # Estrutura das telas + botões globais
│   ├── home.css            # Tela inicial (hero, cards, etc.)
│   ├── sidebar.css         # Menu lateral de aulas
│   ├── player.css          # Área de reprodução
│   ├── focus.css           # Overlay do Modo Foco
│   └── modals.css          # Modais (parabéns, demo, etc.)
├── js/
│   ├── data.js             # ← EDITE AQUI para adicionar cursos
│   ├── app.js              # Estado global + utilitários
│   ├── player.js           # Sidebar, aulas, progresso
│   ├── focus.js            # Cronômetro e modo foco
│   └── home.js             # Interações da home
└── README.md
```

---

## ➕ Como adicionar cursos

Edite o arquivo `js/data.js`. Cada curso segue este modelo:

```javascript
{
  id: "meu-curso",                    // ID único (sem espaços)
  title: "Nome do Curso",
  description: "Descrição curta.",
  tag: "Categoria",
  tagColor: "#6366F1",               // Cor do texto da tag
  tagBg: "#EEF2FF",                  // Fundo da tag
  thumbColor: "linear-gradient(135deg, #6366F1, #A855F7)", // Gradiente do card
  thumbIcon: "🌐",                   // Emoji do card
  modules: [
    {
      id: "modulo-1",
      title: "Nome do Módulo",
      lessons: [
        {
          id: "aula-unica-01",        // ID único
          code: "0101",               // Código exibido (ex: 0101)
          title: "Título da Aula",
          duration: "08:30",          // Duração (exibição apenas)
          youtubeId: "dQw4w9WgXcQ",  // ID do vídeo no YouTube
          description: "Descrição da aula."
        }
      ]
    }
  ]
}
```

### Como obter o `youtubeId`
- URL: `https://www.youtube.com/watch?v=XXXXXXXXX`
- O `youtubeId` é o trecho após `v=` → `XXXXXXXXX`

---

## 🎨 Como mudar as cores

Edite o arquivo `css/variables.css`. As principais variáveis:

| Variável | Descrição |
|---|---|
| `--accent` | Cor principal (índigo) |
| `--success` | Cor de progresso (verde) |
| `--sidebar-bg` | Fundo da sidebar |
| `--bg-primary` | Fundo principal |
| `--text-primary` | Cor do texto |

---

## ✨ Funcionalidades

- [x] Tela inicial com cursos e estatísticas
- [x] Player com sidebar de aulas por módulo
- [x] Marcar/desmarcar aulas como concluídas (sidebar + botão abaixo do vídeo)
- [x] Barra de progresso geral do curso
- [x] **Modo Foco Intenso** — bloqueia a tela com cronômetro
- [x] Presets de tempo (25 / 45 / 60 min)
- [x] Aviso ao tentar mudar de aba durante o foco
- [x] Beep ao fim do cronômetro
- [x] Anotações por aula (sessão atual)
- [x] Modal de parabéns ao concluir aulas
- [x] Sidebar recolhível
- [x] Responsivo (mobile)
- [x] Cards de cursos com progresso visual

---

## 🔧 Tecnologias

- **HTML5** semântico
- **CSS3** com variáveis customizadas
- **JavaScript** ES6+ (sem frameworks)
- **Google Fonts** — Inter + Sora
- **YouTube Embed API** para vídeos
- **Web Audio API** para beep de fim de sessão

---

Feito com foco. Para quem precisa de foco. ⚡
