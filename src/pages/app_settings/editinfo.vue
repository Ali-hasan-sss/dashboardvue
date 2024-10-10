<template>
  <v-container>
    <!-- زر التبديل بين اللغات -->
    <v-row>
      <v-col cols="12" class="text-right">
        <v-btn class="btn" color="primary" @click="toggleLang">
          {{
            selectedLang === "ar" ? "Switch to English" : "التبديل إلى العربية"
          }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- العنوان الرئيسي -->
    <v-row>
      <v-col cols="12">
        <h1>تعديل محتوى الشروط والسياسات</h1>
      </v-col>
    </v-row>

    <!-- مؤشر التحميل -->
    <v-row v-if="loading">
      <v-col cols="12">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-col>
    </v-row>

    <!-- عرض المحتوى -->
    <v-row v-if="!loading && contentData[selectedLang]">
      <!-- عرض رسائل الخطأ إذا وجدت -->
      <v-col cols="12" v-if="errorMessage">
        <v-alert type="error" dismissible>
          {{ errorMessage }}
        </v-alert>
      </v-col>

      <!-- سياسة الخصوصية -->
      <v-col cols="12" md="4">
        <v-card outlined>
          <v-card-title>
            {{
              contentData[selectedLang]["terms-and-condations-policy"] &&
              contentData[selectedLang]["terms-and-condations-policy"].title
                ? contentData[selectedLang]["terms-and-condations-policy"].title
                : "انتظار جلب البيانات"
            }}
          </v-card-title>
          <v-card-actions>
            <v-btn icon @click="openDialog('terms-and-condations-policy')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            {{
              contentData[selectedLang]["terms-and-condations-policy"] &&
              contentData[selectedLang]["terms-and-condations-policy"].body
                ? contentData[selectedLang]["terms-and-condations-policy"].body
                : "انتظار جلب البيانات"
            }}
          </v-card-text>
        </v-card>
      </v-col>

      <!-- شروط الاستخدام -->
      <v-col cols="12" md="4">
        <v-card outlined>
          <v-card-title>
            {{
              contentData[selectedLang]["terms-of-use"] &&
              contentData[selectedLang]["terms-of-use"].title
                ? contentData[selectedLang]["terms-of-use"].title
                : "انتظار جلب البيانات"
            }}
          </v-card-title>
          <v-card-actions>
            <v-btn icon @click="openDialog('terms-of-use')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            {{
              contentData[selectedLang]["terms-of-use"] &&
              contentData[selectedLang]["terms-of-use"].body
                ? contentData[selectedLang]["terms-of-use"].body
                : "انتظار جلب البيانات"
            }}
          </v-card-text>
        </v-card>
      </v-col>

      <!-- حماية الملكية الفكرية -->
      <v-col cols="12" md="4">
        <v-card outlined>
          <v-card-title>
            {{
              contentData[selectedLang]["intellectual-property-rights"] &&
              contentData[selectedLang]["intellectual-property-rights"].title
                ? contentData[selectedLang]["intellectual-property-rights"]
                    .title
                : "انتظار جلب البيانات"
            }}
          </v-card-title>
          <v-card-actions>
            <v-btn icon @click="openDialog('intellectual-property-rights')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            {{
              contentData[selectedLang]["intellectual-property-rights"] &&
              contentData[selectedLang]["intellectual-property-rights"].body
                ? contentData[selectedLang]["intellectual-property-rights"].body
                : "انتظار جلب البيانات"
            }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog للتعديل -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>تعديل {{ getFieldLabel(dialogField) }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-textarea
              v-model="formData.value"
              :label="getFieldLabel(dialogField)"
              rows="10"
              required
            ></v-textarea>
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
import { GET_URL, EDIT_URLV2 } from "./url";

const BASE_URL = `${GET_URL}/termsandconditions/get/`;
const EDIT_URL = `${EDIT_URLV2}/termsandconditions/Edit`;

const endpoints = {
  "terms-and-condations-policy": "terms-and-condations-policy",
  "terms-of-use": "terms-of-use",
  "intellectual-property-rights": "intellectual-property-rights",
};

export default {
  name: "EditTerms",
  data() {
    return {
      contentData: {
        ar: {
          "terms-and-condations-policy": {},
          "terms-of-use": {},
          "intellectual-property-rights": {},
        },
        en: {
          "terms-and-condations-policy": {},
          "terms-of-use": {},
          "intellectual-property-rights": {},
        },
      },
      dialog: false,
      dialogField: "",
      formData: {
        value: "",
      },
      errorMessage: "",
      loading: false,
      saving: false,
      selectedLang: "ar",
    };
  },
  mounted() {
    this.fetchContent();
  },
  methods: {
    async fetchContent() {
      this.loading = true;
      this.errorMessage = "";
      try {
        //  console.log("Fetching content for language:", this.selectedLang);
        for (const [key, endpoint] of Object.entries(endpoints)) {
          const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers: {
              lang: this.selectedLang,
            },
          });
          //  console.log(`Response for ${key}:`, response.data);
          if (response.data && response.data.data) {
            this.$set(
              this.contentData[this.selectedLang],
              key,
              response.data.data
            );
          } else {
            console.warn(
              `No data found for ${key} in language ${this.selectedLang}`
            );
            this.$set(this.contentData[this.selectedLang], key, {
              title: "انتظار جلب البيانات",
              body: "انتظار جلب البيانات",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        this.errorMessage = "تعذر جلب البيانات. حاول مرة أخرى لاحقاً.";
      } finally {
        this.loading = false;
      }
    },
    openDialog(field) {
      this.dialogField = field;
      this.formData.value =
        this.contentData[this.selectedLang][field].body || "";
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveChanges() {
      if (!this.formData.value.trim()) {
        this.errorMessage = "لا يمكن أن تكون القيمة فارغة.";
        return;
      }

      this.saving = true;
      this.errorMessage = "";
      try {
        const itemData = this.contentData[this.selectedLang][this.dialogField];
        const payload = {
          id: itemData.id,
          title: itemData.title || this.dialogField,
          body: this.formData.value,
          language: this.selectedLang,
        };

        // console.log("Selected language for POST request:", this.selectedLang);
        // console.log("Sending data:", payload);

        const response = await axios.post(EDIT_URL, payload, {
          headers: {
            lang: this.selectedLang,
          },
        });

        //  console.log("Edit response:", response.data);

        this.contentData[this.selectedLang][this.dialogField].body =
          this.formData.value;
        this.closeDialog();
        this.$toast.success("تم التعديل بنجاح");

        // إعادة جلب البيانات للتأكد من التعديل
        await this.fetchContent();
      } catch (error) {
        console.error("Error saving changes:", error);
        if (error.response && error.response.data) {
          console.error("Error details:", error.response.data);
          this.errorMessage =
            error.response.data.message ||
            "تعذر حفظ البيانات. حاول مرة أخرى لاحقاً.";
        } else {
          this.errorMessage = "تعذر حفظ البيانات. حاول مرة أخرى لاحقاً.";
        }
      } finally {
        this.saving = false;
      }
    },

    // دالة لتبديل اللغة
    toggleLang() {
      this.selectedLang = this.selectedLang === "ar" ? "en" : "ar";
      console.log("Language toggled to:", this.selectedLang);
      this.fetchContent(); // جلب المحتوى مرة أخرى باللغة الجديدة
    },
    getFieldLabel(field) {
      const labels = {
        "terms-and-condations-policy":
          this.selectedLang === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
        "terms-of-use":
          this.selectedLang === "ar" ? "شروط الاستخدام" : "Terms of Use",
        "intellectual-property-rights":
          this.selectedLang === "ar"
            ? "حماية الملكية الفكرية"
            : "Intellectual Property Rights",
      };
      return labels[field] || field;
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 1.5rem;
}
.btn {
  margin-top: 5px;
}
.v-alert {
  margin-bottom: 20px;
}
</style>
