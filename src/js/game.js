// =====================================================================
// 🌙 NÚCLEO OPERATIVO DEL JUEGO: MOON ARCADE MOTOR (FINAL SECURE EDITION)
// =====================================================================
(function() {

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    render: { pixelArt: true },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 750 }, debug: false }
    },
    scene: [MenuScene, GameScene, WinScene, LeaderboardScene, BirthdayScene]
};

const game = new Phaser.Game(config);

let musicaFondo = null;
let musicaSilenciada = false;

// UI Modals HTML/CSS Helpers
function abrirPromptArcade(titulo, mensaje, callback) {
    const contenedorJuego = document.getElementById('game-container') || document.body;
    const overlay = document.createElement('div');
    overlay.className = 'arcade-modal-overlay';
    
    overlay.innerHTML = `
        <div class="arcade-modal">
            <div class="arcade-title">${titulo}</div>
            <div class="arcade-msg">${mensaje}</div>
            <input type="text" class="arcade-input" id="arcadeInput" autofocus maxlength="12">
            <div class="arcade-btn-container">
                <button class="arcade-btn" id="arcadeOk">ACEPTAR</button>
                <button class="arcade-btn" id="arcadeCancel">CANCELAR</button>
            </div>
        </div>
    `;
    
    overlay.addEventListener('pointerdown', (e) => e.stopPropagation());
    overlay.addEventListener('mousedown', (e) => e.stopPropagation());
    overlay.addEventListener('mouseup', (e) => e.stopPropagation());
    
    contenedorJuego.appendChild(overlay);
    const inputElement = document.getElementById('arcadeInput');
    inputElement.focus();

    document.getElementById('arcadeOk').onclick = () => {
        const val = inputElement.value;
        overlay.remove();
        callback(val);
    };
    document.getElementById('arcadeCancel').onclick = () => {
        overlay.remove();
        callback(null);
    };
}

// =====================================================================
// ESCENA 1: MENÚ DE INICIO
// =====================================================================
function MenuScene() { Phaser.Scene.call(this, { key: 'MenuScene' }); }
MenuScene.prototype = Object.create(Phaser.Scene.prototype);
MenuScene.prototype.constructor = MenuScene;

