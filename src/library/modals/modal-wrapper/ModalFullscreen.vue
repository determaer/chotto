<template>
  <div
    class="modal__overlay"
    :data-theme="theme"
    @click="closeModalOutside"
    @keyup.esc="emit('close')"
  >
    <div class="modal__container">
      <button
        class="modal__close-button"
        @click="emit('close')"
      >
        <span>
          <i class="pi pi-times" />
        </span>
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
const props = defineProps({
  theme: {
    type: String,
    required: false,
    default: 'light'
  }
})

const emit = defineEmits(['close']);


const closeModalOutside = (evt) => {
  if (evt.target.classList.contains('modal__overlay')) {
    emit('close')
  }
}

const handleEscKey = (evt) => {
  if (evt.key === 'Escape') {
    emit('close')
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey);
});

</script>

<style scoped lang="scss">
.modal {
  &__container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    color: var(--chotto-primary-text-color);
    background-color: var(--chotto-modal-bg);
    border-radius: var(--chotto-modal-border-radius);
    padding: var(--chotto-modal-padding);
    max-width: 95%;
    width: fit-content;
    box-shadow: var(--chotto-modal-overlay-shadow);
  }
    
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--chotto-modal-mask-background);
    z-index: 1000;
  }

  &__close-button {
    display: block;
    background-color: transparent;
    border: none;
    padding: 4px;
    margin: 0 0 14px auto;
    cursor: pointer;

    span {
      color: var(--chotto-secondary-text-color);
      font-size: var(--chotto-button-icon-size);
    }
  }
}

  
</style>
