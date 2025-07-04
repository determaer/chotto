<template>
  <div
    :id="chatAppId"
    ref="element"
    class="float-window"
    :style="{
      left: floatWindowPosition.x + 'px',
      top: floatWindowPosition.y + 'px',
      userSelect: dragMode ? 'none' : 'auto',
      height: height,
      width: width,
      display: 'flex',
    }"
  >
    <div class="float-window__container">
      <div
        ref="container"
        class="float-window__controls"
        @mousedown="mouseDown"
        @mouseup="turnOffDragMode"
        @mouseleave="turnOffDragMode"
      >
        <img
          v-if="props.avatar"
          class="float-window__avatar"
          :src="props.avatar"
          :alt="props.title"
        >
        <p class="float-window__title">
          {{ props.title }}
        </p>
        <div style="margin-left: auto; display: flex;">
          <slot name="controls" />
          <button
            class="float-window__close-button"
            @click="$emit('close-window')"
          >
            <span class="pi pi-times" />
          </button>
        </div>
      </div>
      <div
        class="float-window__content"
        :style="{ height: contentHeight + 'px' }"
      >
        <slot name="default" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, useId, provide } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  height: String,
  width: String,
  extChatAppId: String,
});
const emit = defineEmits(["close-window", "get-size"]);

const floatWindowPosition = ref({ x: 0, y: 0 });
const element = ref(null);
const container = ref(null);
const dragMode = ref(false);
const initialX = ref(0);
const initialY = ref(0);
const contentHeight = ref(0);

const chatAppId = useId()
provide('chatAppId', chatAppId)
provide('extChatAppId', props.extChatAppId ? props.extChatAppId : '')

const centerWindow = () => {
  if (element.value) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const elementWidth = element.value.offsetWidth;
    const elementHeight = element.value.offsetHeight;

    floatWindowPosition.value.x = (windowWidth - elementWidth) / 2;
    floatWindowPosition.value.y = (windowHeight - elementHeight) / 2;
  }
};

const mouseDown = (e) => {
  dragMode.value = true;
  // Получение координат левого верхнего угла перемещаемого окна
  initialX.value = e.clientX - element.value.offsetLeft;
  initialY.value = e.clientY - element.value.offsetTop;
};

const turnOffDragMode = () => (dragMode.value = false);

const mouseMove = (e) => {
  if (dragMode.value) {
    // Вычисление позиции плавающего окна
    const positionX = e.clientX - initialX.value;
    const positionY = e.clientY - initialY.value;
    floatWindowPosition.value.x = positionX
    floatWindowPosition.value.y = positionY
  }
};

onMounted(() => {
  //Центрируем окно при монтировании
  //centerWindow();
  //окно монтируется в углу ближайшего блока с position отличным от static
  //позволяет более гибко позиционировать в пределах страницы
  document.addEventListener("mousemove", mouseMove);
  
  // Срабатывает, когда изменяется размер окна брузера, не дает выйти за границы плавающему окну. Перерасчет границ.
  window.addEventListener("resize", () => {
    if (element.value){
      floatWindowPosition.value.x = Math.max(
        0,
        Math.min(
          floatWindowPosition.value.x,
          window.innerWidth - element.value.offsetWidth
        )
      );
      floatWindowPosition.value.y = Math.max(
        0,
        Math.min(
          floatWindowPosition.value.y,
          window.innerHeight - element.value.offsetHeight
        )
      );
    }
  });

  contentHeight.value =
    element.value.offsetHeight - container.value.offsetHeight;
});
</script>

<style lang="scss">
.float-window {
  z-index: 1000;
  width: fit-content;
  position: absolute;

  &__container {
    width: 100%;
    height: 100%;
    position: absolute;
    font-weight: var(--chotto-container-font-weight);
    color: var(--chotto-primary-text-color);
    font-family: var(--chotto-container-font-family);
    box-shadow: var(--chotto-float-container-box-shadow);
    container: all / inline-size;
  }

  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: grab;
    padding: 18px 20px;
    background-color: var(--chotto-float-container-bg-header);
    border-top-left-radius: var(--chotto-float-container-border-radius-header);
    border-top-right-radius: var(--chotto-float-container-border-radius-header);
  }

  &__avatar {
    width: var(--chotto-avatar-small);
    height: var(--chotto-avatar-small);
    border-radius: 50%;
  }

  &__title {
    font-size: var(--chotto-title-font-size);
    font-weight: var(--chotto-title-font-weight);
    margin-left: 10px;
  }

  &__close-button {
    display: block;
    background-color: transparent;
    border: none;
    font-size: var(--chotto-button-icon-size);
    color: var(--chotto-secondary-text-color);
    width: fit-content;
    margin-left: auto;
    cursor: pointer;
  }


  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  input,
  button {
    font-family: var(--chotto-container-font-family);
  }

  p,
  h1,
  h2 {
    margin: 0;
  }

  a {
    text-decoration: none;
  }

}
</style>
