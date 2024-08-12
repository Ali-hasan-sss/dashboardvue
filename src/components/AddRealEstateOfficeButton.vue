<!-- AddRealEstateOfficeButton.vue -->
<template>
  <v-btn color="primary" @click="addRealEstateOffice"> إضافة مكتب عقاري </v-btn>
</template>

<script>
export default {
  methods: {
    addRealEstateOffice() {
      this.$emit("openForm"); // إطلاق حدث openForm لاستدعاء الدالة من المكون الأب
    },
  },
};
</script>
