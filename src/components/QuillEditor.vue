<template>
  <div class="quill-editor">
    <div ref="editor"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export default {
  name: 'QuillEditor',
  props: {
    content: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Nhập nội dung...'
    }
  },
  emits: ['update:content'],
  setup(props, { emit }) {
    const editor = ref(null)
    const quill = ref(null)

    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': ['Arial'] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]

    onMounted(() => {
      quill.value = new Quill(editor.value, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        },
        placeholder: props.placeholder
      })

      quill.value.root.innerHTML = props.content

      quill.value.on('text-change', () => {
        emit('update:content', quill.value.root.innerHTML)
      })
    })

    watch(() => props.content, (newContent) => {
      if (quill.value && newContent !== quill.value.root.innerHTML) {
        nextTick(() => {
          quill.value.root.innerHTML = newContent
        })
      }
    })

    return {
      editor
    }
  }
}
</script>

<style>
.quill-editor {
  height: 400px;
}
.ql-editor {
  min-height: 200px;
}

.ql-container {
  font-family: 'Arial', sans-serif;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Arial"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Arial"]::before {
  content: 'Arial';
  font-family: 'Arial', sans-serif;
}

.ql-font-Arial {
  font-family: 'Arial', sans-serif;
}

</style>

