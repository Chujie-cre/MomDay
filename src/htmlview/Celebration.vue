<template>
  <div class="celebration-container">
    <transition name="fade" mode="out-in">
      <div v-if="showText" class="greeting-text-container">
        <div class="greeting-text animate__animated animate__fadeIn">
          <span class="char animate__animated animate__fadeInDown" style="animation-delay: 0.1s;">母</span>
          <span class="char animate__animated animate__fadeInDown" style="animation-delay: 0.3s;">亲</span>
          <span class="char animate__animated animate__fadeInDown" style="animation-delay: 0.5s;">节</span>
          <span class="char animate__animated animate__fadeInDown" style="animation-delay: 0.7s;">快</span>
          <span class="char animate__animated animate__fadeInDown" style="animation-delay: 0.9s;">乐</span>
        </div>
      </div>
    </transition>
    
    <transition name="bounce">
      <div v-if="showEnvelope" class="main-content">
        <div class="envelope-wrapper">
          <div class="envelope-outer" @click="openLetter">
            <div class="envelope-shadow"></div>
            <div class="real-envelope">
              <div class="envelope-lid" :class="{ 'open': letterOpen }"></div>
              <div class="envelope-letter" :class="{ 'open': letterOpen }"></div>
              <div class="envelope-heart"></div>
            </div>
          </div>
        </div>
        
        <div class="bear-container">
          <div class="speech-bubble animate__animated animate__fadeIn" style="animation-delay: 1s;">
            <div class="speech-text">请点击信封</div>
          </div>
          <img src="/bear.png" alt="小熊" class="bear-image animate__animated animate__bounceIn" style="animation-delay: 0.5s;">
        </div>
      </div>
    </transition>
    
    <transition name="zoom">
      <div v-if="letterOpen" class="letter animate__animated animate__zoomIn">
        <div class="letter-content">
          <p class="letter-line animate__animated animate__fadeIn animate__delay-1s">我憎恨中式教育，但我爱你，也心疼你劳累的模样</p>
          <p class="letter-signature animate__animated animate__fadeIn animate__delay-2s">——爱你的儿子</p>
          <p class="letter-wish animate__animated animate__fadeIn animate__delay-3s">祝妈妈母亲节快乐，永远健康</p>
          <button @click="showModal = true" class="gift-button animate__animated animate__bounce animate__delay-4s">点击送礼物</button>
        </div>
      </div>
    </transition>

    <!-- 模态框 -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <button class="modal-close" @click="closeModal">×</button>
          <FaceSlider />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FaceSlider from './FaceSlider.vue'

export default {
  name: 'CelebrationPage',
  components: {
    FaceSlider
  },
  data() {
    return {
      showText: true,
      showEnvelope: false,
      letterOpen: false,
      showModal: false
    }
  },
  mounted() {
    // 3秒后文字淡出
    setTimeout(() => {
      // 添加渐隐动画类
      const charElements = document.querySelectorAll('.char')
      charElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.remove('animate__fadeInDown')
          el.classList.add('animate__fadeOutUp')
        }, 200 * index)
      })
      
      // 等待所有字符完成渐隐后隐藏文字容器
      setTimeout(() => {
        this.showText = false
        // 文字淡出后显示信封
        setTimeout(() => {
          this.showEnvelope = true
        }, 500)
      }, 1500)
    }, 3000)
  },
  methods: {
    openLetter() {
      if (!this.letterOpen) {
        this.letterOpen = true
      }
    },
    closeModal() {
      this.showModal = false
    }
  }
}
</script>

<style scoped>
.celebration-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ffcdd2, #f8bbd0, #e1bee7);
  position: relative;
  overflow: hidden;
}

.greeting-text-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.greeting-text {
  display: flex;
  justify-content: center;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  position: relative;
}

.char {
  font-size: 5rem;
  font-weight: bold;
  color: #d81b60;
  display: inline-block;
  margin: 0 0.1em;
  animation-duration: 1s !important;
  opacity: 0;
  transform-origin: center bottom;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.char:hover {
  transform: translateY(-10px) scale(1.1);
  color: #ff4081;
}

/* 主内容区布局 */
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
}

/* 信封样式 */
.envelope-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 180px; /* 为小熊留出空间 */
}

.envelope-outer {
  position: relative;
  width: 280px;
  height: 180px;
  cursor: pointer;
}

