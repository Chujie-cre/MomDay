<template>
  <div class="home-container">
    <div class="intro-title animate__animated animate__fadeIn">
      <!-- <h1>母亲节快乐</h1>
      <div class="intro-subtitle">珍贵的回忆</div> -->
    </div>

    <div class="photo-area">
      <div class="canvas-wrapper">
        <canvas ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" @touchstart="startDrawingTouch" @touchmove="drawTouch" @touchend="stopDrawing"></canvas>
        <!-- <div v-if="!animationTriggered" class="hint-text animate__animated animate__pulse animate__infinite">
          用手指轻轻擦拭照片，揭开美好回忆...
        </div> -->
      </div>
      <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
    </div>

    <!-- 小熊对话框 -->
    <div class="bear-container animate__animated animate__bounceIn">
      <div class="speech-bubble animate__animated animate__fadeIn" style="animation-delay: 1s;">
        <div class="speech-text">妈妈，用手指轻轻擦拭照片，会有惊喜哦~</div>
      </div>
      <img src="/bear1.png" alt="小熊" class="bear-image">
    </div>

    <!-- 装饰元素 -->
    <div class="decoration-flowers">
      <div class="flower flower-1"></div>
      <div class="flower flower-2"></div>
      <div class="flower flower-3"></div>
      <div class="flower flower-4"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      canvas: null,
      ctx: null,
      confettiCanvas: null,
      confettiCtx: null,
      isDrawing: false,
      lastX: 0, 
      lastY: 0,
      imageUrl: '/momandme.jpg',
      blurredImage: null,
      originalImage: null,
      revealPercent: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      confettiWidth: 0,
      confettiHeight: 0,
      animationTriggered: false,
      confetti: [],
      confettiColors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
      confettiAnimation: null
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext('2d')
    this.confettiCanvas = this.$refs.confettiCanvas
    this.confettiCtx = this.confettiCanvas.getContext('2d')
    this.setupCanvas()
    this.loadImages()
    
    // 监听窗口大小变化，重新设置canvas大小
    window.addEventListener('resize', this.setupCanvas)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setupCanvas)
    if (this.confettiAnimation) {
      cancelAnimationFrame(this.confettiAnimation)
    }
  },
  methods: {
    setupCanvas() {
      // 设置canvas大小为容器大小，而不是整个窗口
      const canvasWrapper = this.canvas.parentElement
      this.canvasWidth = canvasWrapper.clientWidth
      this.canvasHeight = canvasWrapper.clientHeight
      this.canvas.width = this.canvasWidth
      this.canvas.height = this.canvasHeight
      
      // 设置彩带canvas大小为窗口大小
      this.confettiWidth = window.innerWidth
      this.confettiHeight = window.innerHeight
      this.confettiCanvas.width = this.confettiWidth
      this.confettiCanvas.height = this.confettiHeight
      
      // 如果图片已加载，重绘图片
      if (this.blurredImage) {
        this.drawBlurredImage()
      }
    },
    loadImages() {
      // 加载原始图片
      this.originalImage = new Image()
      this.originalImage.src = this.imageUrl
      this.originalImage.onload = () => {
        // 创建模糊图片
        this.createBlurredImage()
      }
    },
    createBlurredImage() {
      // 创建离屏canvas用于制作模糊效果
      const offScreenCanvas = document.createElement('canvas')
      offScreenCanvas.width = this.originalImage.width
      offScreenCanvas.height = this.originalImage.height
      const offCtx = offScreenCanvas.getContext('2d')
      
      // 绘制原始图片
      offCtx.drawImage(this.originalImage, 0, 0)
      
      // 应用模糊滤镜
      offCtx.filter = 'blur(10px)'
      offCtx.globalAlpha = 0.8
      offCtx.drawImage(offScreenCanvas, 0, 0)
      offCtx.filter = 'none'
      
      // 创建模糊图片
      this.blurredImage = new Image()
      this.blurredImage.src = offScreenCanvas.toDataURL('image/jpeg')
      this.blurredImage.onload = () => {
        this.drawBlurredImage()
      }
    },
    drawBlurredImage() {
      // 清除画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      
      // 计算图片绘制的尺寸和位置（保持宽高比并居中）
      const imgRatio = this.blurredImage.width / this.blurredImage.height
      const canvasRatio = this.canvasWidth / this.canvasHeight
      let drawWidth, drawHeight, offsetX, offsetY
      
      if (canvasRatio > imgRatio) {
        // 画布更宽，图片高度适应画布高度
        drawHeight = this.canvasHeight
        drawWidth = drawHeight * imgRatio
        offsetX = (this.canvasWidth - drawWidth) / 2
        offsetY = 0
      } else {
        // 画布更高，图片宽度适应画布宽度
        drawWidth = this.canvasWidth
        drawHeight = drawWidth / imgRatio
        offsetX = 0
        offsetY = (this.canvasHeight - drawHeight) / 2
      }
      
      // 绘制模糊图片
      this.ctx.drawImage(this.blurredImage, offsetX, offsetY, drawWidth, drawHeight)
    },
    startDrawing(e) {
      this.isDrawing = true
      const rect = this.canvas.getBoundingClientRect()
      this.lastX = e.clientX - rect.left
      this.lastY = e.clientY - rect.top
    },
    startDrawingTouch(e) {
      e.preventDefault()
      if (e.touches.length === 1) {
        this.isDrawing = true
        const rect = this.canvas.getBoundingClientRect()
        this.lastX = e.touches[0].clientX - rect.left
        this.lastY = e.touches[0].clientY - rect.top
      }
    },
    draw(e) {
      if (!this.isDrawing) return
      
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      this.revealArea(x, y)
      
      this.lastX = x
      this.lastY = y
    },
    drawTouch(e) {
      e.preventDefault()
      if (!this.isDrawing || e.touches.length !== 1) return
      
      const rect = this.canvas.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const y = e.touches[0].clientY - rect.top
      
      this.revealArea(x, y)
      
      this.lastX = x
      this.lastY = y
    },
    revealArea(x, y) {
      // 计算图片绘制的尺寸和位置
      const imgRatio = this.originalImage.width / this.originalImage.height
      const canvasRatio = this.canvasWidth / this.canvasHeight
      let drawWidth, drawHeight, offsetX, offsetY
      
      if (canvasRatio > imgRatio) {
        drawHeight = this.canvasHeight
        drawWidth = drawHeight * imgRatio
        offsetX = (this.canvasWidth - drawWidth) / 2
        offsetY = 0
      } else {
        drawWidth = this.canvasWidth
        drawHeight = drawWidth / imgRatio
        offsetX = 0
        offsetY = (this.canvasHeight - drawHeight) / 2
      }
      
      // 在擦拭区域显示原始图片
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.arc(x, y, 40, 0, Math.PI * 2, false)
      this.ctx.clip()
      this.ctx.drawImage(this.originalImage, offsetX, offsetY, drawWidth, drawHeight)
      this.ctx.restore()
      
      // 计算已擦除的面积百分比
      this.calculateRevealPercent()
    },
    calculateRevealPercent() {
      // 如果已经触发过动画，直接返回
      if (this.animationTriggered) return
      
      // 创建一个临时canvas并获取像素数据
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = this.canvas.width
      tempCanvas.height = this.canvas.height
      const tempCtx = tempCanvas.getContext('2d')
      
      // 在临时canvas上绘制当前画布
      tempCtx.drawImage(this.canvas, 0, 0)
      
      // 计算图片区域的像素
      const imgRatio = this.originalImage.width / this.originalImage.height
      const canvasRatio = this.canvasWidth / this.canvasHeight
      let drawWidth, drawHeight, offsetX, offsetY
      
      if (canvasRatio > imgRatio) {
        drawHeight = this.canvasHeight
        drawWidth = drawHeight * imgRatio
        offsetX = (this.canvasWidth - drawWidth) / 2
        offsetY = 0
      } else {
        drawWidth = this.canvasWidth
        drawHeight = drawWidth / imgRatio
        offsetX = 0
        offsetY = (this.canvasHeight - drawHeight) / 2
      }
      
      // 只分析图片区域的像素
      const imageData = tempCtx.getImageData(offsetX, offsetY, drawWidth, drawHeight)
      const data = imageData.data
      
      // 计算原图和模糊图的差异
      let changedPixels = 0
      const totalPixels = drawWidth * drawHeight
      
      // 简化计算：采样检查每10个像素
      for (let i = 0; i < data.length; i += 40) {
        // 检查像素是否与模糊图像不同
        // 这里使用一个简单的启发式方法：检查像素亮度
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const brightness = (r + g + b) / 3
        
        // 如果亮度明显高于模糊图像的平均亮度，则认为是已擦除区域
        if (brightness > 100) {
          changedPixels++
        }
      }
      
      // 计算擦除百分比（采样后需要调整）
      const samplingFactor = 10
      this.revealPercent = (changedPixels * samplingFactor / totalPixels) * 100
      
      // 如果擦除达到阈值（例如30%），显示彩带并跳转
      if (this.revealPercent > 30) {
        // 设置标志位，确保动画只触发一次
        this.animationTriggered = true
        // 显示彩带动画，并完全展示清晰照片
        this.showClearImageAndConfetti()
      }
    },
    stopDrawing() {
      this.isDrawing = false
    },
    showClearImageAndConfetti() {
      // 显示完全清晰的图片
      this.showClearImage()
      // 开始彩带动画
      this.startConfetti()
      
      // 3秒后跳转到祝福页面
      setTimeout(() => {
        if (this.confettiAnimation) {
          cancelAnimationFrame(this.confettiAnimation)
        }
        this.$router.push('/celebration')
      }, 3000)
    },
    showClearImage() {
      // 清除画布并完全显示原始图片
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      
      // 计算图片绘制的尺寸和位置（保持宽高比并居中）
      const imgRatio = this.originalImage.width / this.originalImage.height
      const canvasRatio = this.canvasWidth / this.canvasHeight
      let drawWidth, drawHeight, offsetX, offsetY
      
      if (canvasRatio > imgRatio) {
        // 画布更宽，图片高度适应画布高度
        drawHeight = this.canvasHeight
        drawWidth = drawHeight * imgRatio
        offsetX = (this.canvasWidth - drawWidth) / 2
        offsetY = 0
      } else {
        // 画布更高，图片宽度适应画布宽度
        drawWidth = this.canvasWidth
        drawHeight = drawWidth / imgRatio
        offsetX = 0
        offsetY = (this.canvasHeight - drawHeight) / 2
      }
      
      // 绘制原始图片
      this.ctx.drawImage(this.originalImage, offsetX, offsetY, drawWidth, drawHeight)
    },
    startConfetti() {
      // 创建150个彩带粒子，使用confettiWidth而不是canvasWidth
      this.confetti = []
      for (let i = 0; i < 200; i++) {
        this.confetti.push({
          x: Math.random() * this.confettiWidth,
          y: -20,
          size: Math.random() * 10 + 5,
          color: this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)],
          speed: Math.random() * 5 + 2,
          wobble: Math.random() * 10,
          wobbleSpeed: Math.random() * 0.1 + 0.05,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5
        })
      }
      
      // 开始动画
      this.animateConfetti()
    },
    animateConfetti() {
      // 清除彩带画布
      this.confettiCtx.clearRect(0, 0, this.confettiWidth, this.confettiHeight)
      
      // 更新并绘制每个彩带
      for (let i = 0; i < this.confetti.length; i++) {
        const confetto = this.confetti[i]
        
        // 更新位置
        confetto.y += confetto.speed
        confetto.x += Math.sin(confetto.wobble) * 2
        confetto.wobble += confetto.wobbleSpeed
        confetto.rotation += confetto.rotationSpeed
        
        // 绘制彩带
        this.confettiCtx.save()
        this.confettiCtx.translate(confetto.x, confetto.y)
        this.confettiCtx.rotate(confetto.rotation * Math.PI / 180)
        this.confettiCtx.fillStyle = confetto.color
        this.confettiCtx.fillRect(-confetto.size / 2, -confetto.size / 2, confetto.size, confetto.size / 3)
        this.confettiCtx.restore()
        
        // 如果彩带飞出屏幕，重置到顶部
        if (confetto.y > this.confettiHeight) {
          this.confetti[i].y = -20
          this.confetti[i].x = Math.random() * this.confettiWidth
        }
      }
      
      // 继续动画循环
      this.confettiAnimation = requestAnimationFrame(this.animateConfetti)
    }
  }
}
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #ffcdd2, #f8bbd0, #e1bee7);
  overflow: hidden;
}

