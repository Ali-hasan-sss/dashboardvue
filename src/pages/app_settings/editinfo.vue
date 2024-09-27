<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-right">
        <v-btn class="btn" color="primary" @click="toggleLang">
          {{
            selectedLang === "ar" ? "Switch to English" : "التبديل إلى العربية"
          }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h1>تعديل محتوى الشروط والسياسات</h1>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col cols="12">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-if="contentData">
      <!-- سياسة الخصوصية -->
      <v-col cols="12" md="4">
        <v-card outlined>
          <v-card-title>
            {{ selectedLang === "ar" ? "سياسة الخصوصية" : "Privacy Policy" }}
          </v-card-title>
          <v-card-actions>
            <v-btn icon @click="openDialog('terms-and-condations-policy')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            {{
              "terms-and-condations-policy" in contentData &&
              contentData["terms-and-condations-policy"].body
                ? contentData["terms-and-condations-policy"].body
                : "انتظار جلب البيانات"
            }}
          </v-card-text>
        </v-card>
      </v-col>

      <!-- شروط الاستخدام -->
      <v-col cols="12" md="4">
        <v-card outlined>
          <v-card-title>
            {{ selectedLang === "ar" ? "شروط الاستخدام" : "Terms of Use" }}
          </v-card-title>
          <v-card-actions>
            <v-btn icon @click="openDialog('terms-of-use')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            {{
              "terms-of-use" in contentData && contentData["terms-of-use"].body
                ? contentData["terms-of-use"].body
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
              selectedLang === "ar"
                ? "حماية الملكية الفكرية"
                : "Intellectual Property Rights"
            }}
          </v-card-title>
          <v-card-actions>
            <v-btn icon @click="openDialog('intellectual-property-rights')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            {{
              "intellectual-property-rights" in contentData &&
              contentData["intellectual-property-rights"].body
                ? contentData["intellectual-property-rights"].body
                : "انتظار جلب البيانات"
            }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog للتعديل -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>تعديل {{ dialogField }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-textarea
              v-model="formData.value"
              label="القيمة"
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

const BASE_URL = "https://swess.store/api/v2/termsandconditions/get/";
const EDIT_URL = "https://swess.store/api/termsandconditions/Edit";

const endpoints = {
  "terms-and-condations-policy": "terms-and-condations-policy",
  "terms-of-use": "terms-of-use",
  "intellectual-property-rights": "intellectual-property-rights",
};

export default {
  name: "EditTerms",
  data() {
    return {
      contentData: {},
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
      try {
        for (const [key, endpoint] of Object.entries(endpoints)) {
          const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers: {
              lang: this.selectedLang,
            },
          });
          this.contentData[key] = response.data.data;
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
      this.formData.value = this.contentData[field].body;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveChanges() {
      this.saving = true;
      try {
        const itemData = this.contentData[this.dialogField];
        const payload = {
          id: itemData.id,
          title: itemData.title || this.dialogField,
          body: this.formData.value,
        };

        // console.log("Sending data:", payload);

        await axios.post(EDIT_URL, payload, {
          headers: {
            lang: this.selectedLang,
          },
        });
        this.contentData[this.dialogField].body = this.formData.value;
        this.closeDialog();
        this.$toast.success("تم التعديل بنجاح");
      } catch (error) {
        console.error("Error saving changes:", error);
        console.error("Error details:", error.response.data);
        this.errorMessage = "تعذر حفظ البيانات. حاول مرة أخرى لاحقاً.";
      } finally {
        this.saving = false;
      }
    },
    toggleLang() {
      this.selectedLang = this.selectedLang === "ar" ? "en" : "ar";
      this.fetchContent(); // Fetch content again with the new language
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
</style>
