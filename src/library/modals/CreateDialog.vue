<template>
  <div>
    <h3> {{ title }}</h3>
    <div>
      Контакт: {{ name }}
    </div>
      <div class="modal__contact-line">
      <h3 style="margin: 0;">Куда пишем</h3>
      <select v-model="selectedContact" id="folder">
        <option v-for="contact in contacts" :value="contact">
          {{ contact.value }}
        </option>
      </select>
    </div>
    <div class="modal__channel-line">
      <h3 style="margin: 0;">Через какой канал</h3>
      <select v-model="selectedChannel" id="folder" >
        <option v-for="channel in channels" :value="channel">
          {{ channel.title }}
        </option>
      </select>
    </div>
    
    <button
      type="button"
      class="modal__button-start"
      aria-label="Close modal"
      :disabled="!allowStartDialog"
      @click="handleStartDialog"
    >
      Начать диалог
    </button>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';

// Define props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contacts: {
    type: Array,
    required: true,
  },
  channels: {
    type: Array,
    required: true,
  },

});

const selectedChannel = ref()
const selectedContact = ref()

const allowStartDialog = computed(() => {
  if (selectedChannel.value && selectedContact.value) return true
  return false
})

const emit = defineEmits(['change', 'submit']);

const handleStartDialog = () => {
  emit('change', {channel: selectedChannel.value, contact: selectedContact.value});
  emit('submit')
}

</script>

<style scoped lang="scss">



.modal{
  &__contact-line{
    display: flex;
    margin: 10px 0;
    justify-content: space-between;
  }

  &__channel-line{
    display: flex;
    margin: 10px 0;
    justify-content: space-between;
  }

  &__button-start{
    margin-left: calc(100% - 98px);
  }
}

</style>
