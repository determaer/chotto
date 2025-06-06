<template>
  <div class="typing-message__container">
    <img
      v-if="message.avatar"
      class="typing-message__avatar"
      :src="message.avatar"
      height="32"
      width="32"
      :style="{ gridRow: message.subText ? '2' : '1' }"
    >
    <p
      v-if="message.subText"
      class="typing-message__subtext"
    >
      {{ message.subText }}
    </p>

    <div class="typing-message__loader-container">
      <div class="typing-message__loader" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { ITypingMessage } from '../../types';

const props = defineProps({
  message: {
    type: Object as () => ITypingMessage,
    required: true,
  },
});
</script>

<style
  scoped
  lang="scss"
>
.typing-message {
  &__container {
    display: grid;
    grid-template-columns: min-content 1fr;
    position: relative;
    margin: var(--chotto-message-margin);
  }

  &__subtext {
    grid-column: 2;
    grid-row: 1;
    margin: 0 0 2px 10px;
    font-size: var(--chotto-additional-text-font-size);
    color: var(--chotto-secondary-text-color);
  }

  &__avatar {
    align-self: center;
    object-fit: cover;
    min-width: var(--chotto-avatar-small);
    min-height: var(--chotto-avatar-small);
    border-radius: var(--chotto-avatar-border-radius);
    grid-column: 1;
    grid-row: 2;
    margin-right: 12px;
  }

  &__loader-container {
    min-height: 40px;
    grid-column: 2;
    border-radius: 10px;
    padding: 6px 6px 6px 6px;
    max-width: 80px;
    background-color: var(--chotto-message-left-bg);
  }

  &__loader {
    width: 8px;
    height: 8px;
    position: absolute;
    top: 50%;
    border-radius: 50%;
    position: relative;
    animation: typing-message__loader 0.8s 0.25s ease alternate infinite;
    margin: -20px auto 0;

    &::after,
    &::before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: typing-message__loader 0.8s ease alternate infinite;
    }

    &::before {
      left: -20px;
      animation-delay: 0.1s;
    }

    &::after {
      right: -20px;
      animation-delay: 0.4s;
    }
  }

  @keyframes typing-message__loader {
    0% {
      box-shadow: 0 15px 0 -15px var(--chotto-secondary-text-color);
    }

    100% {
      box-shadow: 0 15px 0 var(--chotto-secondary-text-color);
    }
  }
}
</style>
