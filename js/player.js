/* ============================================================
   player.js — Lógica do player + YouTube IFrame API
============================================================ */

/* ── YouTube IFrame API ─────────────────────────────────── */
let ytPlayer = null;
let ytReady = false;
let pendingVideoId = null;

// Callback obrigatório da YouTube IFrame API
function onYouTubeIframeAPIReady() {
  ytReady = true;
  if (pendingVideoId) {
    loadYTVideo(pendingVideoId);
    pendingVideoId = null;
  }
}

function loadYTVideo(videoId) {
  if (!ytReady) {
    pendingVideoId = videoId;
    return;
  }

  const placeholder = document.getElementById('video-placeholder');
  if (placeholder) placeholder.classList.add('hidden');

  if (ytPlayer) {
    ytPlayer.loadVideoById(videoId);
    return;
  }

  // Cria o player pela primeira vez
  ytPlayer = new YT.Player('youtube-player', {
    videoId,
    playerVars: {
      rel: 0,
      modestbranding: 1,
      autoplay: 1,
    },
    events: {
      onReady: (e) => e.target.playVideo(),
      onError: () => {
        if (placeholder) placeholder.classList.remove('hidden');
      },
    },
  });
}

function ytPause() {
  try { if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo(); } catch(e) {}
}

function ytPlay() {
  try { if (ytPlayer && ytPlayer.playVideo) ytPlayer.playVideo(); } catch(e) {}
}

