<template>
  <div class="">
    welcome to the admin panel
  </div>
</template>

<script>
export default {
  layout: 'admin_layout',
  middleware: ['user-auth', 'admin-auth']
}
</script>

<style>

</style>
