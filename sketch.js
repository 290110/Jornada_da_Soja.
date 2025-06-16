let gameData = {
  sacasColetadas: 0,
  tempoColheita: 0, 
  distanciaPercorrida: 0,
  combustivel: 100,
  precoOferta: 25000,
  compradores: 0,
  valorFinal: 0,
  lucro: 0,
  custoProducao: 12000,
};

let currentStage = 1;
let gameStartTime;
let progressValue = 0;
let isProcessing = false;
let processStartTime = 0;
let confetti = [];
let fireworks = [];

let harvestButton, transportButton, negotiateButton, restartButton;

let colors = {
  bg: [26, 26, 46],
  primary: [255, 107, 53],
  field: [76, 140, 147],
  transport: [122, 25, 154],
  city: [0, 53, 102],
  celebration: [255, 0, 110],
};

function setup() {
  createCanvas(900, 700);
  gameStartTime = millis();

  setupButtons();
}

function draw() {
  drawBackground();
  drawGameFrame();
  drawStage();

  updateConfetti();
  updateFireworks();
  drawConfetti();
  drawFireworks();

  if (isProcessing) {
    updateProcess();
  }
}

// --- Setup Functions ---

function setupButtons() {
  harvestButton = createButton('🚜 Começar Colheita');
  styleButton(harvestButton, width / 2 - 100, 420, 200, 50);
  harvestButton.mousePressed(startHarvest);

  transportButton = createButton('🛣️ Iniciar Viagem');
  styleButton(transportButton, width / 2 - 100, 420, 200, 50);
  transportButton.mousePressed(startTransport);
  transportButton.hide();

  negotiateButton = createButton('💰 Negociar Venda');
  styleButton(negotiateButton, width / 2 - 100, 420, 200, 50);
  negotiateButton.mousePressed(startNegotiation);
  negotiateButton.hide();

  restartButton = createButton('🔄 Jogar Novamente');
  styleButton(restartButton, width / 2 - 100, 550, 200, 50);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function styleButton(button, x, y, w, h) {
  button.position(x, y);
  button.size(w, h);
  button.style('background', 'linear-gradient(45deg, #ff6b35, #f77f00)');
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('border-radius', '25px');
  button.style('font-size', '16px');
  button.style('cursor', 'pointer');
}

// --- Drawing Functions ---

function drawBackground() {
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(26, 26, 46), color(15, 52, 96), inter);
    stroke(c);
    line(0, i, width, i);
  }
}

function drawGameFrame() {
  fill(15, 15, 30, 240);
  stroke(255, 107, 53);
  strokeWeight(3);
  rect(50, 50, width - 100, height - 100, 20);

  fill(255, 107, 53);
  textAlign(CENTER);
  textSize(32);
  textStyle(BOLD);
  text('🌱 JORNADA DA SOJA 🚛', width / 2, 100);
}

function drawStage() {
  let stageY = 140;

  switch (currentStage) {
    case 1:
      drawFieldStage(stageY);
      break;
    case 2:
      drawTransportStage(stageY);
      break;
    case 3:
      drawCityStage(stageY);
      break;
    case 4:
      drawCelebrationStage(stageY);
      break;
  }
}

function drawFieldStage(y) {
  fill(45, 80, 22, 100);
  stroke(118, 200, 147);
  strokeWeight(2);
  rect(80, y, width - 160, 200, 15);

  textAlign(CENTER);
  textSize(48);
  text('🌾', width / 2, y + 50);

  fill(255, 255, 255);
  textSize(24);
  textStyle(BOLD);
  text('O PROCESSO DA COLHEITA ATÉ A CIDADE', width / 2, y + 80);

  fill(224, 225, 221);
  textSize(14);
  textStyle(NORMAL);
  text('Bem-vindo à fazenda do Pedro! É hora de colher a soja que cresceu sob o solo do interior.', width / 2, y + 110);

  drawProgressBar(120, y + 140, width - 240, 20, progressValue);
  drawStats(y + 180);
}

function drawTransportStage(y) {
  fill(90, 25, 154, 100);
  stroke(166, 99, 204);
  strokeWeight(2);
  rect(80, y, width - 160, 200, 15);

  textAlign(CENTER);
  textSize(48);
  let truckX = width / 2 + sin(millis() * 0.01) * 20;
  text('🚛', truckX, y + 50);

  fill(255, 255, 255);
  textSize(24);
  textStyle(BOLD);
  text('TRANSPORTE PARA A CIDADE', width / 2, y + 80);

  fill(224, 225, 221);
  textSize(14);
  textStyle(NORMAL);
  text('Agora vamos levar nossa preciosa colheita para a cidade!\nO caminhão está carregado e pronto para a viagem.', width / 2, y + 110);

  drawProgressBar(120, y + 140, width - 240, 20, progressValue);
  drawStats(y + 180);
}

