<template>
  <b-alert
    class="success-message position-fixed"
    :show="dismissCountDown"
    dismissible
    :variant="messageType"
    @dismissed="dismissCountDown = 0"
    @dismiss-count-down="countDownChanged"
  >
    <p>{{ message.text }}</p>
  </b-alert>
</template>

<script>
export default {
  name: "AlertPopUp",
  props: {
    message: Object,
    isDismissed: Boolean,
  },
  data() {
    return {
      dismissSecs: 3,
      dismissCountDown: 0,
      showDismissibleAlert: false,
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
      if (!dismissCountDown) {
        this.$emit('alertDissmised');
      }
    },
  },
  computed: {
    messageType() {
      return this.message.success ? "success" : "danger";
    },

  },
  watch: {
    isDismissed(value) {
      if (!value) {
        this.dismissCountDown = this.dismissSecs;
      }
    }
  },
};
</script>

<style>
.success-message {
  right: 0;
  top: 20px;
}
</style>