.intro-title {
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  z-index: 5;
}

.intro-title h1 {
  font-size: 3rem;
  color: #d81b60;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 5px;
}

.intro-subtitle {
  font-size: 1.5rem;
  color: #c2185b;
  font-style: italic;
}

.photo-area {
  position: relative;
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  z-index: 2;
}

.canvas-wrapper {
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* 4:3 宽高比 */
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  border: 10px solid white;
}

.canvas-wrapper canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.hint-text {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 20px;
  width: 80%;
  margin: 0 auto;
}

.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
}

/* 小熊和对话框样式 */
.bear-container {
  position: absolute;
  bottom: 20px;
  right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  z-index: 4;
}

.bear-image {
  width: 150px;
  height: auto;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
}

.speech-bubble {
  position: relative;
  background: white;
  border-radius: 15px;
  padding: 10px 15px;
  margin-bottom: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #333;
  max-width: 220px;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 30px;
  width: 20px;
  height: 20px;
  background: white;
  border-right: 2px solid #333;
  border-bottom: 2px solid #333;
  transform: rotate(45deg);
}

.speech-text {
  font-size: 1rem;
  font-weight: bold;
  color: #d81b60;
  font-family: 'Comic Sans MS', 'STHeiti', 'Microsoft YaHei', sans-serif;
}

