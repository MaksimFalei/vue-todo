<template>
  <div class="filter-text input-group input-group-sm">
    <div class="input-group-prepend">
      <span class="input-group-text">Search</span>
    </div>
    <input
    type="text"
    v-model="internalValue"
    class="form-control"
    @input="$emit('input', internalValue)"
    />
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  props: {
    value: {
      type: String,
    },
  },
  data(){
    return {
      internalValue: '',
    }
  },
  watch: {
    value() {
      this.internalValue = this.value;
    }
  },
};
</script>

<style>
.input-group.filter-text {
  margin: 0 auto;
  width: 50%;
}
</style>