/* ── Renderiza sidebar com módulos e aulas ──────────────── */
function renderSidebar(course) {
  const list = document.getElementById('sidebar-list');
  list.innerHTML = '';

  course.modules.forEach((mod, mIdx) => {
    const group = document.createElement('div');
    group.className = 'module-group open';
    group.dataset.moduleId = mod.id;

    // Header do módulo
    const header = document.createElement('div');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <span class="module-index">MÓD ${String(mIdx + 1).padStart(2, '0')}</span>
        <span class="module-name">${mod.title}</span>
      </div>
      <span class="module-toggle">▶</span>
    `;
    header.addEventListener('click', () => {
      group.classList.toggle('open');
    });

    // Lista de aulas
    const lessonList = document.createElement('div');
    lessonList.className = 'module-lessons';

    mod.lessons.forEach(lesson => {
      const item = createLessonItem(lesson, course);
      lessonList.appendChild(item);
    });

    group.appendChild(header);
    group.appendChild(lessonList);
    list.appendChild(group);
  });
}

function createLessonItem(lesson, course) {
  const completed = AppState.completedLessons[course.id]?.has(lesson.id);
  const isActive = AppState.currentLessonId === lesson.id;

  const item = document.createElement('div');
  item.className = `lesson-item${isActive ? ' active' : ''}`;
  item.dataset.lessonId = lesson.id;

  item.innerHTML = `
    <div class="lesson-check${completed ? ' done' : ''}" 
         data-lesson-id="${lesson.id}" 
         title="${completed ? 'Desmarcar' : 'Marcar como concluída'}"></div>
    <div class="lesson-item-info">
      <div class="lesson-item-code">${lesson.code}</div>
      <div class="lesson-item-title">${lesson.title}</div>
    </div>
    <span class="lesson-item-duration">${lesson.duration}</span>
  `;

  // Clica na aula
  item.addEventListener('click', (e) => {
    if (!e.target.classList.contains('lesson-check')) {
      openLesson(lesson.id);
    }
  });

  // Clica no check
  const check = item.querySelector('.lesson-check');
  check.addEventListener('click', (e) => {
    e.stopPropagation();
    markComplete(lesson.id, course.id);
  });

  return item;
}

/* ── Abre uma aula ──────────────────────────────────────── */
function openLesson(lessonId) {
  const course = AppState.currentCourse;
  if (!course) return;

  const allLessons = getAllLessons(course);
  const lesson = allLessons.find(l => l.id === lessonId);
  if (!lesson) return;

  AppState.currentLessonId = lessonId;

  // Atualiza o player via IFrame API
  const placeholder = document.getElementById('video-placeholder');
  if (lesson.youtubeId) {
    loadYTVideo(lesson.youtubeId);
    if (placeholder) placeholder.classList.add('hidden');
  } else {
    if (placeholder) placeholder.classList.remove('hidden');
  }

  // Título e meta
  const mod = course.modules.find(m => m.lessons.some(l => l.id === lessonId));
  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-module-tag').textContent = mod ? mod.title : '';
  document.getElementById('lesson-order').textContent = '#' + lesson.code;
  document.getElementById('topbar-breadcrumb').textContent =
    `${course.title} › ${lesson.title}`;
  document.getElementById('lesson-description-text').textContent = lesson.description || '';

  // Modo foco: atualiza nome da aula
  const focusLesson = document.getElementById('focus-bar-lesson');
  if (focusLesson) focusLesson.textContent = lesson.title;

  // Carrega notas
  loadNotes(lessonId);

  // Estado do botão concluir
  updateCompleteButton(lessonId, course.id);

  // Atualiza sidebar (active)
  refreshSidebarActive(lessonId);

  // Botões nav
  updateNavButtons(allLessons, lessonId);

  // Scrola pro topo do player
  document.getElementById('player-main').scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Atualiza item ativo na sidebar ─────────────────────── */
function refreshSidebarActive(lessonId) {
  document.querySelectorAll('.lesson-item').forEach(item => {
    const active = item.dataset.lessonId === lessonId;
    item.classList.toggle('active', active);
  });
}

/* ── Marcar/desmarcar conclusão ─────────────────────────── */
function markComplete(lessonId, courseId) {
  const set = AppState.completedLessons[courseId] || new Set();
  AppState.completedLessons[courseId] = set;

  if (set.has(lessonId)) {
    set.delete(lessonId);
  } else {
    set.add(lessonId);
    gainXP('lessonComplete');
    incrementDailyGoal();
    onLessonCompletedInFocus();
  }

  // Atualiza check na sidebar
  document.querySelectorAll(`.lesson-check[data-lesson-id="${lessonId}"]`).forEach(el => {
    el.classList.toggle('done', set.has(lessonId));
  });

  // Atualiza botão concluir
  if (AppState.currentLessonId === lessonId) {
    updateCompleteButton(lessonId, courseId);
  }

  updateProgress(AppState.currentCourse);

  // Verifica curso completo
  const course = AppState.currentCourse;
  if (course && set.size === countLessons(course) && set.has(lessonId)) {
    setTimeout(() => openModal('modal-course-done'), 600);
  }
}

/* ── Toggle botão concluir (abaixo do vídeo) ────────────── */
function toggleComplete() {
  const { currentLessonId, currentCourse } = AppState;
  if (!currentLessonId || !currentCourse) return;

  const set = AppState.completedLessons[currentCourse.id];
  const wasDone = set?.has(currentLessonId);

  markComplete(currentLessonId, currentCourse.id);

  if (!wasDone) {
    const allLessons = getAllLessons(currentCourse);
    const idx = allLessons.findIndex(l => l.id === currentLessonId);
    const hasNext = idx < allLessons.length - 1;

    if (hasNext) {
      // Se foco ativo: avança direto sem modal
      if (isFocusModeActive()) {
        setTimeout(() => navigateLesson(1), 600);
      } else {
        // Sem foco: mostra modal normal
        document.getElementById('modal-complete-msg').textContent = 'Continue para a próxima aula!';
        openModal('modal-complete');
      }
    }
  }
}

function updateCompleteButton(lessonId, courseId) {
  const btn = document.getElementById('btn-complete');
  const done = AppState.completedLessons[courseId]?.has(lessonId);
  btn.classList.toggle('completed', !!done);
  btn.innerHTML = done
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Concluída ✓`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Marcar como Concluída`;
}

/* ── Navegar entre aulas ────────────────────────────────── */
function navigateLesson(direction) {
  const course = AppState.currentCourse;
  if (!course) return;
  const allLessons = getAllLessons(course);
  const idx = allLessons.findIndex(l => l.id === AppState.currentLessonId);
  const next = allLessons[idx + direction];
  if (next) openLesson(next.id);
}

function goNextFromModal() {
  closeModal('modal-complete');
  navigateLesson(1);
}

function updateNavButtons(allLessons, currentId) {
  const idx = allLessons.findIndex(l => l.id === currentId);
  document.getElementById('btn-prev').disabled = idx <= 0;
  document.getElementById('btn-next').disabled = idx >= allLessons.length - 1;
}

/* ── Cards dos cursos na home ───────────────────────────── */
function renderCourseCards() {
  const grid = document.getElementById('courses-grid');
  grid.innerHTML = '';

  COURSES_DATA.forEach(course => {
    const total = countLessons(course);
    const done = (AppState.completedLessons[course.id] || new Set()).size;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
      <div class="card-thumb" style="background:${course.thumbColor}">
        <span>${course.thumbIcon}</span>
      </div>
      <div class="card-body">
        <span class="card-tag" style="color:${course.tagColor};background:${course.tagBg}">${course.tag}</span>
        <h3 class="card-title">${course.title}</h3>
        <p class="card-desc">${course.description}</p>
        <div class="card-meta">
          <span class="card-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            ${total} aulas
          </span>
          ${done > 0 ? `<span class="card-meta-item" style="color:var(--success)">✓ ${done} concluída${done !== 1 ? 's' : ''}</span>` : ''}
        </div>
        ${pct > 0 ? `
          <div class="card-progress-bar">
            <div class="card-progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="card-progress-label">${pct}% concluído</div>
        ` : ''}
        <button class="card-btn" onclick="openCourse('${course.id}')">
          ${pct === 0 ? 'Começar Curso' : pct === 100 ? '🏆 Rever Curso' : 'Continuar →'}
        </button>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('card-btn')) {
        openCourse(course.id);
      }
    });

    grid.appendChild(card);
  });
}