/* 装饰花朵样式 */
.decoration-flowers .flower {
  position: absolute;
  width: 60px;
  height: 60px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.8;
  z-index: 1;
}

.flower-1 {
  top: 10%;
  left: 5%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23FF80AB' d='M50 10c-5 10-20 15-30 10s-15-20-10-30c10 5 30 5 40 20z'/%3E%3Cpath fill='%23FF80AB' d='M50 10c5 10 20 15 30 10s15-20 10-30c-10 5-30 5-40 20z'/%3E%3Cpath fill='%23FF80AB' d='M50 90c-5-10-20-15-30-10s-15 20-10 30c10-5 30-5 40-20z'/%3E%3Cpath fill='%23FF80AB' d='M50 90c5-10 20-15 30-10s15 20 10 30c-10-5-30-5-40-20z'/%3E%3Ccircle fill='%23FFEB3B' cx='50' cy='50' r='15'/%3E%3C/svg%3E");
  animation: float 6s ease-in-out infinite;
}

.flower-2 {
  top: 15%;
  right: 8%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23E1BEE7' d='M50 10c-5 10-20 15-30 10s-15-20-10-30c10 5 30 5 40 20z'/%3E%3Cpath fill='%23E1BEE7' d='M50 10c5 10 20 15 30 10s15-20 10-30c-10 5-30 5-40 20z'/%3E%3Cpath fill='%23E1BEE7' d='M50 90c-5-10-20-15-30-10s-15 20-10 30c10-5 30-5 40-20z'/%3E%3Cpath fill='%23E1BEE7' d='M50 90c5-10 20-15 30-10s15 20 10 30c-10-5-30-5-40-20z'/%3E%3Ccircle fill='%23FFEB3B' cx='50' cy='50' r='15'/%3E%3C/svg%3E");
  animation: float 7s ease-in-out infinite;
}