MenuScene.prototype.create = function() {
    const fondo = this.add.graphics();
    fondo.fillGradientStyle(0x1a153a, 0x1a153a, 0xb03b7b, 0xb03b7b, 1);
    fondo.fillRect(0, 0, 800, 600);

    const luna = this.add.graphics();
    luna.fillStyle(0xffe57f, 1).fillCircle(120, 100, 40);
    luna.fillStyle(0x1a153a, 1).fillCircle(135, 85, 40); 

    for (let i = 0; i < 40; i++) {
        let e = this.add.rectangle(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 500), 3, 3, 0xffffff);
        this.tweens.add({ targets: e, alpha: 0.2, duration: Phaser.Math.Between(800, 1500), yoyo: true, repeat: -1 });
    }

    this.add.text(400, 220, 'MOON ARCADE 🌙', { fontFamily: '"Press Start 2P"', fontSize: '32px', fill: '#ffffff', stroke: '#1a153a', strokeThickness: 6 }).setOrigin(0.5);
    this.add.text(400, 280, '⚡ LLUVIA DE PUNTOS ⚡', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: '#ffb3d9' }).setOrigin(0.5);

    const btnJugar = this.add.rectangle(400, 400, 320, 50, 0x1a153a).setInteractive().setStrokeStyle(3, 0xffffff);
    const txtJugar = this.add.text(400, 400, 'INICIAR JUEGO', { fontFamily: '"Press Start 2P"', fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5);

    this.tweens.add({ targets: [btnJugar, txtJugar], scaleX: 1.04, scaleY: 1.04, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    btnJugar.on('pointerover', () => { btnJugar.setStrokeStyle(3, 0xffb3d9); txtJugar.setStyle({ fill: '#ffeb5c' }); });
    btnJugar.on('pointerout', () => { btnJugar.setStrokeStyle(3, 0xffffff); txtJugar.setStyle({ fill: '#ffffff' }); });
    btnJugar.on('pointerdown', () => this.scene.start('GameScene'));

    const btnLeaderboard = this.add.text(400, 480, '🏆 VER TABLA DE SCORES', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: '#ffeb5c' }).setOrigin(0.5).setInteractive();
    this.tweens.add({ targets: btnLeaderboard, alpha: 0.6, duration: 750, yoyo: true, repeat: -1 });
    btnLeaderboard.on('pointerover', () => btnLeaderboard.setStyle({ fill: '#ffffff' }));
    btnLeaderboard.on('pointerout', () => btnLeaderboard.setStyle({ fill: '#ffeb5c' }));
    btnLeaderboard.on('pointerdown', () => this.scene.start('LeaderboardScene'));
};

// =====================================================================
// ESCENA 2: GAMEPLAY PRINCIPAL
// =====================================================================
function GameScene() { Phaser.Scene.call(this, { key: 'GameScene' }); }
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;

GameScene.prototype.preload = function() {
    this.load.spritesheet('aylin', 'src/assets/aylin.png', { frameWidth: 24, frameHeight: 24 });
    this.load.image('zorro', 'src/assets/items/zorro.png');
    this.load.image('sally', 'src/assets/items/sally.png');
    this.load.image('bts', 'src/assets/items/BTS.png');
    this.load.image('gomita', 'src/assets/items/manzana.png');
    this.load.image('uno', 'src/assets/items/uno.png');

    this.load.image('suelo_base', 'img/mundo/FloatingIslands_Assets/AssetsPink/GroundTile2_Ground.png');
    this.load.image('arbol_rosa1', 'img/mundo/FloatingIslands_Assets/AssetsPink/Tree1.png');
    this.load.image('arbol_rosa3', 'img/mundo/FloatingIslands_Assets/AssetsPink/Tree3.png');
    this.load.image('arbusto1', 'img/mundo/FloatingIslands_Assets/AssetsPink/BackgroundBushes1.png');
    this.load.image('arbusto4', 'img/mundo/FloatingIslands_Assets/AssetsPink/BackgroundBushes4.png');
    this.load.image('poste', 'img/mundo/FloatingIslands_Assets/AssetsPink/Pole.png');
    this.load.image('puente_izq', 'img/mundo/FloatingIslands_Assets/AssetsPink/BridgeLeft.png');
    this.load.image('puente_cen', 'img/mundo/FloatingIslands_Assets/AssetsPink/BridgeMiddle.png');
    this.load.image('puente_der', 'img/mundo/FloatingIslands_Assets/AssetsPink/BridgeRight.png');
    this.load.image('edificio', 'img/mundo/FloatingIslands_Assets/AssetsPink/Building1_Front.png');
    this.load.image('planta5', 'img/mundo/FloatingIslands_Assets/AssetsPink/Plant5.png');

    this.load.audio('mammamia', 'src/music/mammamia8bits.mp3');
};

GameScene.prototype.create = function() {
    if (!musicaFondo) {
        musicaFondo = this.sound.add('mammamia', { loop: true, volume: 0.4 });
        musicaFondo.play();
        this.sound.mute = musicaSilenciada;
    }

    this.score = 0; this.targetScore = 100; this.timeLeft = 45; this.currentLevel = 1; this.baseSpeed = 160;
    this.touchLeft = false; this.touchRight = false;

    const fondoJuego = this.add.graphics();
    fondoJuego.fillGradientStyle(0x1a153a, 0x1a153a, 0xb03b7b, 0xb03b7b, 1);
    fondoJuego.fillRect(0, 0, 800, 600);

    const luna = this.add.graphics().setDepth(0);
    luna.fillStyle(0xffe57f, 1).fillCircle(120, 100, 40);
    luna.fillStyle(0x1a153a, 1).fillCircle(135, 85, 40); 

    for (let i = 0; i < 85; i++) {
        let e = this.add.rectangle(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 430), 2, 2, 0xffffff).setDepth(0);
        this.tweens.add({ targets: e, alpha: 0.1, duration: Phaser.Math.Between(600, 1600), yoyo: true, repeat: -1 });
    }

    if (!this.textures.exists('nube_arcade')) {
        let g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff, 0.35); g.fillRect(30, 0, 70, 14); g.fillRect(15, 14, 100, 14); g.fillRect(0, 28, 130, 14);
        g.generateTexture('nube_arcade', 130, 42);
    }
    this.nubesGrupo = this.add.group();
    [{ x: 200, y: 140, speed: -0.4 }, { x: 550, y: 70, speed: -0.7 }, { x: 850, y: 190, speed: -0.3 }].forEach(c => {
        let n = this.add.image(c.x, c.y, 'nube_arcade').setOrigin(0.5).setScale(1.5).setDepth(0);
        n.setData('speedX', c.speed); this.nubesGrupo.add(n);
    });

    this.platforms = this.physics.add.staticGroup();
    const PISO_Y = 550; 
    for (let i = -1; i <= 20; i++) {
        this.add.image(i * 52, PISO_Y, 'suelo_base').setOrigin(0.5, 0).setScale(3.5, 4.5).setDepth(2);
    }
    let floorCollider = this.add.rectangle(400, PISO_Y + 10, 800, 20, 0x000000, 0);
    this.physics.add.existing(floorCollider, true); this.platforms.add(floorCollider);

    this.add.image(260, PISO_Y, 'edificio').setOrigin(0.5, 1).setScale(3.2).setDepth(1).setAlpha(0.65);
    this.add.image(540, PISO_Y, 'edificio').setOrigin(0.5, 1).setScale(3.2).setDepth(1).setAlpha(0.65);
    this.add.image(110, PISO_Y + 55, 'arbol_rosa1').setOrigin(0.5, 1).setScale(3.2).setDepth(1);
    this.add.image(690, PISO_Y + 55, 'arbol_rosa3').setOrigin(0.5, 1).setScale(3.2).setDepth(1);
    this.add.image(210, PISO_Y, 'planta5').setOrigin(0.5, 1).setScale(2.8).setDepth(3);
    this.add.image(590, PISO_Y, 'planta5').setOrigin(0.5, 1).setScale(2.8).setDepth(3);

    for (let i = 50; i < 800; i += 180) {
        let bush = Phaser.Math.RND.pick(['arbusto1', 'arbusto4']);
        this.add.image(i, PISO_Y, bush).setOrigin(0.5, 1).setScale(3.5).setDepth(1);
    }
    this.add.image(40, PISO_Y, 'poste').setOrigin(0.5, 1).setScale(2.5).setDepth(1);
    this.add.image(760, PISO_Y, 'poste').setOrigin(0.5, 1).setScale(2.5).setDepth(1);

    let pScale = 2.5;
    this.add.image(400 - 65, PISO_Y, 'puente_izq').setOrigin(0.5, 1).setScale(pScale).setDepth(1);
    this.add.image(400, PISO_Y, 'puente_cen').setOrigin(0.5, 1).setScale(pScale).setDepth(1);
    this.add.image(400 + 65, PISO_Y, 'puente_der').setOrigin(0.5, 1).setScale(pScale).setDepth(1);

    this.player = this.physics.add.sprite(400, PISO_Y, 'aylin').setOrigin(0.5, 1).setDepth(5).setScale(2.8);
    this.player.setCollideWorldBounds(true); this.physics.add.collider(this.player, this.platforms);

    if (!this.anims.exists('run')) {
        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('aylin', { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('aylin', { start: 8, end: 15 }), frameRate: 12, repeat: -1 });
        this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('aylin', { start: 24, end: 31 }), frameRate: 12, repeat: 0 });
    }

    this.fallingItems = this.physics.add.group();
    this.spawnTimer = this.time.addEvent({ delay: 850, callback: this.spawnItem, callbackScope: this, loop: true });
    this.countdownTimer = this.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true });

    this.physics.add.overlap(this.player, this.fallingItems, this.catchObject, null, this);

    this.hudText = this.add.text(30, 30, `PUNTOS: 0/${this.targetScore} | LVL: ${this.currentLevel}`, { fontFamily: '"Press Start 2P"', fontSize: '13px', fill: '#ffffff' }).setDepth(100);
    this.timerText = this.add.text(30, 60, `TIEMPO: ${this.timeLeft}s`, { fontFamily: '"Press Start 2P"', fontSize: '13px', fill: '#ffeb5c' }).setDepth(100);

    const restartBtn = this.add.text(770, 30, '↻ REINICIAR', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: '#ffffff' }).setOrigin(1, 0).setInteractive().setDepth(100);
    restartBtn.on('pointerdown', () => this.scene.restart());

    const menuBtn = this.add.text(770, 60, '🏠 MENÚ', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: '#ffb3d9' }).setOrigin(1, 0).setInteractive().setDepth(100);
    menuBtn.on('pointerdown', () => { if(musicaFondo) { musicaFondo.stop(); musicaFondo = null; } this.scene.start('MenuScene'); });

    this.audioBtn = this.add.text(530, 30, musicaSilenciada ? '🔇 APAGADO' : '🔊 ENCENDIDO', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: musicaSilenciada ? '#ff6b6b' : '#6bff6b' }).setOrigin(1, 0).setInteractive().setDepth(100);
    this.audioBtn.on('pointerdown', () => {
        musicaSilenciada = !musicaSilenciada; this.sound.mute = musicaSilenciada;
        this.audioBtn.setText(musicaSilenciada ? '🔇 APAGADO' : '🔊 ENCENDIDO');
        this.audioBtn.setStyle({ fill: musicaSilenciada ? '#ff6b6b' : '#6bff6b' });
    });

    if (this.sys.game.device.input.touch && !this.sys.game.device.os.desktop) {
        let btnIzq = this.add.circle(70, 500, 45, 0xffffff, 0.2).setInteractive().setDepth(21);
        btnIzq.on('pointerdown', () => this.touchLeft = true); btnIzq.on('pointerup', () => this.touchLeft = false); btnIzq.on('pointerout', () => this.touchLeft = false);
        this.add.text(70, 500, '◀', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5).setDepth(22);

        let btnDer = this.add.circle(180, 500, 45, 0xffffff, 0.2).setInteractive().setDepth(21);
        btnDer.on('pointerdown', () => this.touchRight = true); btnDer.on('pointerup', () => this.touchRight = false); btnDer.on('pointerout', () => this.touchRight = false);
        this.add.text(180, 500, '▶', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5).setDepth(22);

        let btnJump = this.add.rectangle(700, 500, 110, 80, 0xffeb5c, 0.3).setInteractive().setDepth(21).setStrokeStyle(3, 0xffffff);
        this.add.text(700, 500, 'SALTO', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: '#ffffff' }).setOrigin(0.5).setDepth(22);
        btnJump.on('pointerdown', () => { if (this.player.body.touching.down) this.player.setVelocityY(-460); });
    }

    this.cursors = this.input.keyboard.createCursorKeys();
};

