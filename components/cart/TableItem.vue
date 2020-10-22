<template>
  <tr>
    <td>{{ item.product.name }}</td>
    <td>{{ getTotalQuantity }}</td>
    <td>{{ getTotalPrice }}</td>
  </tr>
</template>

<script>
export default {
  name: 'TableItem',
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    getTotalPrice () {
      let sum = 0
      for (let j = 0; j < this.item.subProducts.length; j++) {
        sum += this.item.subProducts[j].price * this.item.subProducts[j].quantity
      }
      return `₹${sum}`
    },
    getTotalQuantity () {
      let sum = 0
      for (let j = 0; j < this.item.subProducts.length; j++) {
        sum += this.item.subProducts[j].quantity * this.item.subProducts[j].subProduct.quantity
      }
      return `${sum} Kg`
    },
    hasLoaded () {
      console.log(this.item)
      return this.item
    }
  },
  watch: {
    item (val) {
      console.log('value', val)
      if (val) {
        this.loading = false
      }
    }
  }
}
</script>

<style>
</style>
