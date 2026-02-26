export class AsciiAssembleScene {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private asciiMatrix: { char: string, revealed: boolean }[][] = [];
  private revealOrder: { r: number, c: number }[] = [];
  private revealIndex = 0;
  private drops: { x: number, y: number, speed: number, size: number }[] = [];
  private offscreenCanvas: HTMLCanvasElement | null;
  private offscreenCtx: CanvasRenderingContext2D | null;
  private needsFullRedraw = true;

  // Constants
  private readonly REVEAL_SPEED_NORMAL = 20;
  private readonly REVEAL_SPEED_LOW_PERF = 10;
  private readonly BG_DROP_SPAWN_CHANCE = 0.975;
  private readonly FONT_SIZE_MOBILE = 8;
  private readonly FONT_SIZE_DESKTOP = 12;

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, asciiText: string, isLowPerf: boolean = false) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d')!;
    this.updateOffscreenSize();
    this.initBackground(isLowPerf);
    this.parseAscii(asciiText);
  }

  private updateOffscreenSize() {
    if (!this.offscreenCanvas) return;
    this.offscreenCanvas.width = this.canvas.width;
    this.offscreenCanvas.height = this.canvas.height;
    this.needsFullRedraw = true;
  }

  private getLayoutMetadata() {
    const fontSize = window.innerWidth < 768 ? this.FONT_SIZE_MOBILE : this.FONT_SIZE_DESKTOP;
    const charWidth = fontSize * 0.6;
    const charHeight = fontSize * 1.1;

    const totalHeight = this.asciiMatrix.length * charHeight;
    const totalWidth = (this.asciiMatrix[0]?.length || 0) * charWidth;

    const offsetX = (this.canvas.width - totalWidth) / 2;
    const offsetY = (this.canvas.height - totalHeight) / 2;

    return { fontSize, charWidth, charHeight, offsetX, offsetY };
  }

  private setupOffscreenContext(isSenior: boolean, isLowPerf: boolean, fontSize: number) {
    if (!this.offscreenCtx) return;
    const themeColor = isSenior ? '#FF4D4D' : '#33FF66';
    this.offscreenCtx.font = `bold ${fontSize}px JetBrains Mono`;
    this.offscreenCtx.textAlign = 'left';
    this.offscreenCtx.textBaseline = 'top';
    this.offscreenCtx.fillStyle = themeColor;

    if (!isLowPerf) {
      this.offscreenCtx.shadowColor = themeColor;
      this.offscreenCtx.shadowBlur = 4;
    } else {
      this.offscreenCtx.shadowBlur = 0;
    }
  }

  private redrawOffscreen(isSenior: boolean, isLowPerf: boolean) {
    if (!this.offscreenCtx || !this.offscreenCanvas) return;
    this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    if (this.asciiMatrix.length === 0) return;

    const { fontSize, charWidth, charHeight, offsetX, offsetY } = this.getLayoutMetadata();
    this.setupOffscreenContext(isSenior, isLowPerf, fontSize);

    this.asciiMatrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.revealed && cell.char !== ' ') {
          this.offscreenCtx?.fillText(cell.char, offsetX + c * charWidth, offsetY + r * charHeight);
        }
      });
    });
  }

  private initBackground(isLowPerf: boolean) {
    const columns = Math.floor(this.canvas.width / (isLowPerf ? 40 : 20));
    this.drops = [];
    for (let i = 0; i < columns; i++) {
      this.drops.push({
        x: i * (isLowPerf ? 40 : 20),
        y: Math.random() * -this.canvas.height,
        speed: 2 + Math.random() * 5,
        size: 10 + Math.random() * 20,
      });
    }
  }

  private parseAscii(text: string) {
    if (!text) return;
    const lines = text.split('\n').filter(l => l.trim() !== '' || l.length > 0);
    const maxWidth = Math.max(...lines.map(l => l.length));

    this.asciiMatrix = lines.map((line) => {
      return line.padEnd(maxWidth, ' ').split('').map((char) => ({
        char,
        revealed: false
      }));
    });

    this.revealOrder = [];
    for (let r = 0; r < this.asciiMatrix.length; r++) {
      const row = this.asciiMatrix[r];
      if (!row) continue;
      for (let c = 0; c < row.length; c++) {
        if (row[c]?.char !== ' ') {
          this.revealOrder.push({ r, c });
        }
      }
    }
    this.revealOrder.sort(() => Math.random() - 0.5);
    this.revealIndex = 0;
  }

  private drawBackgroundDrops(isSenior: boolean) {
    this.ctx.fillStyle = 'rgba(5, 6, 7, 0.15)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.drops.forEach(drop => {
      const char = chars[Math.floor(Math.random() * chars.length)] || '0';
      const alpha = Math.min(0.3, drop.size / 40);
      this.ctx.fillStyle = isSenior ? `rgba(255, 77, 77, ${alpha})` : `rgba(51, 255, 102, ${alpha})`;
      this.ctx.font = `${drop.size}px JetBrains Mono`;
      this.ctx.fillText(char, drop.x, drop.y);
      drop.y += drop.speed * (drop.size / 15);
      if (drop.y > this.canvas.height && Math.random() > this.BG_DROP_SPAWN_CHANCE) {
        drop.y = -drop.size;
      }
    });
  }

  public draw(isSenior: boolean, isLowPerf: boolean) {
    if (this.needsFullRedraw) {
      this.redrawOffscreen(isSenior, isLowPerf);
      this.needsFullRedraw = false;
    }

    this.drawBackgroundDrops(isSenior);

    if (this.asciiMatrix.length === 0) return;

    const { fontSize, charWidth, charHeight, offsetX, offsetY } = this.getLayoutMetadata();
    const revealSpeed = isLowPerf ? this.REVEAL_SPEED_LOW_PERF : this.REVEAL_SPEED_NORMAL;

    // Настройка offscreenCtx
    this.setupOffscreenContext(isSenior, isLowPerf, fontSize);

    // Постепенное раскрытие символов на offscreenCanvas
    for (let i = 0; i < revealSpeed && this.revealIndex < this.revealOrder.length; i++) {
      const order = this.revealOrder[this.revealIndex];
      if (order) {
        const { r, c } = order;
        const row = this.asciiMatrix[r];
        if (row && row[c]) {
          row[c].revealed = true;
          this.offscreenCtx?.fillText(row[c].char, offsetX + c * charWidth, offsetY + r * charHeight);
        }
      }
      this.revealIndex++;
    }

    // Отрисовка уже собранной картинки одним вызовом
    if (this.offscreenCanvas) {
      this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    }
  }

  public resize(isLowPerf: boolean) {
    this.updateOffscreenSize();
    this.initBackground(isLowPerf);
  }

  public dispose() {
    this.drops = [];
    this.asciiMatrix = [];
    this.revealOrder = [];
    this.offscreenCanvas = null;
    this.offscreenCtx = null;
  }
}
