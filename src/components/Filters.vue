<template>
  <div class="filter-completed-all btn-group btn-group-toggle">
    <label
      v-for="option in filters"
      class="btn btn-light"
      :key="option"
      :class="{ active: status === option }"
    >
      <input
      type="radio"
      name="options"
      :value="option"
      @input="$emit('input', option)"
      />
      {{ option | capitalize }}
    </label>
  </div>
</template>

<script>
export default {
  name: "Filters",
  props: {
    filters: Array,
    status: String,
  },
};
</script>

<style>
</style>