function drawCityStage(y) {
  fill(0, 53, 102, 100);
  stroke(69, 123, 157);
  strokeWeight(2);
  rect(80, y, width - 160, 200, 15);

  textAlign(CENTER);
  textSize(48);
  text('🏢', width / 2, y + 50);

  fill(255, 255, 255);
  textSize(24);
  textStyle(BOLD);
  text('CHEGADA NA CIDADE', width / 2, y + 80);

  fill(224, 225, 221);
  textSize(14);
  textStyle(NORMAL);
  text('Chegamos na cidade! Hora de encontrar o melhor\ncomprador para nossa soja, vamos negociar!', width / 2, y + 110);

  drawProgressBar(120, y + 140, width - 240, 20, progressValue);
  drawStats(y + 180);
}

function drawCelebrationStage(y) {
  let hue = (millis() * 0.1) % 360;
  colorMode(HSB);
  fill(hue, 80, 90, 100);
  colorMode(RGB);
  stroke(255, 107, 53);
  strokeWeight(2);
  rect(80, y, width - 160, 250, 15);

  textAlign(CENTER);
  textSize(48);
  text('🎉', width / 2, y + 50);

  fill(255, 255, 255);
  textSize(32);
  textStyle(BOLD);
  let bounceY = y + 80 + sin(millis() * 0.01) * 5;
  text('PARABÉNS!', width / 2, bounceY);

  fill(224, 225, 221);
  textSize(16);
  textStyle(NORMAL);
  text('🎊 VENDA REALIZADA COM SUCESSO! 🎊\nVocê completou toda a jornada da soja!', width / 2, y + 120);

  drawFinalStats(y + 160);
}

function drawProgressBar(x, y, w, h, progress) {
  fill(0, 0, 0, 100);
  stroke(255, 107, 53);
  strokeWeight(2);
  rect(x, y, w, h, h / 2);

  fill(255, 107, 53);
  noStroke();
  let fillWidth = map(progress, 0, 100, 0, w - 4);
  rect(x + 2, y + 2, fillWidth, h - 4, (h - 4) / 2);
}

function drawStats(y) {
  fill(0, 0, 0, 150);
  stroke(255, 107, 53, 80);
  strokeWeight(1);

  let statY = y + 40;

  if (currentStage === 1) {
    drawStage1Stats(statY);
  } else if (currentStage === 2) {
    drawStage2Stats(statY);
  } else if (currentStage === 3) {
    drawStage3Stats(statY);
  }
}

function drawStage1Stats(statY) {
  rect(120, statY, 160, 60, 10);
  rect(300, statY, 160, 60, 10);
  rect(480, statY, 160, 60, 10);

  fill(255, 107, 53);
  textAlign(CENTER);
  textSize(20);
  textStyle(BOLD);
  text(gameData.sacasColetadas, 200, statY + 25);
  text(gameData.tempoColheita, 380, statY + 25);
  text('R$ ' + gameData.custoProducao.toLocaleString('pt-BR'), 560, statY + 25);

  fill(224, 225, 221);
  textSize(12);
  textStyle(NORMAL);
  text('Sacas Coletadas', 200, statY + 45);
  text('Minutos Trabalhados', 380, statY + 45);
  text('Custo de Produção', 560, statY + 45);
}

function drawStage2Stats(statY) {
  rect(180, statY, 160, 60, 10);
  rect(360, statY, 160, 60, 10);

  fill(255, 107, 53);
  textAlign(CENTER);
  textSize(20);
  textStyle(BOLD);
  text(gameData.distanciaPercorrida + ' km', 260, statY + 25);
  text(gameData.combustivel + '%', 440, statY + 25);

  fill(224, 225, 221);
  textSize(12);
  textStyle(NORMAL);
  text('Distância Percorrida', 260, statY + 45);
  text('Combustível', 440, statY + 45);
}

function drawStage3Stats(statY) {
  rect(180, statY, 160, 60, 10);
  rect(360, statY, 160, 60, 10);

  fill(255, 107, 53);
  textAlign(CENTER);
  textSize(18);
  textStyle(BOLD);
  text('R$ ' + gameData.precoOferta.toLocaleString('pt-BR'), 260, statY + 25);
  text(gameData.compradores, 440, statY + 25);

  fill(224, 225, 221);
  textSize(12);
  textStyle(NORMAL);
  text('Melhor Oferta', 260, statY + 45);
  text('Compradores', 440, statY + 45);
}

function drawFinalStats(y) {
  fill(0, 0, 0, 150);
  stroke(255, 107, 53, 80);
  strokeWeight(1);

  rect(120, y, 160, 60, 10);
  rect(300, y, 160, 60, 10);
  rect(480, y, 160, 60, 10);

  fill(255, 107, 53);
  textAlign(CENTER);
  textSize(16);
  textStyle(BOLD);
  text('R$ ' + gameData.valorFinal.toLocaleString('pt-BR'), 200, y + 25);
  text('R$ ' + gameData.lucro.toLocaleString('pt-BR'), 380, y + 25);
  text(floor((millis() - gameStartTime) / 60000) + ' min', 560, y + 25);

  fill(224, 225, 221);
  textSize(12);
  textStyle(NORMAL);
  text('Valor Total', 200, y + 45);
  text('Lucro Obtido', 380, y + 45);
  text('Tempo Total', 560, y + 45);
}

// --- Game Logic Functions ---