GameScene.prototype.update = function() {
    this.nubesGrupo.getChildren().forEach(nube => {
        nube.x += nube.getData('speedX');
        if (nube.x < -100) { nube.x = 900; nube.y = Phaser.Math.Between(50, 220); }
    });

    if (this.cursors.left.isDown || this.touchLeft) { this.player.setVelocityX(-320); this.player.flipX = true; }
    else if (this.cursors.right.isDown || this.touchRight) { this.player.setVelocityX(320); this.player.flipX = false; }
    else { this.player.setVelocityX(0); }

    if (this.cursors.up.isDown && this.player.body.touching.down) this.player.setVelocityY(-460);

    if (!this.player.body.touching.down) {
        if (!this.player.anims.currentAnim || this.player.anims.currentAnim.key !== 'jump') {
            this.player.anims.play('jump');
        }
    } else if (this.player.body.velocity.x !== 0) {
        this.player.anims.play('run', true);
    } else {
        this.player.anims.play('idle', true);
    }

    this.fallingItems.getChildren().forEach(item => { if (item.y > 620) item.destroy(); });
};

GameScene.prototype.spawnItem = function() {
    const pool = [
        { key: 'uno', points: 10, scale: 2.2 }, { key: 'gomita', points: 15, scale: 1.8 },
        { key: 'zorro', points: 20, scale: 2.5 }, { key: 'bts', points: 25, scale: 1.5 },
        { key: 'sally', points: 40, scale: 2.5 }
    ];
    const itemData = Phaser.Math.RND.pick(pool);
    let item = this.fallingItems.create(Phaser.Math.Between(40, 760), -30, itemData.key);
    item.setScale(itemData.scale).setOrigin(0.5, 0.5).setData('pointsValue', itemData.points);
    item.body.setAllowGravity(false); item.body.setSize(item.width * 0.5, item.height * 0.5); 

    let finalVelocity = (this.baseSpeed + Phaser.Math.Between(0, 60)) * (1 + (this.currentLevel - 1) * 0.22);
    item.setVelocityY(finalVelocity);
};