.envelope-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  transform: translateY(8px) translateX(5px);
  filter: blur(10px);
  z-index: 1;
}

.real-envelope {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #e53935;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transform-style: preserve-3d;
  transition: transform 0.3s;
  border: 5px solid white;
}

.real-envelope:hover {
  transform: translateY(-5px);
}

.envelope-lid {
  position: absolute;
  width: 0;
  height: 0;
  top: 0;
  left: 0;
  border-top: 90px solid #c62828;
  border-left: 135px solid transparent;
  border-right: 135px solid transparent;
  transform-origin: top;
  transition: transform 0.6s;
  z-index: 5;
}

.envelope-lid.open {
  transform: rotateX(180deg);
}

.envelope-letter {
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  background-color: white;
  transition: transform 0.6s 0.3s, top 0.6s 0.3s;
  z-index: 4;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-image: 
    linear-gradient(#f8f8f8 1px, transparent 1px),
    linear-gradient(90deg, #f8f8f8 1px, transparent 1px);
  background-size: 15px 15px;
}

.envelope-letter.open {
  top: -70%;
  transform: rotateX(5deg);
}

.envelope-heart {
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: white;
  transform: rotate(45deg);
  top: calc(50% - 20px);
  left: calc(50% - 20px);
  z-index: 6;
}

.envelope-heart:before,
.envelope-heart:after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
}

.envelope-heart:before {
  top: -20px;
  left: 0;
}

.envelope-heart:after {
  top: 0;
  left: -20px;
}

/* 小熊和对话框样式 */
.bear-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  height: 280px;
  position: relative;
  z-index: 20;
}

.bear-image {
  width: 150px;
  height: auto;
  z-index: 20;
}

.speech-bubble {
  position: relative;
  background: white;
  border-radius: 15px;
  padding: 10px 15px;
  margin-bottom: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #333;
  z-index: 21;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 20px;
  height: 20px;
  background: white;
  border-right: 2px solid #333;
  border-bottom: 2px solid #333;
  transform: translateX(-50%) rotate(45deg);
}

.speech-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #d81b60;
  white-space: nowrap;
  font-family: 'Comic Sans MS', 'STHeiti', 'Microsoft YaHei', sans-serif;
}

.letter {
  position: absolute;
  width: 520px;
  height: 330px;
  background-color: #f5e7cb;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 50;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: 
    linear-gradient(to bottom, rgba(165, 130, 80, 0.1) 1px, transparent 1px),
    linear-gradient(to right, rgba(165, 130, 80, 0.1) 1px, transparent 1px),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23a58250' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  background-size: 32px 32px, 32px 32px, 200px 200px;
  border: 1px solid rgba(165, 130, 80, 0.2);
}

.letter::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(transparent, transparent 31px, rgba(165, 130, 80, 0.3) 31px, rgba(165, 130, 80, 0.3) 32px);
  pointer-events: none;
  z-index: -1;
}

.letter-content {
  font-family: 'Kaiti', 'STKaiti', serif;
  color: #333;
  position: relative;
  z-index: 2;
  width: 100%;
}

