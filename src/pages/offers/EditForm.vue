<template>
  <v-form>
    <div class="inbut">
      <v-text-field v-model="form.size" label="الحجم" required />
      <v-text-field v-model="form.price" label="السعر" required />
    </div>
    <div>
      <div class="action">
        <v-btn color="blue" @click="saveForm">حفظ</v-btn>
        <v-btn color="red" @click="$emit('close')">إلغاء</v-btn>
      </div>
    </div>
  </v-form>
</template>

<script>
export default {
  props: {
    initialData: {
      type: Object,
      default: () => ({
        size: "",
        price: "",
      }),
    },
    isNew: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      form: { ...this.initialData },
    };
  },
  methods: {
    async saveForm() {
      this.$emit("saveForm", this.form);
    },
  },
};
</script>
<style scoped>
.inbut {
  display: flex;
  gap: 20px;
}
form {
  background-color: rgb(247, 245, 243);
  padding: 10px;
}
.action {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
