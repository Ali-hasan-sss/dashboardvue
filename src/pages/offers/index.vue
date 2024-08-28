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
          @openForm="setForm"
        ></Table>
        <!-- Form -->
        <v-dialog v-model="dialog_form" max-width="500px">
          <GeneralForm
            v-if="dialog_form"
            :fields="fields"
            newItemLabel="عرض"
            :isNew="isNew"
            :api="api"
            @saveForm="handleFormSave"
            @dialogForm="dialog_form = false"
          ></GeneralForm>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GeneralForm from "../../components/Forms/GeneralForm";
import ExportToExcelButton from "../../components/ExportToExcelButton.vue";
import axios from "../../plugins/axios";

export default {
  components: { GeneralForm, ExportToExcelButton },
  data() {
    return {
      tableData: [],
      isNew: true,
      dialog_form: false,
      api: {
        getAll: "offers",
        create: "offers",
        delete: "offer?offer_id",
      },
      create: true,
      del: true,
      edit: false,
      filter: "offers",
      title: "العروض العقارية",
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
      const form = {
        size: null,
        price: null,
      };
      this.$store.dispatch("initForm", form);

      if (val) {
        this.isNew = false;
        this.$store.dispatch("setForm", val);
      } else {
        this.isNew = true;
      }
      this.dialog_form = true;
    },
    async fetchData() {
      try {
        const response = await axios.get(this.api.getAll);
        this.tableData = response.data.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async handleFormSave() {
      try {
        const apiEndpoint = this.isNew
          ? this.api.create
          : `${this.api.create}/${this.$store.getters.getForm.id}`;

        if (this.isNew) {
          await axios.post(apiEndpoint, this.$store.getters.getForm);
        } else {
          await axios.put(apiEndpoint, this.$store.getters.getForm);
        }

        this.dialog_form = false;
        this.fetchData(); // تحديث البيانات بعد إضافة العرض الجديد
      } catch (error) {
        console.error("Error saving form:", error);
      }
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>
