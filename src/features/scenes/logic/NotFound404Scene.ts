/**
 * NotFound404Scene — fullscreen 2D canvas сцена для 404 страницы.
 * Рисует большой текст "404" с постоянным глитч-эффектом:
 * RGB-расслоение, случайные горизонтальные сдвиги полос,
 * мусорные символы и screen tearing.
 */
export class NotFound404Scene {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private frame = 0

  // Глитч-параметры
  private readonly GLITCH_INTENSITY = 0.15
  private readonly TEAR_CHANCE = 0.08
  private readonly GARBAGE_CHARS = '█▓▒░╗╔╚╝║═@#$%&?!<>{}[]^~¤§±×÷'
  private subText = 'ROUTE_NOT_FOUND'

  // ASCII-арт "404"
  private readonly ASCII_404 = [
    ' ██╗  ██╗ ██████╗ ██╗  ██╗',
    ' ██║  ██║██╔═████╗██║  ██║',
    ' ███████║██║██╔██║███████║',
    ' ╚════██║████╔╝██║╚════██║',
    '      ██║╚██████╔╝     ██║',
    '      ╚═╝ ╚═════╝      ╚═╝',
  ]

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, _isLowPerf: boolean = false, subText?: string) {
    this.ctx = ctx
    this.canvas = canvas
    if (subText) this.subText = subText
  }

  public draw(isSenior: boolean, isLowPerf: boolean) {
    const { ctx, canvas } = this
    const w = canvas.width
    const h = canvas.height
    this.frame++

    // Фон с лёгким затуханием
    ctx.fillStyle = 'rgba(5, 6, 7, 0.85)'
    ctx.fillRect(0, 0, w, h)

    const baseColor = isSenior ? [255, 77, 77] : [51, 255, 102]

    // Вычисляем размер шрифта для ASCII-арта на основе ширины canvas
    const maxLineLen = Math.max(...this.ASCII_404.map(l => l.length))
    const charW = Math.min(w * 0.8 / maxLineLen, 24)
    const fontSize = Math.max(10, Math.floor(charW * 1.6))
    const subFontSize = Math.max(12, fontSize * 0.75)

    // --- Основной ASCII "404" ---
    ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    const lineHeight = fontSize * 1.15
    const blockHeight = this.ASCII_404.length * lineHeight
    const blockWidth = maxLineLen * (fontSize * 0.6)
    const startX = (w - blockWidth) / 2
    const startY = (h - blockHeight) / 2 - subFontSize * 0.5

    // Глитч: случайный сдвиг основного текста
    const glitchActive = Math.random() < this.GLITCH_INTENSITY
    const shiftX = glitchActive ? (Math.random() - 0.5) * fontSize * 0.3 : 0
    const shiftY = glitchActive ? (Math.random() - 0.5) * 6 : 0

    for (let row = 0; row < this.ASCII_404.length; row++) {
      const line = this.ASCII_404[row]!
      const ly = startY + row * lineHeight

      // Построчный глитч-сдвиг
      const rowShift = glitchActive && Math.random() < 0.3
        ? (Math.random() - 0.5) * 12
        : 0

      // Глитч: иногда заменяем символы в строке мусором
      let displayLine = line
      if (glitchActive && Math.random() < 0.4) {
        const chars = displayLine.split('')
        const replaceCount = 1 + Math.floor(Math.random() * 3)
        for (let i = 0; i < replaceCount; i++) {
          const idx = Math.floor(Math.random() * chars.length)
          if (chars[idx] !== ' ') {
            chars[idx] = this.GARBAGE_CHARS[Math.floor(Math.random() * this.GARBAGE_CHARS.length)] || '?'
          }
        }
        displayLine = chars.join('')
      }

      if (!isLowPerf) {
        // RGB split — красный канал (сдвинут влево)
        const rgbOffset = glitchActive ? 2 + Math.random() * 4 : 1
        ctx.globalAlpha = 0.4
        ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'
        ctx.fillText(displayLine, startX + shiftX + rowShift - rgbOffset, ly + shiftY)

        // Cyan канал (сдвинут вправо)
        ctx.fillStyle = 'rgba(0, 255, 255, 0.4)'
        ctx.fillText(displayLine, startX + shiftX + rowShift + rgbOffset, ly + shiftY)
        ctx.globalAlpha = 1.0
      }

      // Основной цвет
      ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.9)`
      ctx.fillText(displayLine, startX + shiftX + rowShift, ly + shiftY)
    }

    // --- Screen tearing полосы ---
    if (!isLowPerf && Math.random() < this.TEAR_CHANCE) {
      const tearCount = 1 + Math.floor(Math.random() * 3)
      for (let i = 0; i < tearCount; i++) {
        const tearY = Math.random() * h
        const tearH = 2 + Math.random() * 8
        const tearShift = (Math.random() - 0.5) * 40

        // Копируем полосу и сдвигаем
        const imageData = ctx.getImageData(0, Math.floor(tearY), w, Math.floor(tearH))
        ctx.putImageData(imageData, Math.floor(tearShift), Math.floor(tearY))
      }
    }

    // --- Мусорные символы вокруг ---
    if (!isLowPerf) {
      const garbageCount = glitchActive ? 8 + Math.floor(Math.random() * 12) : 2 + Math.floor(Math.random() * 4)
      ctx.font = `${Math.max(10, fontSize * 0.5)}px "JetBrains Mono", monospace`
      for (let i = 0; i < garbageCount; i++) {
        const gx = Math.random() * w
        const gy = Math.random() * h
        const char = this.GARBAGE_CHARS[Math.floor(Math.random() * this.GARBAGE_CHARS.length)] || '?'
        const alpha = 0.1 + Math.random() * 0.4
        ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha})`
        ctx.fillText(char, gx, gy)
      }
    }

    // --- Подтекст "ROUTE_NOT_FOUND" ---
    ctx.font = `${subFontSize}px "JetBrains Mono", monospace`
    ctx.textAlign = 'center'

    const subY = startY + blockHeight + subFontSize * 1.5
    const subAlpha = 0.5 + Math.sin(this.frame * 0.05) * 0.2
    const centerX = w / 2

    // Глитч для подтекста — иногда заменяем символы мусором
    let displaySub = this.subText
    if (glitchActive) {
      const chars = displaySub.split('')
      const replaceCount = 1 + Math.floor(Math.random() * 4)
      for (let i = 0; i < replaceCount; i++) {
        const idx = Math.floor(Math.random() * chars.length)
        chars[idx] = this.GARBAGE_CHARS[Math.floor(Math.random() * this.GARBAGE_CHARS.length)] || '?'
      }
      displaySub = chars.join('')
    }

    ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${subAlpha})`
    ctx.fillText(displaySub, centerX + (glitchActive ? (Math.random() - 0.5) * 6 : 0), subY)

    // --- Горизонтальные scanlines (лёгкие) ---
    if (!isLowPerf && this.frame % 2 === 0) {
      ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.015)`
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1)
      }
    }
  }

  public resize(_isLowPerf: boolean) {
    // Ничего специального — размеры обновляются через canvas напрямую
  }

  public dispose() {
    // Нет ресурсов для очистки
  }
}
