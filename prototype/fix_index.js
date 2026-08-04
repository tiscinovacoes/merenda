const fs = require('fs');
const path = require('path');
const p = path.resolve('prototype/index.html');
let html = fs.readFileSync(p, 'utf8');

if (!html.includes('sprint_abc.js')) {
  html = html.replace('</body>', '<script src=\"sprint_abc.js\"></script>\n</body>');
}

const escolaBtn = `          <!-- ESCOLA (perfil unificado) -->
          <button class="profile-btn" data-profile="escola" id="btn-profile-escola" type="button">
            <div class="profile-icon">🏫</div>
            <span>Escola</span>
          </button>`;

const newBtns = `          <!-- ESCOLAS (desmembrado) -->
          <button class="profile-btn" data-profile="diretor" id="btn-profile-diretor" type="button">
            <div class="profile-icon">🎓</div>
            <span>Diretor(a)</span>
          </button>
          <button class="profile-btn" data-profile="merendeira" id="btn-profile-merendeira" type="button">
            <div class="profile-icon">👩‍🍳</div>
            <span>Merendeira</span>
          </button>
          <button class="profile-btn" data-profile="resp_estoque" id="btn-profile-resp_estoque" type="button">
            <div class="profile-icon">📋</div>
            <span>Resp. Estoque</span>
          </button>`;

html = html.replace(escolaBtn, newBtns);
fs.writeFileSync(p, html);
console.log('Fixed index.html');
