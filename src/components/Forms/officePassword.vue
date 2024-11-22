<template>
  <v-form @submit.prevent="handleSubmit">
    <v-card>
      <v-card-title>
        <span>تعديل كلمة المرور</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <!-- كلمة المرور الجديدة -->
            <v-col cols="12">
              <v-text-field
                label="كلمة المرور الجديدة"
                type="password"
                v-model="password"
                :error-messages="passwordErrors"
                @input="validatePassword"
              />
            </v-col>
            <!-- تأكيد كلمة المرور -->
            <v-col cols="12">
              <v-text-field
                label="تأكيد كلمة المرور"
                type="password"
                v-model="confirmPassword"
                :error-messages="confirmPasswordErrors"
                @input="validateConfirmPassword"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" type="submit">حفظ</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  props: {
    officeId: {
      type: String,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      password: "",
      confirmPassword: "",
      passwordErrors: [],
      confirmPasswordErrors: [],
    };
  },
  methods: {
    validatePassword() {
      this.passwordErrors = [];
      if (this.password.length < 8) {
        this.passwordErrors.push("يجب أن تكون كلمة المرور أطول من 8 أحرف.");
      }
    },
    validateConfirmPassword() {
      this.confirmPasswordErrors = [];
      if (this.confirmPassword !== this.password) {
        this.confirmPasswordErrors.push("كلمتا المرور غير متطابقتين.");
      }
    },
    async handleSubmit() {
      this.validatePassword();
      this.validateConfirmPassword();

      if (this.passwordErrors.length || this.confirmPasswordErrors.length) {
        this.$toast.error("يرجى إصلاح الأخطاء قبل الإرسال.");
        return;
      }

      await this.onSubmit({
        password: this.password,
        officeId: this.officeId,
      });
    },
  },
};
</script>
