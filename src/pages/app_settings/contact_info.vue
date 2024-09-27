<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>معلومات التواصل</h1>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col cols="12">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-if="contactInfo">
      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title>
            <v-img
              v-if="contactInfo.iconLandline"
              :src="contactInfo.iconLandline || 'default-icon.svg'"
              max-width="50"
              class="mr-3"
            />
            الهاتف الثابت
          </v-card-title>
          <v-card-text>
            {{ contactInfo.landline }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon @click="openDialog('landline')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title>
            <v-img
              v-if="contactInfo.iconMobile"
              :src="contactInfo.iconMobile"
              max-width="50"
              class="mr-3"
            />
            الهاتف المحمول
          </v-card-title>
          <v-card-text>
            {{ contactInfo.mobilephone }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon @click="openDialog('mobilephone')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title>
            <v-img
              v-if="contactInfo.iconWhatsapp"
              :src="contactInfo.iconWhatsapp"
              max-width="50"
              class="mr-3"
            />
            واتساب
          </v-card-title>
          <v-card-text>
            {{ contactInfo.whatsapp }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon @click="openDialog('whatsapp')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title>
            <v-img
              v-if="contactInfo.iconMessenger"
              :src="contactInfo.iconMessenger"
              max-width="50"
              class="mr-3"
            />
            ماسنجر
          </v-card-title>
          <v-card-text>
            {{ contactInfo.messenger }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon @click="openDialog('messenger')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>تعديل {{ dialogField }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="formData.value"
              label="القيمة"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">إلغاء</v-btn>
          <v-btn text @click="saveChanges" :loading="saving">حفظ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ContactInfo",
  data() {
    return {
      contactInfo: null,
      dialog: false,
      dialogField: "",
      formData: {
        value: "",
      },
      errorMessage: "",
      loading: false,
      saving: false,
    };
  },
  mounted() {
    this.fetchContactInfo();
  },
  methods: {
    async fetchContactInfo() {
      this.loading = true;
      try {
        const response = await axios.get(
          "https://swess.store/api/v2/app/getContactUsVariables"
        );
        this.contactInfo = response.data.data;
      } catch (error) {
        this.errorMessage = "تعذر جلب بيانات التواصل. حاول مرة أخرى لاحقاً.";
      } finally {
        this.loading = false;
      }
    },
    openDialog(field) {
      this.dialogField = field;
      this.formData.value = this.contactInfo[field];
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.formData.iconFile = null;
      this.formData.iconPreview = "";
    },

    async saveChanges() {
      this.saving = true;
      try {
        await axios.post("https://swess.store/api/editContactUsVariables", {
          [this.dialogField]: this.formData.value,
        });
        this.contactInfo[this.dialogField] = this.formData.value;
        this.closeDialog();
      } catch (error) {
        this.errorMessage = "تعذر حفظ البيانات. حاول مرة أخرى لاحقاً.";
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style>
h1 {
  text-align: center;
  font-size: 1.5rem;
}
</style>
