<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #fff;
    height: 100%;
    color: #333;
  }

  a{
    text-decoration: none;
  }

  ul, ol{
    list-style-type: none;
  }

  #app{
    height: 100%;
    min-width: 1024px;
    min-height: 500px;
  }
</style>
