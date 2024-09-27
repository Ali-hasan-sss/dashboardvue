<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>الإشعارات الواردة</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="notifications"
          item-value="id"
          class="elevation-1"
        >
          <!-- offer name -->
          <template v-slot:item.offerNumber="{ item }">
            <v-btn text color="primary" :to="`/estates/${item.offerNumber}`">
              {{ item.offerNumber }}
            </v-btn>
          </template>

          <!-- user name -->
          <template v-slot:item.userName="{ item }">
            <v-btn text color="primary" @click="openUserDetails(item)">
              {{ item.userName }}
            </v-btn>
          </template>

          <!-- notification status (seen/unseen) -->
          <template v-slot:item.seen="{ item }">
            <v-icon :color="item.seen === '1' ? 'green' : 'red'">
              {{ item.seen === "1" ? "mdi-check-circle" : "mdi-alert-circle" }}
            </v-icon>
          </template>

          <!-- notification date -->
          <template v-slot:item.createdAt="{ item }">
            <span>{{ item.createdAt }}</span>
          </template>

          <!-- notification message -->
          <template v-slot:item.message="{ item }">
            <v-btn text @click="markAsRead(item)">{{ item.message }}</v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="isUserModalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span>معلومات المستخدم</span>
        </v-card-title>

        <v-card-text>
          <div>
            <strong>الاسم:</strong> {{ userDetails.firstName }}
            {{ userDetails.lastName }}
          </div>
          <div><strong>رقم الهاتف:</strong> {{ userDetails.phone }}</div>
          <div>
            <strong>البريد الإلكتروني:</strong>
            {{ userDetails.email || "غير متوفر" }}
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="closeUserModal">إغلاق</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Notifications",
  data() {
    return {
      notifications: [],
      headers: [
        { text: "رقم العرض", value: "offerNumber" },
        { text: "اسم المستخدم", value: "userName" },
        { text: "حالة الإشعار", value: "seen" },
        { text: "تاريخ الإشعار", value: "createdAt" },
        { text: "نص الإشعار", value: "message" },
      ],
      isUserModalOpen: false,
      userDetails: {},
    };
  },
  mounted() {
    this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
      try {
        const response = await axios.get(
          "https://swess.store/api/getUserInterest"
        );
        console.log("API Response:", response.data);

        if (Array.isArray(response.data.data)) {
          this.notifications = response.data.data.map((notification) => {
            const { estate_offer_number, user, message, created_at, id, seen } =
              notification;
            return {
              id,
              offerNumber: estate_offer_number,
              userId: user.id,
              userName: `${user.first_name} ${user.last_name}`,
              message: message,
              createdAt: created_at,
              userDetails: user,
              seen,
            };
          });
        } else {
          console.error("البيانات المستلمة ليست مصفوفة:", response.data);
        }
      } catch (error) {
        console.error("خطأ في جلب الإشعارات:", error);
      }
    },

    openUserDetails(item) {
      this.userDetails = {
        firstName: item.userDetails.first_name,
        lastName: item.userDetails.last_name,
        phone: item.userDetails.phone,
        email: item.userDetails.email,
      };
      this.isUserModalOpen = true;
    },

    closeUserModal() {
      this.isUserModalOpen = false;
    },

    async markAsRead(item) {
      if (item.seen === "0") {
        try {
          await axios.get(
            `https://swess.store/api/getUserInterest/read/${item.id}`
          );
          item.seen = "1";
        } catch (error) {
          console.error("خطأ في تحديث حالة الإشعار:", error);
        }
      }
    },
  },
};
</script>