GameScene.prototype.catchObject = function(player, item) {
    const value = item.getData('pointsValue'); this.score += value;
    this.hudText.setText(`PUNTOS: ${this.score}/${this.targetScore} | LVL: ${this.currentLevel}`);

    let popupText = this.add.text(item.x, item.y - 20, `+${value}`, { fontFamily: '"Press Start 2P"', fontSize: '13px', fill: '#6bff6b', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setDepth(20);
    this.tweens.killTweensOf(item);
    this.tweens.add({ targets: popupText, y: popupText.y - 50, alpha: 0, duration: 450, onComplete: () => popupText.destroy() });
    item.destroy();
    if (this.score >= this.targetScore) this.nextLevelTransition();
};

GameScene.prototype.updateClock = function() {
    this.timeLeft--; this.timerText.setText(`TIEMPO: ${this.timeLeft}s`);
    if (this.timeLeft <= 0) { this.spawnTimer.remove(); this.countdownTimer.remove(); this.scene.start('WinScene', { finalScore: this.score, levelReached: this.currentLevel }); }
};

GameScene.prototype.nextLevelTransition = function() {
    this.currentLevel++;
    this.timeLeft = Math.max(45 - (this.currentLevel - 1) * 4, 15); 
    let brechaNivel = 100 + ((this.currentLevel - 1) * 50);
    this.targetScore = this.targetScore + brechaNivel; 
    this.cameras.main.flash(150, 107, 255, 184);
    this.hudText.setText(`PUNTOS: ${this.score}/${this.targetScore} | LVL: ${this.currentLevel}`);
};

// =====================================================================
// 🎬 ESCENA 3: PANTALLA DE RESULTADOS FINALES (SECURE VAULT MODE)
// =====================================================================
function WinScene() { Phaser.Scene.call(this, { key: 'WinScene' }); }
WinScene.prototype = Object.create(Phaser.Scene.prototype);
WinScene.prototype.constructor = WinScene;

WinScene.prototype.init = function(data) { this.finalScore = data.finalScore || 0; this.levelReached = data.levelReached || 1; };

WinScene.prototype.create = function() {
    this.cameras.main.setBackgroundColor('#1a153a');
    this.add.text(400, 150, '¡FIN DEL JUEGO! 🎮', { fontFamily: '"Press Start 2P"', fontSize: '22px', fill: '#ff6b6b' }).setOrigin(0.5);
    this.add.text(400, 230, `PUNTUACIÓN TOTAL: ${this.finalScore}`, { fontFamily: '"Press Start 2P"', fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 280, `LLEGASTE AL NIVEL: ${this.levelReached}`, { fontFamily: '"Press Start 2P"', fontSize: '12px', fill: '#ffeb5c' }).setOrigin(0.5);

    const btnRegistrar = this.add.rectangle(400, 360, 340, 40, 0x3b2d54).setInteractive().setStrokeStyle(2, 0xffeb5c);
    this.add.text(400, 360, '⌨️ REGISTRAR MIS PUNTOS', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: '#ffffff' }).setOrigin(0.5);
    btnRegistrar.on('pointerdown', () => {
        abrirPromptArcade('⌨️ NUEVA MARCA', 'Ingresa tus iniciales para el Top (Max 6 letras):', async (nick) => {
            if (nick && nick.trim() !== "") {
                await GestorScores.registrarNuevoScore(nick, this.finalScore);
                this.scene.start('LeaderboardScene');
            }
        });
    });

    const btnVerTabla = this.add.text(400, 430, '🏆 VER TABLA DE SCORES', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: '#ffb3d9' }).setOrigin(0.5).setInteractive();
    btnVerTabla.on('pointerdown', () => this.scene.start('LeaderboardScene'));

    const retryBtn = this.add.text(400, 490, '< VOLVER A JUGAR >', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: '#ffffff' }).setOrigin(0.5).setInteractive();
    retryBtn.on('pointerdown', () => this.scene.start('GameScene'));

    // 🔒 100% CORREGIDO: Removido 'window.' de la llamada de Supabase para enlazar de forma nativa a la instancia remota
    const btnSecreto = this.add.text(770, 560, '[ 🔑 ]', { fontFamily: '"Press Start 2P"', fontSize: '10px', fill: '#2a1f4d' }).setOrigin(1, 1).setInteractive();
    btnSecreto.on('pointerdown', () => {
        if (localStorage.getItem('vault_permanently_locked') === 'true') {
            abrirPromptArcade('🚨 ACCESO DENEGADO', 'SISTEMA BLOQUEADO PERMANENTEMENTE.', () => {});
            return;
        }

        abrirPromptArcade('🔒', 'Introduce el código de acceso remoto:', async (llave) => {
            if (!llave || llave.trim() === '') return;

            if (supabaseClient) {
                const { data, error } = await supabaseClient.rpc('check_vault_code', { 
                    input_code: llave.toLowerCase().trim() 
                });

                if (!error && data !== null) {
                    localStorage.setItem('vault_fail_attempts', '0');
                    this.scene.start('BirthdayScene', { cartaRemota: data });
                } else {
                    let fallos = parseInt(localStorage.getItem('vault_fail_attempts') || '0') + 1;
                    localStorage.setItem('vault_fail_attempts', fallos.toString());

                    if (fallos >= 3) {
                        localStorage.setItem('vault_permanently_locked', 'true');
                        abrirPromptArcade('🚨 DISPOSITIVO BLOQUEADO', 'EXCESO DE INTENTOS. CONTACTA AL ADMINISTRADOR.', () => {});
                    } else {
                        abrirPromptArcade('❌ ERROR DE LLAVE', `CÓDIGO INVÁLIDO. INTENTOS RESTANTES: ${3 - fallos}/3`, () => {});
                    }
                }
            }
        });
    });
};

