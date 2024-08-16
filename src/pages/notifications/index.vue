<template>
  <v-container fluid class="notifications-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- Form لإرسال الإشعارات -->
        <NotificationsForm
          newItemLabel="إرسال الإشعارات"
          :isNew="isNew"
          :api="api"
          @sendNotification="sendNotification"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NotificationsForm from "../../components/Forms/NotificationsForm.vue";
import axios from "axios";

export default {
  data() {
    return {
      isNew: true,
      dialog_form: false,
      api: {
        send: "sendNotifications", // نقطة النهاية لإرسال الإشعارات
      },
      title: "الإشعارات",
    };
  },
  components: { NotificationsForm },
  methods: {
    async sendNotification(notificationData) {
      try {
        // تأكد من أن جميع الحقول المطلوبة موجودة وصحيحة
        const data = {
          targetType: notificationData.targetType, // تأكد من أنها "agency" أو "user"
          targetIds: notificationData.targetIds || [], // قائمة محددة من المعرفات إذا كانت محددة
          title: notificationData.title.trim(),
          message: notificationData.message.trim(),
          language: notificationData.language || "ar", // اللغة الافتراضية إذا لم يتم تحديدها
        };

        // تحقق من الحقول المطلوبة
        if (!data.title || !data.message) {
          throw new Error("العنوان ومحتوى الإشعار مطلوبان.");
        }

        // إرسال البيانات إلى الخادم
        const response = await axios.post(this.api.send, data);

        if (response.status === 200) {
          // يمكنك استخدام طرق إشعار مختلفة هنا
          alert("تم إرسال الإشعار بنجاح!");
        } else {
          throw new Error("فشل إرسال الإشعار.");
        }
      } catch (error) {
        console.error("Error sending notification:", error.message || error);
        alert("حدث خطأ أثناء إرسال الإشعار.");
      }
    },
  },
};
</script>
