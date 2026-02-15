const API_BASE = '/api';

async function loadLanguages() {
  try {
    const response = await fetch(`${API_BASE}/languages`);
    const data = await response.json();
    
    const select = document.getElementById('outputLanguage');
    data.languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = `${lang.nativeName} (${lang.name})`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load languages:', error);
  }
}

async function generateExplanation() {
  const topic = document.getElementById('topic').value.trim();
  const difficulty = document.getElementById('difficulty').value;
  const outputLanguage = document.getElementById('outputLanguage').value;

  if (topic.length < 10) {
    alert('Please enter a topic with at least 10 characters');
    return;
  }

  const generateBtn = document.getElementById('generateBtn');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');

  generateBtn.disabled = true;
  loading.classList.remove('hidden');
  results.classList.add('hidden');

  try {
    const response = await fetch(`${API_BASE}/topic/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        difficulty,
        outputLanguage: outputLanguage || undefined
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate explanation');
    }

    const data = await response.json();
    displayResults(data);
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    generateBtn.disabled = false;
    loading.classList.add('hidden');
  }
}

function displayResults(data) {
  const results = document.getElementById('results');
  const explanationContent = document.getElementById('explanation-content');
  const scriptContent = document.getElementById('script-content');

  explanationContent.innerHTML = `
    <div>
      <h3>Core Concepts</h3>
      <ul>
        ${data.explanation.core_concepts.map(c => `<li>${c}</li>`).join('')}
      </ul>
      
      <h3>Explanation</h3>
      <p>${data.explanation.explanation_text}</p>
      
      <h3>Examples</h3>
      ${data.explanation.examples.map(ex => `
        <div class="scene">
          <strong>${ex.type}:</strong> ${ex.content}
        </div>
      `).join('')}
    </div>
  `;

  const scriptData = JSON.parse(data.script.script_data);
  scriptContent.innerHTML = scriptData.map(scene => `
    <div class="scene">
      <h4>Scene ${scene.sceneNumber} (${scene.duration}s)</h4>
      <p><strong>Visual:</strong> ${scene.visualDescription}</p>
      <p><strong>Narration:</strong> ${scene.narration}</p>
      <p><strong>On-screen:</strong> ${scene.onScreenText.join(', ')}</p>
    </div>
  `).join('');

  results.classList.remove('hidden');
}

document.getElementById('generateBtn').addEventListener('click', generateExplanation);

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

loadLanguages();
