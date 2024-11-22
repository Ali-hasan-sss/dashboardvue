<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <h2 class="text-center">تفاصيل المستخدم</h2>
        <v-card>
          <v-avatar size="100" class="mx-auto mb-4" color="primary">
            <span>{{ user.first_name[0] }}.{{ user.last_name[0] }}</span>
          </v-avatar>
          <v-card-title class="justify-center">
            {{ user.first_name }} {{ user.last_name }}
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-email</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> البريد الإلكتروني </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.email || "غير متوفر" }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> الهاتف </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.authentication }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-account-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> الدور </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.role }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
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
        const response = await axios.get(`/users/${this.id}`);
        this.user = response.data.data;
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
.text-center {
  text-align: center;
}

.v-avatar span {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