function updateProcess() {
  let elapsed = millis() - processStartTime;
  let duration = 5000; // Duration of each stage process

  progressValue = map(elapsed, 0, duration, 0, 100);
  progressValue = constrain(progressValue, 0, 100);

  if (currentStage === 1) {
    if (random() < 0.3) gameData.sacasColetadas += floor(random(1, 4));
    gameData.tempoColheita = floor(elapsed / 1000);
  } else if (currentStage === 2) {
    if (random() < 0.2) gameData.distanciaPercorrida += floor(random(1, 3));
    if (random() < 0.1) gameData.combustivel = max(0, gameData.combustivel - 1);
  } else if (currentStage === 3) {
    if (random() < 0.05) gameData.compradores++;
    if (random() < 0.2) gameData.precoOferta = floor(random(28000, 42000));
  }

  if (progressValue >= 100) {
    isProcessing = false;
    progressValue = 100;

    setTimeout(() => {
      nextStage();
    }, 1000); // Small delay before moving to the next stage
  }
}

function startHarvest() {
  if (isProcessing) return;
  isProcessing = true;
  processStartTime = millis();
  progressValue = 0;
  harvestButton.html('🚜 Colhendo...');
  harvestButton.attribute('disabled', '');
}

function startTransport() {
  if (isProcessing) return;
  isProcessing = true;
  processStartTime = millis();
  progressValue = 0;
  transportButton.html('🚛 Transportando...');
  transportButton.attribute('disabled', '');
}

function startNegotiation() {
  if (isProcessing) return;
  isProcessing = true;
  processStartTime = millis();
  progressValue = 0;
  negotiateButton.html('💰 Negociando...');
  negotiateButton.attribute('disabled', '');
}

function nextStage() {
  currentStage++;
  progressValue = 0;

  if (currentStage === 2) {
    harvestButton.hide();
    transportButton.show();
  } else if (currentStage === 3) {
    transportButton.hide();
    negotiateButton.show();
  } else if (currentStage === 4) {
    negotiateButton.hide();
    gameData.valorFinal = gameData.precoOferta;
    gameData.lucro = gameData.valorFinal - gameData.custoProducao;
    createCelebrationEffects();
    restartButton.show();
  }
}

function restartGame() {
  gameData = {
    sacasColetadas: 0,
    tempoColheita: 0,
    distanciaPercorrida: 0,
    combustivel: 100,
    precoOferta: 25000,
    compradores: 0,
    valorFinal: 0,
    lucro: 0,
    custoProducao: 12000,
  };

  currentStage = 1;
  gameStartTime = millis();
  progressValue = 0;
  isProcessing = false;
  confetti = [];
  fireworks = [];

  harvestButton.show();
  harvestButton.html('🚜 Começar Colheita');
  harvestButton.removeAttribute('disabled');

  transportButton.hide();
  transportButton.html('🛣️ Iniciar Viagem');
  transportButton.removeAttribute('disabled');

  negotiateButton.hide();
  negotiateButton.html('💰 Negociar Venda');
  negotiateButton.removeAttribute('disabled');

  restartButton.hide();
}

// --- Animation/Effect Functions ---

function createCelebrationEffects() {
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: random(width),
      y: -10,
      vx: random(-2, 2),
      vy: random(2, 6),
      color: random(['#FFD700', '#FF69B4', '#00CED1', '#32CD32', '#FF4500']),
      size: random(4, 8),
      rotation: 0,
      rotSpeed: random(-0.2, 0.2),
    });
  }

  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      createFirework(random(width), random(height * 0.6));
    }, i * 800);
  }
}

function createFirework(x, y) {
  let colors = ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff'];
  for (let i = 0; i < 12; i++) {
    let angle = (i * 30) * PI / 180;
    fireworks.push({
      x: x,
      y: y,
      vx: cos(angle) * random(3, 8),
      vy: sin(angle) * random(3, 8),
      color: random(colors),
      life: 1.0,
      decay: random(0.02, 0.04),
    });
  }
}

function updateConfetti() {
  for (let i = confetti.length - 1; i >= 0; i--) {
    let c = confetti[i];
    c.x += c.vx;
    c.y += c.vy;
    c.rotation += c.rotSpeed;

    if (c.y > height + 10) {
      confetti.splice(i, 1);
    }
  }
}

function updateFireworks() {
  for (let i = fireworks.length - 1; i >= 0; i--) {
    let f = fireworks[i];
    f.x += f.vx;
    f.y += f.vy;
    f.life -= f.decay;

    if (f.life <= 0) {
      fireworks.splice(i, 1);
    }
  }
}

function drawConfetti() {
  for (let c of confetti) {
    push();
    translate(c.x, c.y);
    rotate(c.rotation);
    fill(c.color);
    noStroke();
    rect(-c.size / 2, -c.size / 2, c.size, c.size);
    pop();
  }
}

function drawFireworks() {
  for (let f of fireworks) {
    push();
    fill(f.color);
    stroke(f.color);
    strokeWeight(3);
    let alpha = f.life * 255;
    fill(red(f.color), green(f.color), blue(f.color), alpha);
    ellipse(f.x, f.y, f.life * 8);
    pop();
  }
}