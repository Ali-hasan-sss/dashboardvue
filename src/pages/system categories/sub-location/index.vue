<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <ExportToExcelButton class="mb-2" :tableData="filteredTableData" />
        <v-card>
          <v-card-title>
            <span class="headline">الأحياء</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="بحث"
              prepend-icon="mdi-magnify"
              clearable
              class="mb-4"
            ></v-text-field>

            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
              class="my-4"
            ></v-progress-circular>

            <v-simple-table v-else>
              <thead>
                <tr>
                  <th>اسم الحي بالعربي</th>
                  <th>الوصف بالعربي</th>
                  <th>اسم الحي بالإنجليزي</th>
                  <th>الوصف بالإنجليزي</th>
                  <th>العمليات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredTableData" :key="item.id">
                  <td>{{ item.name_ar }}</td>
                  <td>{{ item.description_ar }}</td>
                  <td>{{ item.name_en }}</td>
                  <td>{{ item.description_en }}</td>
                  <td>
                    <v-icon
                      color="primary"
                      small
                      class="mr-2"
                      @click="setForm(item)"
                      style="cursor: pointer"
                    >
                      mdi-pencil
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="dialog_form" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">تعديل الحي</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-text-field
                  v-model="form.name_ar"
                  label="اسم الحي بالعربي"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.description_ar"
                  label="وصف الحي بالعربي"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.name_en"
                  label="اسم الحي بالإنجليزي"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.description_en"
                  label="وصف الحي بالإنجليزي"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="saveForm">حفظ</v-btn>
              <v-btn color="grey" text @click="dialog_form = false"
                >إلغاء</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { GET_URL, EDIT_URLV2 } from "@/pages/app_settings/url";
import ExportToExcelButton from "@/components/ExportToExcelButton.vue";

export default {
  components: {
    ExportToExcelButton,
  },
  data() {
    return {
      dialog_form: false,
      tableData: [],
      search: "",
      loading: false,
      form: {
        id: null,
        name_ar: "",
        description_ar: "",
        name_en: "",
        description_en: "",
      },
      getApiForForm: {
        getAll: `${GET_URL}/locations/sub-locations`,
        getAllEnglish: `${GET_URL}/locations/sub-locations?lang=en`, // API لجلب البيانات باللغة الإنجليزية
        update: `${EDIT_URLV2}/editsub-location`,
      },
    };
  },
  computed: {
    filteredTableData() {
      if (!this.search) {
        return this.tableData;
      }
      return this.tableData.filter(
        (item) =>
          item.name_ar.toLowerCase().includes(this.search.toLowerCase()) ||
          item.name_en.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const [responseAr, responseEn] = await Promise.all([
          axios.get(this.getApiForForm.getAll, { headers: { lang: "ar" } }),
          axios.get(this.getApiForForm.getAllEnglish, {
            headers: { lang: "en", "accept-language": "en" },
          }),
        ]);

        // بيانات اللغة العربية
        const arabicData =
          responseAr.data && responseAr.data.data
            ? responseAr.data.data.flatMap((item) =>
                item.locations.map((location) => ({
                  id: location.id,
                  name_ar: location.name,
                  description_ar: location.description,
                  name_en: "",
                  description_en: "",
                }))
              )
            : [];

        // بيانات اللغة الإنجليزية
        const englishData =
          responseEn.data && responseEn.data.data
            ? responseEn.data.data.flatMap((item) =>
                item.locations.map((location) => ({
                  id: location.id,
                  name_en: location.name,
                  description_en: location.description,
                }))
              )
            : [];

        // دمج البيانات بناءً على الـ ID
        this.tableData = arabicData.map((arItem) => {
          const enItem = englishData.find((en) => en.id === arItem.id) || {};
          return {
            ...arItem,
            name_en: enItem.name_en || "",
            description_en: enItem.description_en || "",
          };
        });
      } catch (error) {
        console.error("Error fetching neighborhoods:", error);
        this.tableData = [];
      } finally {
        this.loading = false;
      }
    },
    setForm(item) {
      this.form = {
        id: item.id,
        name_ar: item.name_ar,
        description_ar: item.description_ar,
        name_en: item.name_en,
        description_en: item.description_en,
      };
      this.dialog_form = true;
    },
    async saveForm() {
      try {
        // تحديث البيانات بالعربية
        await axios.post(
          `${this.getApiForForm.update}`,
          {
            id: this.form.id,
            name: this.form.name_ar,
            description: this.form.description_ar,
          },
          { headers: { lang: "ar" } }
        );

        // تحديث البيانات بالإنجليزية
        await axios.post(
          `${this.getApiForForm.update}`,
          {
            id: this.form.id,
            name: this.form.name_en,
            description: this.form.description_en,
          },
          { headers: { lang: "en" } }
        );

        this.dialog_form = false;
        this.fetchData(); // جلب البيانات من جديد
      } catch (error) {
        console.error("Error updating neighborhood:", error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.v-simple-table {
  border-collapse: collapse;
}
.v-simple-table th,
.v-simple-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
.v-btn {
  margin: 0;
}
</style>
