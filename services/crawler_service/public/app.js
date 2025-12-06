// State
let currentType = null;
let availableSources = { rss: [], reddit: [] };
let fetchedItems = [];
let selectedItems = [];

// Initialize
async function init() {
  try {
    const response = await fetch('/api/sources');
    availableSources = await response.json();

    // Check saved theme
    const savedTheme = localStorage.getItem('veris-halloween-theme');
    if (savedTheme === 'true') {
      document.body.classList.add('halloween');
      updateToggleButton(true);
    }
  } catch (error) {
    console.error('Failed to load sources:', error);
  }
}

function toggleHalloween() {
  const isHalloween = document.body.classList.toggle('halloween');
  localStorage.setItem('veris-halloween-theme', isHalloween);
  updateToggleButton(isHalloween);
}

function updateToggleButton(isHalloween) {
  const btn = document.getElementById('halloween-toggle');
  if (btn) {
    btn.innerHTML = isHalloween ? '👻 BOO!' : '👻 Theme';
  }
}

// Step 1: Select source type
function selectSourceType(type) {
  currentType = type;

  document.getElementById('step-1').classList.add('hidden');
  document.getElementById('step-2').classList.remove('hidden');

  renderSourceList();
  
  // Show Reddit warning if in production
  if (type === 'reddit' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    showRedditWarning();
  }
}

function showRedditWarning() {
  const container = document.getElementById('source-list');
  const warning = document.createElement('div');
  warning.className = 'reddit-warning';
  warning.style.cssText = 'background: #fff3cd; border: 2px solid #856404; padding: 1rem; margin-bottom: 1rem; font-family: "Courier Prime", monospace; font-size: 0.9rem;';
  warning.innerHTML = `
    <strong style="color: #856404;">⚠️ Reddit API Notice</strong>
    <p style="margin: 0.5rem 0 0 0; color: #856404;">Reddit API requires approval for production use. This feature works locally but may be blocked in production. Try running locally to test Reddit crawling.</p>
  `;
  container.insertBefore(warning, container.firstChild);
}

// Render source selection list
function renderSourceList() {
  const container = document.getElementById('source-list');
  const sources = currentType === 'rss' ? availableSources.rss : availableSources.reddit;

  container.innerHTML = sources.map((source, index) => `
    <div class="source-item">
      <input type="checkbox" id="source-${index}" value="${source}" checked>
      <label for="source-${index}">${source}</label>
    </div>
  `).join('');
}

// Step 2: Fetch content
async function fetchContent() {
  const checkboxes = document.querySelectorAll('#source-list input[type="checkbox"]:checked');
  const selectedSources = Array.from(checkboxes).map(cb => cb.value);

  if (selectedSources.length === 0) {
    alert('Please select at least one source');
    return;
  }

  const btn = document.getElementById('btn-fetch');
  btn.disabled = true;
  btn.textContent = 'Fetching...';

  try {
    const response = await fetch('/api/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: currentType, sources: selectedSources })
    });

    const data = await response.json();
    fetchedItems = data.items;

    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');

    renderContentList();
  } catch (error) {
    console.error('Fetch failed:', error);
    alert('Failed to fetch content. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Fetch Content';
  }
}