.letter-line {
  font-size: 1.5rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.letter-signature {
  font-size: 1.2rem;
  text-align: right;
  font-style: italic;
  margin-bottom: 30px;
}

.letter-wish {
  font-size: 1.3rem;
  color: #e91e63;
  font-weight: bold;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 修复信封闪动问题 */
.bounce-enter-active {
  animation: bounce-in 0.8s;
}

.bounce-leave-active {
  animation: bounce-in 0.8s reverse;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.8s;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.1);
}

/* 礼物按钮样式 */
.gift-button {
  margin-top: 30px;
  padding: 12px 24px;
  background: linear-gradient(45deg, #ff6b6b, #e91e63);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3);
  transition: all 0.3s ease;
  animation-iteration-count: infinite;
  animation-duration: 2s;
}

.gift-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 15px rgba(233, 30, 99, 0.4);
}

.gift-button:active {
  transform: translateY(1px);
}

@media (max-width: 768px) {
  .char {
    font-size: 3rem;
  }
  
  .main-content {
    flex-direction: column;
  }
  
  .envelope-wrapper {
    margin-right: 0;
    margin-bottom: 180px;
  }
  
  .envelope-outer {
    width: 240px;
    height: 160px;
  }
  
  .envelope-lid {
    border-top: 80px solid #c62828;
    border-left: 120px solid transparent;
    border-right: 120px solid transparent;
  }
  
  .bear-container {
    position: absolute;
    bottom: 10px;
    width: 150px;
    height: 200px;
  }
  
  .bear-image {
    width: 100px;
  }
  
  .speech-text {
    font-size: 1rem;
  }
  
  .letter {
    width: 300px;
    height: 320px;
    padding: 15px;
    background-size: 24px 24px, 24px 24px, 150px 150px;
  }
  
  .letter-line {
    font-size: 1.2rem;
  }
  
  .letter-signature {
    font-size: 1rem;
  }
  
  .letter-wish {
    font-size: 1.1rem;
  }
  
  .modal-container {
    width: 95%;
    max-width: 95%;
    height: 480px;
  }
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-container {
  background: linear-gradient(to bottom right, #ffecb3, #ffcdd2);
  width: 95%;
  max-width: 750px;
  height: 720px;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  border: 2px solid #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  font-size: 28px;
  color: #e91e63;
  cursor: pointer;
  z-index: 110;
  width: 36px;
  height: 36px;
  line-height: 30px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: white;
  transform: scale(1.1);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 确保FaceSlider组件在模态框内充满空间 */
.modal-container :deep(.container) {
  width: 100%;
  height: 100%;
  min-height: auto !important;
  max-height: 100% !important;
  overflow: visible !important;
}

/* 移动设备适配 - 完全重设模态框尺寸和内部内容 */
@media (max-width: 768px) {
  .modal-container {
    width: 100%;
    max-width: 100%;
    height: 100%;
    border-radius: 0;
    margin: 0;
    padding: 0;
    border: none;
  }
  
  .modal-close {
    top: 15px;
    right: 15px;
    font-size: 24px;
    width: 36px;
    height: 36px;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 200;
  }
  
  /* 强制修改FaceSlider组件在移动设备上的样式 */
  .modal-container :deep(.container) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100% !important;
    min-height: 100% !important;
    width: 100% !important;
    overflow: visible !important;
  }
  
  .modal-container :deep(.content) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    margin: 0 !important;
    padding: 50px 20px 30px 20px !important;
    flex: 1;
    box-sizing: border-box;
  }
  
  .modal-container :deep(.title) {
    position: relative !important;
    top: 0 !important;
    font-size: 1.8rem !important;
    margin-bottom: 10px !important;
    text-align: center !important;
    width: 100% !important;
  }
  
  .modal-container :deep(.subtitle) {
    position: relative !important;
    top: 0 !important;
    font-size: 1.3rem !important;
    margin-bottom: 30px !important;
    text-align: center !important;
    width: 100% !important;
  }
  
  .modal-container :deep(.face-slider) {
    position: relative !important;
    width: 180px !important;
    height: 180px !important;
    top: auto !important;
    left: auto !important;
    transform: none !important;
    margin: 0 auto 30px auto !important;
  }
  
  .modal-container :deep(.button) {
    position: relative !important;
    margin: 10px !important;
    padding: 12px 24px !important;
    font-size: 1.1rem !important;
  }

  /* 创建一个按钮容器确保按钮并排显示 */
  .modal-container :deep(.content) {
    display: flex;
    flex-direction: column;
  }
  
  /* 确保小眼睛在移动设备上正确显示 */
  .modal-container :deep(.face-slider-eye) {
    width: 40px !important;
    height: 40px !important;
  }
}

/* 额外的小屏幕设备适配 */
@media (max-width: 480px) {
  .modal-container :deep(.title) {
    font-size: 1.5rem !important;
  }
  
  .modal-container :deep(.subtitle) {
    font-size: 1.1rem !important;
  }
  
  .modal-container :deep(.face-slider) {
    width: 150px !important;
    height: 150px !important;
  }
  
  .modal-container :deep(.button) {
    padding: 10px 20px !important;
    font-size: 1rem !important;
  }
}

/* 非常小的屏幕(老旧手机) */
@media (max-width: 360px) {
  .modal-container :deep(.face-slider) {
    width: 120px !important;
    height: 120px !important;
  }
  
  .modal-container :deep(.content) {
    padding: 40px 15px 20px 15px !important;
  }
}
</style> 