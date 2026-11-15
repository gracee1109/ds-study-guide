/* See AGENTS.md for content and development rules. */
const app = document.getElementById('app');
const topics = Array.isArray(window.STUDY_TOPICS) ? window.STUDY_TOPICS : [];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}
function card(topic) {
  return `<a class="topic-card" href="#/topic/${encodeURIComponent(topic.slug)}">
      <div class="card-meta"><span>${escapeHtml(topic.category)}</span><span class="difficulty">${escapeHtml(topic.difficulty)}</span></div>
      <h3>${escapeHtml(topic.title)}</h3><p>${escapeHtml(topic.summary)}</p><span class="card-link">閱讀筆記 →</span>
    </a>`;
}
function renderHome() {
  app.innerHTML = `<section class="hero"><div class="eyebrow">STUDY / REVIEW / REPEAT</div><h1>把資料結構，<br><em>整理成真正記得住的筆記。</em></h1><p>從核心概念、時間複雜度到常見考點，循序整理研究所考試需要的基礎知識。</p><div class="hero-stats"><strong>${topics.length}</strong><span>個複習主題 · 持續擴充中</span></div></section>
  <section class="section-head"><div><p class="eyebrow">TOPICS</p><h2>探索複習主題</h2></div><label class="search-label" for="search">搜尋主題<input id="search" type="search" placeholder="例如：樹、BFS、佇列" autocomplete="off" /></label></section>
  <div id="topic-grid" class="topic-grid" aria-live="polite"></div>`;
  const input = document.getElementById('search');
  const grid = document.getElementById('topic-grid');
  function filter() {
    const query = input.value.trim().toLocaleLowerCase('zh-Hant');
    const matches = topics.filter(t => [t.title,t.category,t.summary,t.slug].some(s => s.toLocaleLowerCase('zh-Hant').includes(query)));
    grid.innerHTML = matches.length ? matches.map(card).join('') : '<p class="empty">沒有找到符合的主題，試試其他關鍵字。</p>';
  }
  input.addEventListener('input', filter); filter();
}
function buildGradingPrompt(topic, studentAnswer) {
  return `請扮演資料結構助教，依據題目與參考答案批改我的簡答題。請以繁體中文回覆，總分 10 分：觀念正確性 6 分、解釋完整性 3 分、術語精確性 1 分。依序提供：總分、正確之處、需要修正之處、如何改善、完整參考解答。請勿因為用詞與參考答案不同就扣分，應依語意判斷。\n\n章節：${topic.title}\n題目：${topic.quiz.question}\n參考答案：${topic.quiz.answer}\n我的回答：${studentAnswer}`;
}
function renderGradeResult(result) {
  const score = Number(result.score);
  const resultNode = document.getElementById('grade-result');
  resultNode.hidden = false;
  resultNode.innerHTML = `<h3>AI 批改：${Number.isFinite(score) ? escapeHtml(score) + ' / 10' : '已完成'}</h3>
    <p><strong>正確之處：</strong>${escapeHtml(result.strengths || '未提供')}</p>
    <p><strong>需要修正：</strong>${escapeHtml(result.improvements || '未提供')}</p>
    <p><strong>改進建議：</strong>${escapeHtml(result.suggestion || '未提供')}</p>
    <p><strong>參考解答：</strong>${escapeHtml(result.modelAnswer || '未提供')}</p>
    <p class="grade-note">AI 評分僅供學習參考，可能發生誤判。</p>`;
}
function renderTopic(slug) {
  const topic = topics.find(t => t.slug === slug);
  if (!topic) {
    app.innerHTML = `<section class="not-found"><p class="eyebrow">404 / TOPIC NOT FOUND</p><h1>找不到這份筆記</h1><p>這個主題可能尚未建立或網址有誤。</p><a class="back" href="#/">← 返回全部筆記</a></section>`;
    return;
  }
  app.innerHTML = `<article class="article">
    <a class="back" href="#/">← 返回全部筆記</a>
    <div class="article-heading"><p class="eyebrow">${escapeHtml(topic.category)} / ${escapeHtml(topic.difficulty)}</p><h1>${escapeHtml(topic.title)}</h1><p class="lead">${escapeHtml(topic.summary)}</p></div>
    <div class="article-layout"><div class="article-body"><h2>核心觀念</h2>${topic.concepts.map((c, i) => `<section class="concept"><span class="concept-index">${String(i+1).padStart(2,'0')}</span><div><h3>${escapeHtml(c.heading)}</h3><p>${escapeHtml(c.body)}</p></div></section>`).join('')}
    <section class="quiz"><p class="eyebrow">QUICK CHECK</p><h2>自我測驗</h2><p class="question">${escapeHtml(topic.quiz.question)}</p>
    <label class="response-label" for="student-answer">我的回答（簡答）</label>
    <textarea id="student-answer" rows="5" maxlength="2000" placeholder="先用自己的話回答，再交給 AI 批改。"></textarea>
    <div class="quiz-actions"><button type="button" id="grade-button">AI 批改</button>
    <button type="button" id="copy-grade" class="secondary-button">複製批改提示詞</button>
    <button id="answer-toggle" class="secondary-button" type="button" aria-expanded="false">顯示解答</button></div>
    <p class="grade-status" id="grade-status" aria-live="polite"></p>
    <div class="grade-result" id="grade-result" aria-live="polite" hidden></div>
    <div id="answer" class="answer" hidden>${escapeHtml(topic.quiz.answer)}</div></section></div>
    <aside class="exam-aside"><p class="eyebrow">EXAM NOTES</p><h2>常見考點</h2><ul>${topic.examPoints.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul></aside></div>
  </article>`;
  const input = document.getElementById('student-answer');
  const grade = document.getElementById('grade-button');
  const copy = document.getElementById('copy-grade');
  const status = document.getElementById('grade-status');
  const endpoint = (window.GRADING_API_ENDPOINT || '').trim();
  grade.addEventListener('click', async () => {
    const studentAnswer = input.value.trim();
    if (!studentAnswer) { status.textContent = '請先填寫自己的答案。'; input.focus(); return; }
    if (!endpoint) {
      status.textContent = '尚未設定 AI 批改後端。請使用「複製批改提示詞」貼到 ChatGPT，或依 README 部署 Cloudflare Worker。';
      return;
    }
    grade.disabled = true; status.textContent = '正在批改…';
    document.getElementById('grade-result').hidden = true;
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({topic: topic.title, question: topic.quiz.question, referenceAnswer: topic.quiz.answer, studentAnswer})
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'AI 批改服務暫時無法使用');
      renderGradeResult(payload);
      status.textContent = '批改完成。';
    } catch (error) { status.textContent = `批改失敗：${error.message}。仍可複製提示詞進行批改。`; }
    finally { grade.disabled = false; }
  });
  copy.addEventListener('click', async () => {
    const studentAnswer = input.value.trim();
    if (!studentAnswer) { status.textContent = '請先填寫自己的答案。'; input.focus(); return; }
    try { await navigator.clipboard.writeText(buildGradingPrompt(topic, studentAnswer)); status.textContent = '已複製，請貼到 ChatGPT 進行 AI 批改。'; }
    catch { status.textContent = '瀏覽器無法存取剪貼簿，請於 HTTPS 網站開啟後重試。'; }
  });
  const button = document.getElementById('answer-toggle');
  const answer = document.getElementById('answer');
  button.addEventListener('click', () => {
    answer.hidden = !answer.hidden;
    button.textContent = answer.hidden ? '顯示解答' : '收起解答';
    button.setAttribute('aria-expanded', String(!answer.hidden));
  });
}
function render() {
  const hash = window.location.hash || '#/';
  const match = hash.match(/^#\/topic\/([^/?#]+)$/);
  if (hash === '#/' || hash === '#') renderHome();
  else if (match) { try { renderTopic(decodeURIComponent(match[1])); } catch { renderTopic(''); } }
  else renderTopic('');
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);
render();
