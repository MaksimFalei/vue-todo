<template>
  <div>
    <slot></slot>
    <div class="d-flex row w-100 m-auto justify-content-center fixed-bottom">
      <b-pagination class="custom-pagination" :total-rows="totalRows" :value="page" @input="onUpdate">
      </b-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    page: {
      type: Number,
      default: 1,
    },
    totalRows: Number,
  },
  methods: {
    onUpdate(page) {
      page = page || 1;
      this.$emit('update:page', page)
    },
  },
};
</script>

<style>
.pagination-wrapper {
  margin-top: 10px;
}

.pagination.custom-pagination .page-item .page-link {
  background-color: #343a40;
  color: white;
  border-color: white;
}

.pagination.custom-pagination .page-item.active .page-link,
.pagination.custom-pagination .page-item .page-link:hover {
  color: black;
  background-color: #dae0e5;
}
</style>