.flower-3 {
  bottom: 20%;
  left: 10%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23B2EBF2' d='M50 10c-5 10-20 15-30 10s-15-20-10-30c10 5 30 5 40 20z'/%3E%3Cpath fill='%23B2EBF2' d='M50 10c5 10 20 15 30 10s15-20 10-30c-10 5-30 5-40 20z'/%3E%3Cpath fill='%23B2EBF2' d='M50 90c-5-10-20-15-30-10s-15 20-10 30c10-5 30-5 40-20z'/%3E%3Cpath fill='%23B2EBF2' d='M50 90c5-10 20-15 30-10s15 20 10 30c-10-5-30-5-40-20z'/%3E%3Ccircle fill='%23FFEB3B' cx='50' cy='50' r='15'/%3E%3C/svg%3E");
  animation: float 5s ease-in-out infinite;
}

.flower-4 {
  bottom: 15%;
  right: 15%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFCCBC' d='M50 10c-5 10-20 15-30 10s-15-20-10-30c10 5 30 5 40 20z'/%3E%3Cpath fill='%23FFCCBC' d='M50 10c5 10 20 15 30 10s15-20 10-30c-10 5-30 5-40 20z'/%3E%3Cpath fill='%23FFCCBC' d='M50 90c-5-10-20-15-30-10s-15 20-10 30c10-5 30-5 40-20z'/%3E%3Cpath fill='%23FFCCBC' d='M50 90c5-10 20-15 30-10s15 20 10 30c-10-5-30-5-40-20z'/%3E%3Ccircle fill='%23FFEB3B' cx='50' cy='50' r='15'/%3E%3C/svg%3E");
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

@media (max-width: 768px) {
  .intro-title h1 {
    font-size: 2.2rem;
  }
  
  .intro-subtitle {
    font-size: 1.2rem;
  }
  
  .bear-container {
    bottom: 10px;
    right: 10px;
    width: 140px;
  }
  
  .bear-image {
    width: 120px;
  }
  
  .speech-bubble {
    max-width: 180px;
    padding: 8px 12px;
  }
  
  .speech-text {
    font-size: 0.9rem;
  }
  
  .hint-text {
    font-size: 1rem;
    bottom: 10px;
  }
  
  .decoration-flowers .flower {
    width: 40px;
    height: 40px;
  }
}
</style> 