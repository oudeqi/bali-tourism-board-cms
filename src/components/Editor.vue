<template>
  <div>
    <div id="editor-head" class="editor-head"></div>
    <div id="editor-body" class="editor-body">
      <span style="color: #ccc;">{{editorPlaceholder}}</span>
    </div>
    <div>{{editorContent}}</div>
    <button v-on:click="getContent">查看内容</button>
  </div>
</template>
<script>
import E from 'wangeditor'
export default {
  name: 'Editor',
  data () {
    return {
      editor: null
    }
  },
  props: {
    editorContent: String,
    editorPlaceholder: {
      type: String,
      required: true
    }
  },
  watch: {
    editorContent: function (val) {
      if (this.editor) {
        this.editor.txt.html(val)
      }
    }
  },
  methods: {
    getContent: function () {
      alert(this.editorContent)
    }
  },
  mounted () {
    this.editor = new E('#editor-head', '#editor-body')
    this.editor.customConfig.onchange = (html) => {
      this.$emit('change', html)
    }
    this.editor.customConfig.pasteFilterStyle = false
    this.editor.customConfig.onchangeTimeout = 300
    this.editor.customConfig.menus = [
      'head',
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'foreColor',
      'backColor',
      'link',
      'list',
      'justify',
      'quote',
      'emoticon',
      'image',
      'video',
      'undo',
      'redo'
    ]
    this.editor.create()
    this.editor.txt.html(this.editorContent)
  }
}
</script>
<style scoped>
  .editor-head {
    border: 1px solid #ccc;
    border-bottom: none;
  }
  .editor-body {
    border: 1px solid #ccc;
    border-top: 1px solid #e0e0e0;
    height: 700px;
  }
</style>
