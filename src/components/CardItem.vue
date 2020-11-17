<template>
  <transition name="fade">
    <b-card
      :bg-variant="item.completed ? 'success' : 'dark'"
      text-variant="white"
      :title="`Task #${item.id}`"
      :key="item.id"
      v-show="show"
    >
      <b-card-text>
        <DangerMaker :text="item.title">
          <template v-slot:danger="{ mark }">
            <span class="text-danger">{{ mark }}</span>
          </template>
          <template v-slot:simple="{ mark }">
            <span>{{ mark }}</span>
          </template>
        </DangerMaker>
      </b-card-text>
      <div class="d-flex justify-content-between">
        <b-button @click="onDelete(item)" variant="danger">Delete</b-button>
        <b-button
          @click="onChange(item)"
          v-if="!item.completed"
          variant="primary"
          >Complete</b-button
        >
        <b-button
          @click="onChange(item)"
          v-if="item.completed"
          variant="warning"
          >Uncopmplete</b-button
        >
      </div>
    </b-card>
  </transition>
</template>

<script>
import DangerMaker from "./DangerMarker";
export default {
  name: "CardItem",
  components: {
    DangerMaker,
  },
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {
      show: true,
    };
  },
  methods: {
    onDelete() {
      this.show = false;
      setTimeout(() => {
        this.$emit("delete", this.item);
      }, 500);
    },
    onChange() {
      this.$emit("changeStatus", this.item);
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
