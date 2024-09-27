<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>قائمة التطبيق</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="variables"
          item-value="id"
          class="elevation-1"
        >
          <template v-slot:item.icon="{ item }">
            <img class="icon" :src="item.icon" max-width="50" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="editVariables">تعديل جميع العناصر</v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="editDialog" max-width="800px">
      <v-card>
        <v-card-title>تعديل جميع العناصر</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="formValid">
            <v-row
              class="form_item"
              v-for="variable in variables"
              :key="variable.id"
            >
              <v-col cols="12" md="4">
                <v-text-field
                  class="input"
                  v-model="variable.title.ar"
                  label="الاسم بالعربي"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  class="input"
                  v-model="variable.title.en"
                  label="الاسم بالإنجليزي"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-file-input
                  class="input"
                  label="رفع أيقونة (SVG)"
                  accept=".svg"
                  v-model="variable.iconFile"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveAllChanges">حفظ التعديلات</v-btn>
          <v-btn color="red" @click="editDialog = false">إلغاء</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "EditVariables",
  data() {
    return {
      variables: [],
      editDialog: false,
      formValid: false,
      requiredRule: (v) => !!v || "هذا الحقل مطلوب",
      headers: [
        { text: "الاسم بالعربي", value: "title.ar" },
        { text: "الاسم بالإنجليزي", value: "title.en" },
        { text: "الأيقونة", value: "icon" },
      ],
    };
  },
  mounted() {
    this.fetchVariables();
  },
  methods: {
    async fetchVariables() {
      try {
        const responseEn = await axios.get(
          "https://swess.store/api/v2/app/getVariables",
          {
            headers: {
              lang: "en",
            },
          }
        );

        const responseAr = await axios.get(
          "https://swess.store/api/v2/app/getVariables",
          {
            headers: {
              lang: "ar",
            },
          }
        );

        this.variables = responseEn.data.data.map((variableEn, index) => {
          const variableAr = responseAr.data.data[index] || {};

          return {
            ...variableEn,
            title: {
              ar: variableAr.title || "الاسم غير متوفر",
              en: variableEn.title || "Name not available",
            },
            iconFile: null,
          };
        });
      } catch (error) {
        this.$toast.error("خطأ في جلب البيانات:", error);
      }
    },
    editVariables() {
      this.editDialog = true;
    },
    async saveAllChanges() {
      const form = this.$refs.editForm;

      if (form.validate()) {
        const formData = new FormData();

        this.variables.forEach((variable, index) => {
          formData.append(`variables[${index}][id]`, variable.id);
          formData.append(`variables[${index}][key]`, variable.key);
          formData.append(`variables[${index}][title][ar]`, variable.title.ar);
          formData.append(`variables[${index}][title][en]`, variable.title.en);

          if (variable.iconFile) {
            formData.append(`variables[${index}][icon]`, variable.iconFile);
          }
        });

        try {
          const response = await axios.post(
            "https://swess.store/api/editAppVariables",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          this.$toast.success("تم تعديل البيانات بنجاح");
          this.editDialog = false;
        } catch (error) {
          this.$toast.error("خطأ في حفظ التعديلات");
        }
      } else {
        this.$toast.error("أكمل الحقول المطلوبة");
      }
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 1.5rem;
}

.icon {
  width: 50px;
  height: 50px;
}
.form_item {
  background-color: rgb(189, 213, 213);
  margin: 10px;
  border-radius: 10px;
}
.input {
  margin: 0;
  padding: 0;
}
</style>
