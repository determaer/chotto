<template>
  <div class="chat-app">
    <div class="chat-app__container">
      <div class="chat-app__left-bar">
        <SideBar
          :sidebar-items="sidebarItems"
          @select-item="selectItem"
        />
      </div>
      <div class="chat-app__center-bar">
        <UserProfile
          class="chat-app__profile"
          :user="userProfile"
        />
        <ChatList
          class="chat-app__chat-list"
          :chats="chatsStore.chats"
          filter-enabled
          @select="selectChat"
          @action="chatAction"
        />
        <ThemeMode :themes="themes" />
      </div>

      <div
        class="chat-app__right-bar"
        :style="{ gridColumn: isOpenChatPanel ? '3' : '3 / 5', }"
      >
        <div
          v-if="selectedChat"
          class="chat-app__right-bar-container"
        >
          <ChatInfo
            :chat="selectedChat"
            @open-panel="isOpenChatPanel = !isOpenChatPanel"
          />
          <Feed
            :objects="messages"
            :style="{ padding: isOpenChatPanel ? '0 20px 10px 20px' : '0 80px 10px 80px' }"
            @message-action="messageAction"
            @load-more="loadMore"
          />
          <ChatInput
            :enable-emoji="true"
            :channels="channels"
            @send="addMessage"
          />
        </div>
        <p
          v-else
          class="chat-app__welcome-text"
        >
          Выберите контакт для начала общения
        </p>
      </div>

      <ChatPanel
        v-if="isOpenChatPanel"
        class="chat-app__chat-panel"
        :title="selectedChat.name"
        @close-panel="isOpenChatPanel = !isOpenChatPanel"
      >
        <template #content>
          test
        </template>
      </ChatPanel>
    </div>
    <SelectUser
      v-if="modalShow"
      :title="modalTitle"
      :users="users"
      @confirm="selectUsers"
      @close="onCloseModal"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

import {
  ChatInfo,
  ChatInput,
  ChatList,
  Feed,
  UserProfile,
  FileUploader,
  ThemeMode,
  SideBar,
  ChatPanel,
  // FloatWindow,
  SelectUser,
} from "./components";

import {
  formatTimestamp,
  insertDaySeparators,
  playNotificationAudio,
  sortByTimestamp,
} from './helpers';

import { useChatsStore } from './stores/useChatStore';
import { transformToFeed } from './transform/transformToFeed';


// Define props
const props = defineProps({
  authProvider: {
    type: Object,
    required: true,
  },
  dataProvider: {
    type: Object,
    required: true,
  },
  eventor: {
    type: Object,
    required: true,
  },
});

const themes = [
  {
    code: 'light',
    name: 'Light',
  },
  {
    code: 'dark',
    name: 'Dark',
  },
  {
    code: 'green',
    name: 'Green',
  },
  {
    code: 'diamond',
    name: 'Diamond',
  },
];



const chatsStore = useChatsStore();

// Reactive data
const selectedChat = ref(null);
const messages = ref([]);
const userProfile = ref({});
const channels = ref([]);
const sidebarItems = ref([])

const isOpenChatPanel = ref(false)
const isOpenFloatWindow = ref(true)

const modalShow = ref(false);
const modalTitle = ref('');
const users = ref([]);

const chatApp = ref(null);

const chatAppSize = ref({
  width: 0,
  height: 0
})

const updateChatAppSize = () => {
  return chatAppSize.value = {
    width: chatApp.value.offsetWidth,
    height: chatApp.value.offsetHeight
  }
}

const selectItem = (item) => {
  console.log('selected sidebar item', item.itemId);
  const selectedItem = sidebarItems.value.find(i => i.itemId === item.itemId);
  sidebarItems.value.map(si => si.selected = false);
  selectedItem.selected = true;
};

const chatAction = (data) => {
  console.log('chat action', data);
  if (data.action === 'add') {
    modalTitle.value = `Добавить в чат ${data.chatId}`;
    users.value = getUsers();
    modalShow.value = true;
  }
}

