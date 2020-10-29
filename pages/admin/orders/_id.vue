<template>
  <div id="adminOrderMain">
    helloworld
  </div>
</template>

<script>
export default {
  layout: 'admin_layout',
  middleware: ['user-auth', 'admin-auth'],
  async asyncData ({ app, params }) {
    try {
      const { data } = await app.$axios.get(`/api/order/${params.id}`)
      return { order: data.data }
    } catch (err) {
      console.error(err)
    }
  },
  data () {
    return {
      order: {}
    }
  }

}
</script>

<style>

</style>