// =====================================================================
// ESCENA 4: TABLA DE SCORES RETRO (LEADERBOARD)
// =====================================================================
function LeaderboardScene() { Phaser.Scene.call(this, { key: 'LeaderboardScene' }); }
LeaderboardScene.prototype = Object.create(Phaser.Scene.prototype);
LeaderboardScene.prototype.constructor = LeaderboardScene;

LeaderboardScene.prototype.create = function() {
    this.cameras.main.setBackgroundColor('#110d26');
    this.add.text(400, 80, 'TOP 7 ARCADE MARKS', { fontFamily: '"Press Start 2P"', fontSize: '18px', fill: '#ffeb5c' }).setOrigin(0.5);

    const volverBtn = this.add.text(400, 530, '◀ VOLVER AL MENÚ', { fontFamily: '"Press Start 2P"', fontSize: '11px', fill: '#ffffff' }).setOrigin(0.5).setInteractive();
    volverBtn.on('pointerdown', () => this.scene.start('MenuScene'));

    GestorScores.obtenerTopScores().then(scores => {
        scores.forEach((entry, index) => {
            let yPos = 160 + (index * 45);
            this.add.text(250, yPos, `${index + 1}. ${entry.name}`, { fontFamily: '"Press Start 2P"', fontSize: '14px', fill: '#ffffff' });
            this.add.text(550, yPos, `${entry.score} PTS`, { fontFamily: '"Press Start 2P"', fontSize: '14px', fill: '#ffb3d9' }).setOrigin(1, 0);
        });
    });
};

