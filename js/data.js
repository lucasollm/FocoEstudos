/* ============================================================
   data.js — Dados dos cursos e aulas
   
   COMO ADICIONAR UM CURSO:
   1. Copie o modelo abaixo
   2. Preencha id, title, description, tag, color, icon
   3. Adicione módulos com suas aulas
   4. Cada aula tem: id, code, title, duration, youtubeId, description
   
   COMO OBTER O youtubeId:
   - URL: https://www.youtube.com/watch?v=XXXXXXXX
   - youtubeId é o "XXXXXXXX" após "v="
============================================================ */

const COURSES_DATA = [
  {
    id: "html-css",
    title: "HTML e CSS para Iniciantes",
    description: "Aprenda a base da web do zero. Estruture páginas com HTML e estilize com CSS.",
    tag: "HTML · CSS",
    tagColor: "#6366F1",
    tagBg: "#EEF2FF",
    thumbColor: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
    thumbIcon: "🌐",
    modules: [
      {
        id: "mod-01",
        title: "Introdução",
        lessons: [
          {
            id: "html-01-01",
            code: "0101",
            title: "O que é HTML?",
            duration: "08:41",
            youtubeId: "SV7TL0hxmIQ",
            description: "Nesta aula você vai entender o que é HTML, para que serve e qual o seu papel na construção de páginas web."
          },
          {
            id: "html-01-02",
            code: "0102",
            title: "HTML, CSS e JavaScript",
            duration: "05:59",
            youtubeId: "SV7TL0hxmIQ",
            description: "Entenda a diferença entre as três linguagens principais da web e como elas trabalham juntas."
          }
        ]
      },
      {
        id: "mod-02",
        title: "HTML Básico",
        lessons: [
          {
            id: "html-02-01",
            code: "0201",
            title: "Tags HTML",
            duration: "08:04",
            youtubeId: "SV7TL0hxmIQ",
            description: "As tags são os blocos construtores do HTML. Aprenda as principais tags e como usá-las."
          },
          {
            id: "html-02-02",
            code: "0202",
            title: "Estrutura de um Documento",
            duration: "04:34",
            youtubeId: "SV7TL0hxmIQ",
            description: "Todo documento HTML segue uma estrutura padrão. Veja como montar a base de qualquer página."
          },
          {
            id: "html-02-03",
            code: "0203",
            title: "Listas e Links",
            duration: "07:20",
            youtubeId: "SV7TL0hxmIQ",
            description: "Crie listas ordenadas, não ordenadas e links para navegar entre páginas."
          }
        ]
      },
      {
        id: "mod-03",
        title: "CSS Básico",
        lessons: [
          {
            id: "html-03-01",
            code: "0301",
            title: "Introdução ao CSS",
            duration: "06:52",
            youtubeId: "SV7TL0hxmIQ",
            description: "O CSS é responsável pela aparência das páginas. Aprenda a conectar o CSS ao HTML."
          },
          {
            id: "html-03-02",
            code: "0302",
            title: "Seletores CSS",
            duration: "11:16",
            youtubeId: "SV7TL0hxmIQ",
            description: "Seletores permitem você escolher quais elementos estilizar. Aprenda os mais usados."
          },
          {
            id: "html-03-03",
            code: "0303",
            title: "Box Model",
            duration: "10:44",
            youtubeId: "SV7TL0hxmIQ",
            description: "O Box Model é fundamental para entender como os elementos ocupam espaço na tela."
          }
        ]
      }
    ]
  },
  {
    id: "javascript",
    title: "JavaScript para Iniciantes",
    description: "Torne suas páginas interativas com JavaScript. Do básico ao DOM manipulation.",
    tag: "JavaScript",
    tagColor: "#D97706",
    tagBg: "#FEF3C7",
    thumbColor: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    thumbIcon: "⚡",
    modules: [
      {
        id: "js-mod-01",
        title: "Fundamentos",
        lessons: [
          {
            id: "js-01-01",
            code: "0101",
            title: "O que é JavaScript?",
            duration: "09:12",
            youtubeId: "i6Oi-YtXnAU",
            description: "Introdução ao JavaScript: o que é, para que serve e como ele se encaixa no desenvolvimento web."
          },
          {
            id: "js-01-02",
            code: "0102",
            title: "Variáveis e Tipos",
            duration: "12:05",
            youtubeId: "i6Oi-YtXnAU",
            description: "Aprenda a declarar variáveis com var, let e const e conheça os tipos de dados em JavaScript."
          },
          {
            id: "js-01-03",
            code: "0103",
            title: "Funções",
            duration: "15:30",
            youtubeId: "i6Oi-YtXnAU",
            description: "Funções são blocos reutilizáveis de código. Aprenda a criar e chamar funções no JavaScript."
          }
        ]
      },
      {
        id: "js-mod-02",
        title: "DOM e Eventos",
        lessons: [
          {
            id: "js-02-01",
            code: "0201",
            title: "O que é o DOM?",
            duration: "08:45",
            youtubeId: "i6Oi-YtXnAU",
            description: "O DOM (Document Object Model) permite que o JavaScript interaja com os elementos da página."
          },
          {
            id: "js-02-02",
            code: "0202",
            title: "Eventos",
            duration: "13:20",
            youtubeId: "i6Oi-YtXnAU",
            description: "Eventos permitem reagir a ações do usuário, como cliques e pressionamentos de tecla."
          }
        ]
      }
    ]
  },
  {
    id: "design-ui",
    title: "UI Design para Iniciantes",
    description: "Aprenda os princípios de design de interfaces. Do conceito ao protótipo no Figma.",
    tag: "Design",
    tagColor: "#059669",
    tagBg: "#D1FAE5",
    thumbColor: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
    thumbIcon: "🎨",
    modules: [
      {
        id: "ui-mod-01",
        title: "Princípios de Design",
        lessons: [
          {
            id: "ui-01-01",
            code: "0101",
            title: "O que é UI Design?",
            duration: "07:30",
            youtubeId: "dU7T0kPl31s",
            description: "Entenda o que é UI Design, qual a diferença com UX e por que é importante aprender."
          },
          {
            id: "ui-01-02",
            code: "0102",
            title: "Tipografia",
            duration: "11:15",
            youtubeId: "dU7T0kPl31s",
            description: "A escolha da tipografia impacta diretamente a leitura e sensação de uma interface."
          },
          {
            id: "ui-01-03",
            code: "0103",
            title: "Cores e Paletas",
            duration: "13:40",
            youtubeId: "dU7T0kPl31s",
            description: "Como escolher cores que funcionam bem juntas e transmitem a mensagem certa."
          }
        ]
      },
      {
        id: "ui-mod-02",
        title: "Ferramentas",
        lessons: [
          {
            id: "ui-02-01",
            code: "0201",
            title: "Introdução ao Figma",
            duration: "18:00",
            youtubeId: "dU7T0kPl31s",
            description: "O Figma é a principal ferramenta de design de interfaces. Veja como começar."
          }
        ]
      }
    ]
  }
];

/* ── Helper: achatar todas as aulas de um curso ─── */
function getAllLessons(course) {
  return course.modules.flatMap(m => m.lessons);
}

/* ── Helper: contar total de aulas ─────────────── */
function countLessons(course) {
  return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
}
