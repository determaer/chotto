<template>
  <div v-if="uploadStatus === 'uploading'">
    <p>Загрузка файла...</p>
  </div>
  <div v-else-if="uploadStatus === 'error'">
    <p>Ошибка при загрузке файла.</p>
  </div>
  <ButtonContextMenu
    v-else-if="!getMessage().isRecording"
    :actions="actions"
    :mode="'hover'"
    :menu-side="'top'"
    :disabled="!canUploadFile || state == 'disabled'"
    @click="triggerFileUpload"
    @button-click="triggerFileUploadDefault"
  >
    <span 
      class='pi pi-file-arrow-up file-uploader__trigger'
      :class="{'file-uploader__disabled' : !canUploadFile || state == 'disabled'}"
    >
    </span>
  </ButtonContextMenu>
  <input
    ref="fileInput"
    style="display: none;"
    type="file"
    @change="onFileSelected"
  >
  <teleport
    v-if="getMessage().file"
    :to="'#chat-input-file-line-'+chatAppId"
  >
    <FilePreview
      v-if="fileInfo"
      :file-info="fileInfo"
      @reset="resetSelectedFile"
    />
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from "vue";
import ButtonContextMenu from "./ButtonContextMenu.vue";
import FilePreview from "./FilePreview.vue";
import { useMessage } from "../../helpers/useMessage";
import { uploadFile } from "../../helpers/uploadFile";
import { IFilePreview } from "../../types";

const props = defineProps({
  filebumpUrl: {
    type: String,
  },
  state:{
    type: String,
    default: 'active',
  },
});

const uploadStatus = ref("");

const fileInput = ref<HTMLInputElement>();
const fileInfo = ref<IFilePreview>()

const chatAppId = inject('chatAppId')
const { setMessageFile, resetMessageFile, getMessage, setRecordingMessage } = useMessage(chatAppId as string)

const actions = [
  {
    action: 'audio/*',
    title: 'Аудио',
    prime: 'headphones',
  },
  {
    action: 'image/*',
    title: 'Фото',
    prime: 'image',
  },
  {
    action: 'video/*',
    title: 'Видео',
    prime: 'video',
  },
  {
    action: '',
    title: 'Файл',
    prime: 'file',
  },
]

const emit = defineEmits(["fileUploaded"]);

const canUploadFile = computed(() => {
  return !getMessage().file;
})

const resetSelectedFile = () => {
  const previewContainer = document.getElementById('chat-input-file-line-'+chatAppId)
  if (previewContainer){
    previewContainer.style.display = 'none'
  }
  resetMessageFile()
  fileInfo.value = undefined
  uploadStatus.value = ""
};

const onFileSelected = async () => {
  resetSelectedFile()
  if (fileInput.value?.files) {
    handleFileUpload(fileInput.value?.files[0])
  }
};

const triggerFileUpload = (action) => {
  if (fileInput.value && canUploadFile) {
    fileInput.value.accept = action.action
    fileInput.value.click();
  }
};

const triggerFileUploadDefault = () => {
  if (fileInput.value && canUploadFile  && props.state == 'active') {
    fileInput.value.click();
  }
};

const pasteFromClipboard = async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (items) {
    for(let item of items){
      if (item.type.indexOf('image')!==-1){
        event.preventDefault()
        const file = item.getAsFile()
        if (file){
          handleFileUpload(file)
        }
      }
    }
  }
}

const handleFileUpload = async (file: File) => {
  uploadStatus.value = "uploading";
  setRecordingMessage(true)
  const f = typeof props.filebumpUrl == 'string' ? props.filebumpUrl : null 
  await uploadFile(f, file)
    .then((data) => {
      setRecordingMessage(false)
      uploadStatus.value = data.status
      if (data.status == 'success'){
        setMessageFile({
          url: data.url,
          name: data.name,
          size: data.size,
          type: data.type,
        })
        const previewContainer = document.getElementById('chat-input-file-line-'+chatAppId)
        if (previewContainer){
          previewContainer.style.display = 'inherit'
        }
        if (data.preview)
          fileInfo.value = ({
            previewUrl: data.preview.previewUrl,
            isImage: data.preview.isImage,
            isVideo: data.preview.isVideo,
            isAudio: data.preview.isAudio,
            fileName: data.name,
            fileSize: data.preview.fileSize,
          })
      }
    }) 
}

onMounted(() => {
  window.addEventListener('paste', pasteFromClipboard)
})


</script>

<style
  scoped
  lang="scss"
>
.file-uploader{
  &__trigger{
    padding: var(--chotto-chat-input-button-padding);
    display: block;
    cursor: pointer;
    font-size: var(--chotto-button-icon-size);
    color: var(--chotto-button-color-active);
  }

  &__trigger:hover{
    color: var(--chotto-button-color-hover);
  }

  &__disabled {
    color: var(--chotto-button-color-disabled);
    cursor: auto;
    pointer-events: none;
  }

}

</style>
