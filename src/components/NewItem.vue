<template>
  <div id="add-item-button">
    <b-button
        v-b-modal.new-item-modal
        block
        variant="outline-dark"
        >Add new item</b-button
      >
  <b-modal id="new-item-modal" title="New item" @cancel="onCancel" @close="onCancel" @ok="onOk">
        <b-form-textarea
          id="textarea"
          autofocus
          v-model="newItemText"
          placeholder="Enter something..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-modal>
  </div>
</template>

<script>
export default {
  name: "NewItem",
  data() {
    return {
      newItemText: '',
    }
  },
  methods: {
    onOk() {
      this.$emit('addItem', this.newItemText);
      this.newItemText = "";
    },
    onCancel() {
      this.newItemText = "";
    }
  },
}
</script>

<style>

</style>
