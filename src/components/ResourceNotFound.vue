<template>
  <div>
    <h1>404</h1>
  </div>
</template>

<script>
import Qs from 'qs'
import router from '../router'
export default {
  name: 'ResourceNotFound',
  beforeRouteEnter (to, from, next) {
    if (window.localStorage.getItem('userInfo') && from.name === null) {
      let userInfo = Qs.parse(window.localStorage.getItem('userInfo'))
      if (userInfo && userInfo.type === 'admin') {
        router.replace({name: 'AdminIndex'})
      } else if (userInfo && userInfo.type === 'user') {
        router.replace({name: 'UserIndex'})
      } else {
        next()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
