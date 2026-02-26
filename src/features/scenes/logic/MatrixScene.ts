export class MatrixScene {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private drops: { x: number, y: number, speed: number, size: number }[] = [];
  public speed = 1;

  // Constants
  private readonly DROP_RESET_CHANCE = 0.975;
  private readonly SPEED_STEP = 0.2;
  private readonly MAX_SPEED = 5;
  private readonly MIN_SPEED = 0.2;

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, isLowPerf: boolean = false) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.init(isLowPerf);
  }

  private init(isLowPerf: boolean) {
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

  public draw(isSenior: boolean, isLowPerf: boolean) {
    this.ctx.fillStyle = isLowPerf ? 'rgba(5, 6, 7, 0.3)' : 'rgba(5, 6, 7, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.drops.forEach(drop => {
      const char = chars[Math.floor(Math.random() * chars.length)] || '0';
      const alpha = Math.min(1, drop.size / 20);
      this.ctx.fillStyle = isSenior ? `rgba(255, 77, 77, ${alpha})` : `rgba(51, 255, 102, ${alpha})`;
      this.ctx.font = `${drop.size}px JetBrains Mono`;
      this.ctx.fillText(char, drop.x, drop.y);
      drop.y += drop.speed * this.speed * (drop.size / 15);
      if (drop.y > this.canvas.height && Math.random() > this.DROP_RESET_CHANCE) {
        drop.y = -drop.size;
      }
    });
  }

  public handleKeyDown(key: string) {
    if (key === 'ArrowUp') {
      this.speed = Math.min(this.speed + this.SPEED_STEP, this.MAX_SPEED);
    } else if (key === 'ArrowDown') {
      this.speed = Math.max(this.speed - this.SPEED_STEP, this.MIN_SPEED);
    }
  }

  public resize(isLowPerf: boolean) {
    this.init(isLowPerf);
  }

  public dispose() {
    this.drops = [];
  }
}
