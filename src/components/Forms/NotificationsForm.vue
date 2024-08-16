<template>
  <v-form @submit.prevent="submitNotification">
    <v-select
      v-model="targetType"
      :items="targetOptions"
      label="الفئة المستهدفة"
      required
    ></v-select>

    <v-select
      v-if="targetType === 'specific'"
      v-model="targetIds"
      :items="targetList"
      label="اختر الوكالات أو المستخدمين المستهدفين"
      multiple
      required
    ></v-select>

    <v-text-field v-model="title" label="عنوان الإشعار" required></v-text-field>

    <v-textarea v-model="message" label="نص الإشعار" required></v-textarea>

    <v-select
      v-model="language"
      :items="['العربية', 'English']"
      label="لغة الإشعار"
      required
    ></v-select>

    <v-btn type="submit" color="primary">إرسال الإشعار</v-btn>
  </v-form>
</template>

<script>
export default {
  props: {
    newItemLabel: String,
    isNew: Boolean,
    api: Object,
  },
  data() {
    return {
      targetType: null, // فئة المستهدفة (جميع الوكالات، جميع المستخدمين، محددة)
      targetIds: [], // هويات المستهدفين (إذا كانت محددة)
      targetOptions: [
        { text: "جميع الوكالات العقارية", value: "allAgencies" },
        { text: "جميع المستخدمين", value: "allUsers" },
        { text: "وكالات محددة", value: "specific" },
      ],
      targetList: [], // قائمة الوكالات أو المستخدمين للاختيار من بينها (يجب أن يتم جلبها من API)
      title: "",
      message: "",
      language: "العربية", // لغة الإشعار الافتراضية
    };
  },
  methods: {
    async fetchTargetList() {
      try {
        // افتراضياً، نقوم بجلب قائمة الوكالات أو المستخدمين من API
        const response = await axios.get("api/targets"); // استبدل 'api/targets' بنقطة النهاية الصحيحة
        this.targetList = response.data;
      } catch (error) {
        console.error("Error fetching target list:", error);
      }
    },
    submitNotification() {
      const notificationData = {
        targetType: this.targetType,
        targetIds: this.targetIds,
        title: this.title,
        message: this.message,
        language: this.language,
      };
      this.$emit("sendNotification", notificationData);
    },
  },
  created() {
    if (this.targetType === "specific") {
      this.fetchTargetList();
    }
  },
};
</script>