// =====================================================================
// ESCENA OCULTA 5: PANTALLA DE CUMPLE (SECURE CODES)
// =====================================================================
function BirthdayScene() { Phaser.Scene.call(this, { key: 'BirthdayScene' }); }
BirthdayScene.prototype = Object.create(Phaser.Scene.prototype);
BirthdayScene.prototype.constructor = BirthdayScene;

BirthdayScene.prototype.init = function(data) { 
    this.cartaSopresa = data.cartaRemota || "Error crítico: No se pudo verificar el paquete de datos."; 
};

BirthdayScene.prototype.create = function() {
    this.cameras.main.setBackgroundColor('#000000');
    for (let i = 0; i < 20; i++) {
        let tx = Phaser.Math.Between(50, 750), ty = Phaser.Math.Between(50, 550);
        let cor = this.add.text(tx, ty, '💜', { fontSize: '16px' }).setAlpha(0.3);
        this.tweens.add({ targets: cor, y: ty - 30, duration: Phaser.Math.Between(1000, 2000), yoyo: true, repeat: -1 });
    }

    this.add.text(400, 130, '¡FELIZ CUMPLEAÑOS, FLACA! 🎂🎉', { fontFamily: '"Press Start 2P"', fontSize: '20px', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
    this.add.text(400, 360, this.cartaSopresa, { fontFamily: '"Press Start 2P"', fontSize: '10px', fill: '#ffb3d9', align: 'center', lineHeight: 1.9 }).setOrigin(0.5);
    
    const salirOculto = this.add.text(400, 540, '< CERRAR >', { fontFamily: '"Press Start 2P"', fontSize: '9px', fill: '#555555' }).setOrigin(0.5).setInteractive();
    salirOculto.on('pointerdown', () => this.scene.start('MenuScene'));
};

})();