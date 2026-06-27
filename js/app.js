/* ============================================================
   app.js — Estado global e funções utilitárias
============================================================ */

/* ── Estado da sessão ───────────────────────────────────── */
const AppState = {
  currentCourse: null,       // objeto do curso ativo
  currentLessonId: null,     // id da aula aberta
  completedLessons: {},      // { courseId: Set<lessonId> }
  notes: {},                 // { lessonId: string }
  sidebarOpen: true,
};

/* ── Inicialização ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderHomeStats();
  renderCourseCards();
  setupVisibilityWatcher(); // definido em focus.js
});

/* ── Navegação entre telas ──────────────────────────────── */
function goHome() {
  document.getElementById('player-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
  exitFocusMode();
  renderCourseCards(); // atualiza progresso dos cards
}

function openCourse(courseId) {
  const course = COURSES_DATA.find(c => c.id === courseId);
  if (!course) return;

  AppState.currentCourse = course;
  if (!AppState.completedLessons[courseId]) {
    AppState.completedLessons[courseId] = new Set();
  }

  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('player-screen').classList.remove('hidden');

  // Configura sidebar
  document.getElementById('sidebar-course-title').textContent = course.title;

  renderSidebar(course);
  updateProgress(course);

  // Abre a primeira aula (ou a última acessada)
  const allLessons = getAllLessons(course);
  if (allLessons.length > 0) {
    openLesson(allLessons[0].id);
  }
}

/* ── Scroll helper ──────────────────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ── Toast ──────────────────────────────────────────────── */
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, duration);
}

/* ── Modais ─────────────────────────────────────────────── */
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function openDemo() {
  openModal('modal-demo');
}

/* ── Sidebar toggle ─────────────────────────────────────── */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  AppState.sidebarOpen = !AppState.sidebarOpen;
  sidebar.classList.toggle('collapsed', !AppState.sidebarOpen);
}

/* ── Atualiza barra de progresso ────────────────────────── */
function updateProgress(course) {
  if (!course) return;
  const done = (AppState.completedLessons[course.id] || new Set()).size;
  const total = countLessons(course);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById('progress-percent').textContent = pct + '%';
  document.getElementById('progress-bar-fill').style.width = pct + '%';
  document.getElementById('progress-count').textContent =
    `${done} de ${total} aula${total !== 1 ? 's' : ''} concluída${done !== 1 ? 's' : ''}`;
}

/* ── Stats da home ──────────────────────────────────────── */
function renderHomeStats() {
  const totalCursos = COURSES_DATA.length;
  const totalAulas = COURSES_DATA.reduce((acc, c) => acc + countLessons(c), 0);

  animateCount('stat-cursos', totalCursos);
  animateCount('stat-aulas', totalAulas);
}

function animateCount(elId, target) {
  const el = document.getElementById(elId);
  let current = 0;
  const step = Math.ceil(target / 30);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 40);
}

/* ── Notas ──────────────────────────────────────────────── */
function saveNotes() {
  const lessonId = AppState.currentLessonId;
  if (!lessonId) return;
  const text = document.getElementById('lesson-notes-input').value;
  AppState.notes[lessonId] = text;
  showToast('✅ Anotação salva!');
}

function loadNotes(lessonId) {
  document.getElementById('lesson-notes-input').value =
    AppState.notes[lessonId] || '';
}
