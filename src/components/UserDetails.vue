<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2>تفاصيل المستخدم</h2>
        <v-card v-if="user">
          <v-card-title>{{ user.fullName }}</v-card-title>
          <v-card-text>
            <p>البريد الإلكتروني: {{ user.email }}</p>
            <p>الهاتف: {{ user.phoneNO }}</p>
            <p>الدور: {{ user.role }}</p>
            <!-- أضف المزيد من التفاصيل حسب الحاجة -->
          </v-card-text>
        </v-card>
        <v-alert v-else type="error">لم يتم العثور على المستخدم</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      user: null,
    };
  },
  methods: {
    async fetchUser() {
      try {
        const response = await axios.get(`/api/users/${this.id}`);
        this.user = response.data;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
  },
  created() {
    this.fetchUser();
  },
};
</script>

<style scoped>
/* أضف أي تنسيقات مخصصة هنا */
</style>
