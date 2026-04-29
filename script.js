const MODELS = [
    // ── OpenAI ──
    {
      id: 'gpt4o',
      provider: 'openai',
      name: 'GPT-4o',
      inputPrice: 2.50,
      outputPrice: 10.00,
      note: '128K ctx · Multimodal'
    },
    {
      id: 'gpt4o-mini',
      provider: 'openai',
      name: 'GPT-4o mini',
      inputPrice: 0.15,
      outputPrice: 0.60,
      note: '128K ctx · Ligero y rápido'
    },
    {
      id: 'gpt41',
      provider: 'openai',
      name: 'GPT-4.1',
      inputPrice: 2.00,
      outputPrice: 8.00,
      note: '1M ctx · Instrucción avanzada'
    },
    {
      id: 'gpt41-mini',
      provider: 'openai',
      name: 'GPT-4.1 mini',
      inputPrice: 0.40,
      outputPrice: 1.60,
      note: '1M ctx · Equilibrado'
    },
    {
      id: 'gpt41-nano',
      provider: 'openai',
      name: 'GPT-4.1 nano',
      inputPrice: 0.10,
      outputPrice: 0.40,
      note: '1M ctx · Ultra económico'
    },
    // ── Claude ──
    {
      id: 'opus46',
      provider: 'claude',
      name: 'Claude Opus 4.6',
      inputPrice: 5.00,
      outputPrice: 25.00,
      note: '1M ctx · Razonamiento avanzado'
    },
    {
      id: 'sonnet46',
      provider: 'claude',
      name: 'Claude Sonnet 4.6',
      inputPrice: 3.00,
      outputPrice: 15.00,
      note: '1M ctx · Uso general recomendado'
    },
    {
      id: 'haiku45',
      provider: 'claude',
      name: 'Claude Haiku 4.5',
      inputPrice: 1.00,
      outputPrice: 5.00,
      note: '200K ctx · Rápido y económico'
    },
    // ── Gemini ──
    {
      id: 'gemini25pro',
      provider: 'gemini',
      name: 'Gemini 2.5 Pro',
      inputPrice: 1.25,
      outputPrice: 10.00,
      note: '1M ctx · Razonamiento top'
    },
    {
      id: 'gemini25flash',
      provider: 'gemini',
      name: 'Gemini 2.5 Flash',
      inputPrice: 0.30,
      outputPrice: 2.50,
      note: '1M ctx · Pensamiento integrado'
    },
    {
      id: 'gemini25flashlite',
      provider: 'gemini',
      name: 'Gemini 2.5 Flash-Lite',
      inputPrice: 0.10,
      outputPrice: 0.40,
      note: '1M ctx · Ultra económico'
    },
    // ── DeepSeek ──
    {
      id: 'deepseek-r1',
      provider: 'deepseek',
      name: 'DeepSeek R1',
      inputPrice: 0.55,
      outputPrice: 2.19,
      note: '128K ctx · Razonamiento cadena-pensamiento'
    },
    {
      id: 'deepseek-v4-flash',
      provider: 'deepseek',
      name: 'DeepSeek V4 Flash',
      inputPrice: 0.14,
      outputPrice: 0.28,
      note: '1M ctx · Chat + Razonamiento'
    },
    {
      id: 'deepseek-v3',
      provider: 'deepseek',
      name: 'DeepSeek V3.2',
      inputPrice: 0.28,
      outputPrice: 0.42,
      note: '128K ctx · Uso general'
    },
  ];
  
  let activeProvider = 'all';
  let sortMode = 'total-asc';
  
  function calcCost(model, inputTok, outputTok) {
    const inCost = (inputTok / 1_000_000) * model.inputPrice;
    const outCost = (outputTok / 1_000_000) * model.outputPrice;
    return { inCost, outCost, total: inCost + outCost };
  }
  
  function fmt(val) {
    if (val === 0) return '$0.00';
    if (val < 0.0001) return '$' + val.toExponential(2);
    if (val < 0.001) return '$' + val.toFixed(4);
    if (val < 0.01) return '$' + val.toFixed(3);
    if (val < 1) return '$' + val.toFixed(2);
    return '$' + val.toFixed(4);
  }
  
  function fmtRate(val) {
    return '$' + val.toFixed(2) + '/M';
  }
  
  function providerLabel(p) {
    return { openai: 'OpenAI', claude: 'Anthropic', gemini: 'Google', deepseek: 'DeepSeek' }[p];
  }
  
  function buildCards(inputTok, outputTok) {

    //Calcula el costo de tokens de entrada y salida, asegurando que sean números no negativos. Si el valor ingresado no es un número válido, se considera como 0.
    const withCosts = MODELS.map(m => ({ ...m, ...calcCost(m, inputTok, outputTok) }));
    const inputTok = Math.max(0, parseInt(document.getElementById('inputTokens').value) || 0);
    const outputTok = Math.max(0, parseInt(document.getElementById('outputTokens').value) || 0);
  
    let models = [...MODELS];
  
 
    // Find cheapest
    const allCosts = withCosts.map(m => m.total);
    const minCost = Math.min(...allCosts);
    const maxCost = Math.max(...allCosts);
  
    // Sort
    if (sortMode === 'total-asc') withCosts.sort((a, b) => a.total - b.total);
    else if (sortMode === 'total-desc') withCosts.sort((a, b) => b.total - a.total);
    else if (sortMode === 'name') withCosts.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortMode === 'provider') withCosts.sort((a, b) => a.provider.localeCompare(b.provider));
  
    const grid = document.getElementById('resultsGrid');
    grid.innerHTML = '';
  
    let visibleCount = 0;
  
    withCosts.forEach((m, i) => {
      const visible = activeProvider === 'all' || m.provider === activeProvider;
      if (visible) visibleCount++;
  
      const isCheapest = m.total === minCost;
      const card = document.createElement('div');
      card.className = `model-card ${m.provider}${visible ? '' : ' hidden'}`;
      card.style.animationDelay = `${i * 0.04}s`;
  
      card.innerHTML = `
        <div class="card-stripe"></div>
        <div class="card-header">
          <div class="card-info">
            <div class="provider-badge">${providerLabel(m.provider)}</div>
            <div class="model-name">${m.name}</div>
            ${isCheapest && (inputTok + outputTok) > 0 ? '<div class="cheapest-tag">✦ más económico</div>' : ''}
          </div>
          <div class="total-cost">
            <span class="cost-value">${fmt(m.total)}</span>
            <span class="cost-label">TOTAL</span>
          </div>
        </div>
        <hr class="sep">
        <div class="cost-breakdown">
          <div class="cost-item">
            <div class="cost-item-label"><span class="dot dot-in" style="width:6px;height:6px;border-radius:50%;background:var(--accent3);display:inline-block;"></span> Entrada</div>
            <div class="cost-item-value">${fmt(m.inCost)}</div>
            <div class="cost-item-rate">${fmtRate(m.inputPrice)}</div>
          </div>
          <div class="cost-item">
            <div class="cost-item-label"><span class="dot dot-out" style="width:6px;height:6px;border-radius:50%;background:var(--accent2);display:inline-block;"></span> Salida</div>
            <div class="cost-item-value">${fmt(m.outCost)}</div>
            <div class="cost-item-rate">${fmtRate(m.outputPrice)}</div>
          </div>
        </div>
        ${m.note ? `<div style="margin-top:12px;font-size:0.72rem;color:var(--muted);font-family:'Space Mono',monospace;">${m.note}</div>` : ''}
      `;
  
      grid.appendChild(card);
    });
  
    // Summary
    const visibleModels = withCosts.filter(m => activeProvider === 'all' || m.provider === activeProvider);
    const visibleCosts = visibleModels.map(m => m.total);
  
    document.getElementById('totalTokens').textContent = (inputTok + outputTok).toLocaleString('es');
    document.getElementById('cheapestCost').textContent = visibleCosts.length ? fmt(Math.min(...visibleCosts)) : '—';
    document.getElementById('mostExpensiveCost').textContent = visibleCosts.length ? fmt(Math.max(...visibleCosts)) : '—';
    document.getElementById('modelsShown').textContent = visibleCount;
    document.getElementById('visibleCount').textContent = visibleCount;
  
    const empty = document.getElementById('emptyState');
    empty.classList.toggle('visible', visibleCount === 0);
  }
  
  // Events
  document.getElementById('inputTokens').addEventListener('input', buildCards);
  document.getElementById('outputTokens').addEventListener('input', buildCards);
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeProvider = btn.dataset.provider;
      buildCards();
    });
  });
  
  document.getElementById('sortSelect').addEventListener('change', e => {
    sortMode = e.target.value;
    buildCards();
  });
  
  // Init
  buildCards();

  document.getElementById('calculateButton').addEventListener('click', () => {
    const textInput = document.getElementById('textInput').value;
    const inputTok = Math.max(0, parseInt(textInput) || 0);
    buildCards(inputTok, inputTok);
  });

  // JavaScript
const providerFilter = document.getElementById('providerFilter');
const sortSelect = document.getElementById('sortSelect');

providerFilter.addEventListener('change', () => {
  const selectedProvider = providerFilter.value;
  const filteredModels = MODELS.filter(m => selectedProvider === 'all' || m.provider === selectedProvider);
  buildCards(inputTok, outputTok, filteredModels);
});

sortSelect.addEventListener('change', () => {
  const selectedSort = sortSelect.value;
  let sortedModels = [...MODELS];
  if (selectedSort === 'total-asc') sortedModels.sort((a, b) => a.total - b.total);
  else if (selectedSort === 'total-desc') sortedModels.sort((a, b) => b.total - a.total);
  else if (selectedSort === 'name') sortedModels.sort((a, b) => a.name.localeCompare(b.name));
  buildCards(inputTok, outputTok, sortedModels);
});