const selectUsers = (users) => {
  console.log('users selected', users);
}

const onCloseModal = () => {
  modalShow.value = false;
}

const messageAction = (data) => {
  console.log('message action', data);
}

const getUsers = () => {
  return props.dataProvider.getUsers();
  // return (props.dataProvider.getChats()).map(c => { return { ...c, userId: c.chatId.toString() } });
}

const loadMore = () => {
  // do load more messages to feed
  console.log('load more')
}

const getFeedObjects = () => {
  // console.log('get feed')
  if (selectedChat.value) {
    // здесь обработка для передачи сообщений в feed
    const messages = props.dataProvider.getFeed(selectedChat.value.chatId);
    const messages3 = transformToFeed(messages);
    return messages3;
  } else {
    return [];
  }
};

const addMessage = (message) => {
  console.log(message);
  // Добавление сообщения в хранилище

  props.dataProvider.addMessage({
    text: message.text,
    type: message.type,
    chatId: selectedChat.value.chatId,
    direction: 'outgoing',
    timestamp: '1727112546',
  });
  messages.value = getFeedObjects();  // Обновление сообщений
};

const selectChat = (chat) => {
  selectedChat.value = chat;
  chatsStore.setUnreadCounter(chat.chatId, 0);
  messages.value = getFeedObjects(); // Обновляем сообщения при выборе контакта
};

const handleEvent = async (event) => {
  if (event.type === 'message') {
    chatsStore.setUnreadCounter(event.data.chatId, 1);
    if (selectedChat?.value?.chatId) {
      messages.value = getFeedObjects();
    }
    await playNotificationAudio();
  } else if (event.type === 'notification') {
    console.log('Системное уведомление:', event.data.text);
  }
};


onMounted(() => {
  // console.log('mounted')
  props.eventor.subscribe(handleEvent);
  userProfile.value = props.authProvider.getUserProfile();
  chatsStore.chats = props.dataProvider.getChats();
  channels.value = props.dataProvider.getChannels();
  sidebarItems.value = props.dataProvider.getSidebarItems()

  document.documentElement.dataset.theme = 'green';
});
</script>

<style
  scoped
  lang="scss"
>
.chat-app {

  &__container {
    display: grid;
    grid-template-columns: var(--app-template-col);
    transition: all 0.3s ease;
    background-color: var(--app-container-bg, transparent);
    margin: var(--app-margin, 0);
    border: 1px solid var(--app-border-color, none);
  }

  &__left-bar {
    grid-column: 1;
    margin: var(--left-bar-margin);
  }

  &__right-bar {
    grid-column: 3;
    position: relative;
    /* вычитаем маргины сверху и снизу */
    height: calc(100vh - 62px);
    border-radius: 12px;
    margin: var(--right-bar-margin);
    background-color: var(--rigth-bar-bg);
  }

  &__right-bar-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__center-bar {
    display: flex;
    flex-direction: column;
    /* вычитаем маргины сверху и снизу */
    height: calc(100vh - 62px);
    margin: auto 0;
    grid-column: 2;
    border-right: var(--center-bar-border, none);
  }

  &__profile {
    padding: 10px 15px 30px 15px;
  }

  &__chat-list {
    overflow-y: auto;
  }

  &__chat-panel {
    margin: var(--chat-pannel-margin);
    border-left: var(--chat-pannel-border, none);
    height: calc(100vh - 62px);
  }

  &__welcome-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__float-window {
    position: absolute;
  }

  &__float-center-bar {
    display: grid;
    grid-auto-rows: inherit;
    border-right: var(--center-bar-border, none);
  }

  &__float-right-bar {
    grid-column: 3;
    position: relative;
    border-radius: 12px;
    background-color: var(--rigth-bar-bg);
  }

  &__float-chat-panel {
    margin: var(--chat-pannel-margin);
    border-left: var(--chat-pannel-border, none);
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
  opacity: 1;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
