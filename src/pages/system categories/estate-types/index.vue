<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- زر "إضافة نوع عقار" -->
        <v-btn @click="setForm()" color="primary">إضافة نوع عقار</v-btn>

        <!-- قائمة الأنواع -->
        <v-data-table
          :headers="headers"
          :items="estateTypes"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small @click.stop="setForm(item)">mdi-pencil</v-icon>
            <v-icon small @click.stop="deleteItem(item.id)">mdi-delete</v-icon>
            <v-switch
              v-model="item.is_active"
              @change="toggleActivation(item)"
              :label="item.is_active ? 'مفعل' : 'معطل'"
            ></v-switch>
          </template>
        </v-data-table>

        <!-- نموذج التعديل والإضافة -->
        <v-dialog v-model="dialog_form" max-width="500px">
          <EstateTypeForm
            :formData="currentFormData"
            :isNew="isNew"
            :api="api"
            @save="handleSave"
            @dialogForm="dialog_form = false"
          ></EstateTypeForm>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EstateTypeForm from "@/components/Forms/System Categories/EstateTypeForm.vue";
import axios from "axios";

export default {
  components: { EstateTypeForm },
  data() {
    return {
      isNew: true,
      dialog_form: false,
      api: {
        getAll: "estateTypes",
        create: "newEstateType",
        update: "updateEstateType",
        delete: "deleteEstateType",
        toggleActivation: "toggleEstateTypeActivation",
      },
      title: "أنواع العقارات",
      filter: "estate-types",
      estateTypes: [], // تأكد من أن هذه مصفوفة
      currentFormData: {}, // بيانات النموذج
      headers: [
        { text: "#", align: "start", value: "id", sortable: false },
        {
          text: "الأسم بالعربي",
          align: "start",
          value: "name_ar",
          sortable: false,
        },
        {
          text: "الأسم بالإنجليزي",
          align: "start",
          value: "name_en",
          sortable: false,
        },
        {
          text: "العمليات",
          align: "center",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    async fetchEstateTypes() {
      try {
        const response = await axios.get(this.api.getAll);
        // تحقق من البنية الصحيحة للبيانات
        if (response.data && Array.isArray(response.data.data)) {
          this.estateTypes = response.data.data;
        } else {
          console.error("Unexpected data structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching estate types:", error);
      }
    },
    setForm(item = null) {
      this.isNew = !item;
      this.currentFormData = item ? { ...item } : {};
      this.dialog_form = true;
    },
    async handleSave(formData) {
      try {
        if (this.isNew) {
          await axios.post(this.api.create, formData);
        } else {
          await axios.put(`${this.api.update}/${formData.id}`, formData);
        }
        this.fetchEstateTypes(); // إعادة تحميل البيانات بعد الحفظ
        this.dialog_form = false;
      } catch (error) {
        console.error("Error saving estate type:", error);
      }
    },
    async deleteItem(itemId) {
      try {
        await axios.delete(`${this.api.delete}/${itemId}`);
        this.fetchEstateTypes(); // إعادة تحميل البيانات
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    async toggleActivation(item) {
      try {
        await axios.post(`${this.api.toggleActivation}/${item.id}`, {
          is_active: item.is_active,
        });
      } catch (error) {
        console.error("Error toggling activation:", error);
      }
    },
  },
  mounted() {
    this.fetchEstateTypes(); // تحميل البيانات عند تحميل الصفحة
  },
};
</script>