// Render content list
function renderContentList() {
  const container = document.getElementById('content-list');

  container.innerHTML = fetchedItems.map((item, index) => {
    const preview = (item.rawText || '').substring(0, 200) + '...';
    const date = new Date(item.metadata.publishedAt).toLocaleDateString();

    return `
      <div class="content-item" id="item-${index}">
        <div class="content-item-header">
          <input type="checkbox" id="check-${index}" onchange="toggleItem(${index})" checked>
          <div class="content-item-body">
            <h3 class="content-item-title" onclick="showDetail(${index})">${item.metadata.title || 'Untitled'}</h3>
            <div class="content-item-meta">
              <span>📰 ${item.source}</span>
              <span>✍️ ${item.metadata.author || 'Unknown'}</span>
              <span>📅 ${date}</span>
            </div>
            <p class="content-item-preview">${preview}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');

  selectedItems = [...fetchedItems];
}

// Show detailed view
function showDetail(index) {
  const item = fetchedItems[index];
  const date = new Date(item.metadata.publishedAt).toLocaleString();

  document.getElementById('modal-title').textContent = item.metadata.title || 'Untitled';
  document.getElementById('modal-meta').innerHTML = `
    <span>📰 ${item.source}</span>
    <span>✍️ ${item.metadata.author || 'Unknown'}</span>
    <span>📅 ${date}</span>
    <span>📝 ${item.contentType}</span>
  `;
  document.getElementById('modal-text').textContent = item.rawText || 'No text content';

  // Show media if available
  const mediaHtml = [];
  if (item.images && item.images.length > 0) {
    mediaHtml.push('<h4>Images:</h4>');
    item.images.forEach(img => {
      mediaHtml.push(`<img src="${img}" alt="Content image" loading="lazy">`);
    });
  }
  if (item.videos && item.videos.length > 0) {
    mediaHtml.push('<h4>Videos:</h4>');
    item.videos.forEach(vid => {
      mediaHtml.push(`<p>🎥 <a href="${vid}" target="_blank">${vid}</a></p>`);
    });
  }
  document.getElementById('modal-media').innerHTML = mediaHtml.join('');

  document.getElementById('modal-link').href = item.url;
  document.getElementById('detail-modal').classList.remove('hidden');
}

// Close modal
function closeModal() {
  document.getElementById('detail-modal').classList.add('hidden');
}

// Toggle item selection
function toggleItem(index) {
  const checkbox = document.getElementById(`check-${index}`);
  const item = document.getElementById(`item-${index}`);

  if (checkbox.checked) {
    item.classList.add('selected');
    selectedItems[index] = fetchedItems[index];
  } else {
    item.classList.remove('selected');
    selectedItems[index] = null;
  }
}

// Select/Deselect all
function selectAll() {
  document.querySelectorAll('#content-list input[type="checkbox"]').forEach((cb, i) => {
    cb.checked = true;
    document.getElementById(`item-${i}`).classList.add('selected');
    selectedItems[i] = fetchedItems[i];
  });
}

function deselectAll() {
  document.querySelectorAll('#content-list input[type="checkbox"]').forEach((cb, i) => {
    cb.checked = false;
    document.getElementById(`item-${i}`).classList.remove('selected');
    selectedItems[i] = null;
  });
}

// Step 3: Process selected items
async function processSelected() {
  const items = selectedItems.filter(item => item !== null);

  if (items.length === 0) {
    alert('Please select at least one item');
    return;
  }

  document.getElementById('step-3').classList.add('hidden');
  document.getElementById('step-4').classList.remove('hidden');

  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const resultsList = document.getElementById('results-list');

  progressText.innerHTML = `Processing items...<br><small style="color: var(--text-secondary);">Agent may take 1-2 minutes per item for complex claims</small>`;

  try {
    const response = await fetch('/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    const data = await response.json();

    // Animate progress
    let processed = 0;
    const interval = setInterval(() => {
      processed++;
      const percent = (processed / items.length) * 100;
      progressFill.style.width = `${percent}%`;

      if (processed >= items.length) {
        clearInterval(interval);
        progressText.innerHTML = `Complete! ${data.successCount}/${items.length} sent to agent<br><small style="color: var(--text-secondary);">Claims are being extracted and will appear in database</small>`;
      }
    }, 100);

    // Show results
    resultsList.innerHTML = data.results.map(result => {
      const success = result.success;
      const icon = success
        ? '<svg class="result-icon success" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>'
        : '<svg class="result-icon error" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>';

      return `
        <div class="result-item ${success ? 'success' : 'error'}">
          ${icon}
          <span class="result-text">${result.url}</span>
        </div>
      `;
    }).join('');

    document.getElementById('btn-reset').style.display = 'block';
  } catch (error) {
    console.error('Processing failed:', error);
    progressText.textContent = 'Processing failed. Please try again.';
  }
}

// Reset and start over
function reset() {
  currentType = null;
  fetchedItems = [];
  selectedItems = [];

  document.getElementById('step-1').classList.remove('hidden');
  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-3').classList.add('hidden');
  document.getElementById('step-4').classList.add('hidden');

  document.getElementById('progress-fill').style.width = '0%';
  document.getElementById('results-list').innerHTML = '';
  document.getElementById('btn-reset').style.display = 'none';
}

// Initialize on load
init();
