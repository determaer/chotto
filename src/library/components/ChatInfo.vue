<template>
  <div
    v-if="chat"
    class="chat-info__container"
  >
    <div class="chat-info__base-line">
      <div class="chat-info__avatar-container">
      <img
        v-if="props.chat.avatar"
        :src="props.chat.avatar"
        width="48"
        height="48"
      >
      <span
        v-else
        class="pi pi-user"
      />
    </div>
    <div class="chat-info__info-container">
      <h2 class="chat-info__title">
        {{ chat.name }}
      </h2>
      <p
        v-if="chat['lastActivity.time']"
        class="chat-info__time"
      >
        {{ chat['lastActivity.time'] }}
      </p>
    </div>
    <div class="chat-info__actions">
      <slot name="actions" />
    </div>
    </div>
    

    <div 
      class="chat-info__search-panel"
      :id="'chat-info-search-panel-' + chatAppId"  
    >
    </div>
  </div>
  
</template>

<script setup>
import { inject } from 'vue';
// Define props
const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['open-panel']);

const chatAppId = inject('chatAppId')

</script>

<style
  scoped
  lang="scss"
>
.chat-info {
  &__container {
    border-radius: var(--chat-info-border-radius);
    padding: var(--chat-info-padding);
    border-bottom: var(--chat-info-border);
  }

  &__base-line{
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--neutral-300);
    width: var(--avatar-width-medium);
    height: var(--avatar-height-medium);
    border-radius: var(--avatar-border-radius);
    background-size: cover;

    span {
      font-size: var(--avatar-icon-size-medium);
      color: var(--neutral-500);
    }

    img {
      border-radius: var(--avatar-border-radius);
      object-fit: cover;
    }
  }

  &__info-container {
    display: flex;
    flex-direction: column;
  }

  &__title {
    grid-column: 2;
    font-weight: var(--chat-info-font-weight-title);
    font-size: var(--chat-info-font-size-title);
    margin: 0;
  }

  &__time {
    font-size: 14px;
    font-weight: var(--chat-info-font-weight-time);
    color: var(--neutral-400);
    grid-column: 2;
    margin: 0;
  }

  &__actions {
    margin-left: auto;
    background-color: transparent;
    border: none;
    grid-column: 3;
    grid-row: 1 / 3;
    cursor: pointer;

    span {
      font-size: var(--icon-font-size-medium);
      color: var(--neutral-600);
    }
  }
}
</style>
