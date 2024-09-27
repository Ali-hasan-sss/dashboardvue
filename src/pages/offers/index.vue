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
      edit: true,
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
        const form = this.$store.getters.getForm;
        if (!this.isNew && !form.id) {
          throw new Error("معرف العرض غير موجود!");
        }

        const apiEndpoint = this.isNew
          ? this.api.create
          : `${this.api.create}/${form.id}`;

        if (this.isNew) {
          await axios.post(apiEndpoint, form);
        } else {
          await axios.put(apiEndpoint, form);
        }

        this.dialog_form = false;
        this.fetchData();
      } catch (error) {
        console.error("Error saving form:", error);
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete(`${this.api.delete}=${id}`);
        this.fetchData();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
  },
  watch: {
    fields(newFields) {
      console.log("Received fields:", newFields);
    },
    isNew(newIsNew) {
      console.log("Is new:", newIsNew);
    },
    api(newApi) {
      console.log("API:", newApi);
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>
