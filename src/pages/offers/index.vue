<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- تصدير إلى Excel -->
        <ExportToExcelButton :tableData="tableData" />

        <!-- List -->
        <Table
          newItemLabel="باقة عروض"
          :filter="filter"
          :title="title"
          :api="api"
          :create="create"
          :del="del"
          :edit="edit"
          :headers="headers"
          :items="tableData"
          @openForm="setForm"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="setForm(item)" color="primary"
              >mdi-pencil</v-icon
            >
            <!-- تعديل -->
            <v-icon small @click="deleteItem(item.id)" color="red"
              >mdi-delete</v-icon
            >
            <!-- حذف -->
          </template>
        </Table>

        <!-- Dialog for creating a new item -->
        <v-dialog v-model="dialog_form" max-width="500px">
          <GeneralForm
            v-if="dialog_form && isNew"
            :fields="fields"
            newItemLabel="إنشاء عرض"
            :isNew="isNew"
            :api="api"
            @saveForm="handleFormSave"
            @dialogForm="dialog_form = false"
          />
          <!-- Dialog for editing an existing item -->
          <EditForm
            v-if="dialog_form && !isNew"
            :initialData="currentItem"
            @saveForm="handleFormSave"
            @close="dialog_form = false"
          />
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GeneralForm from "../../components/Forms/GeneralForm.vue";
import EditForm from "./EditForm.vue";
import ExportToExcelButton from "../../components/ExportToExcelButton.vue";
import axios from "../../plugins/axios";

export default {
  components: { GeneralForm, EditForm, ExportToExcelButton },
  data() {
    return {
      tableData: [],
      isNew: true,
      dialog_form: false,
      api: {
        getAll: "offers",
        create: "offers",
        edit: "offer",
        delete: "offer?offer_id",
      },
      create: true,
      del: true,
      edit: true,
      filter: "offers",
      title: "العروض العقارية",
      currentItem: {
        size: null,
        price: null,
      },
      fields: [
        {
          name: "الحجم",
          key: "size",
        },
        {
          name: "السعر",
          key: "price",
        },
      ],
      headers: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "الحجم",
          value: "size",
        },
        {
          text: "السعر",
          value: "price",
        },
        {
          text: "",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    setForm(val) {
      if (val) {
        this.currentItem = { ...val }; // تعيين العنصر الحالي
        this.isNew = false; // ضبط الوضع على تعديل
      } else {
        this.currentItem = { size: null, price: null }; // إعادة تعيين القيم الجديدة
        this.isNew = true; // ضبط الوضع على إنشاء
      }

      this.dialog_form = true; // فتح الحوار
    },
    async fetchData() {
      try {
        const response = await axios.get(this.api.getAll);
        this.tableData = response.data.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async handleFormSave(formData) {
      try {
        const apiEndpoint = this.isNew
          ? this.api.create
          : `${this.api.edit}/${this.currentItem.id}`; // استخدام ID عند التعديل

        const response = this.isNew
          ? await axios.post(apiEndpoint, formData)
          : await axios.put(apiEndpoint, formData);

        console.log("Response:", response.data);
        this.dialog_form = false; // إغلاق الحوار
        this.fetchData(); // تحديث البيانات
        this.$toast.success("تم تعديل العرض بنجاح");
      } catch (error) {
        console.error("Error saving form:", error);
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete(`${this.api.delete}=${id}`);
        this.fetchData(); // تحديث البيانات بعد الحذف
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
  },
  mounted() {
    this.fetchData(); // جلب البيانات عند التحميل
  },
};
</script>
