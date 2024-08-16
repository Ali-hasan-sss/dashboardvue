<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <ExportToExcelButton class="excel-btn" :tableData="tableData" />

        <!-- List -->
        <Table
          newItemLabel="التقييمات"
          :filter="filter"
          :title="title"
          :api="api"
          :rating="rating"
          :create="create"
          :edit="edit"
          :del="del"
          :headers="headers"
          @openForm="setForm"
        ></Table>

        <!-- Form -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ExportToExcelButton from "@/components/ExportToExcelButton.vue";
import axios from "@/plugins/axios";
export default {
  components: { ExportToExcelButton },

  data() {
    return {
      isNew: true,
      rating: true,
      dialog_form: false,
      edit: false,
      del: false,
      create: false,
      api: {
        getAll: "applicationRating/getAll",
      },
      filter: "rates",
      title: "تقييمات المستخدمين ",
      headers: [
        {
          text: "رمز المستخدم",
          align: "start",
          sortable: false,
          value: "user_id",
        },
        {
          text: "اسم المستخدم",
          align: "start",
          sortable: false,
          value: "user_name",
        },
        {
          text: "التقيم",
          align: "start",
          sortable: false,
          value: "rating",
        },
        {
          text: "الملاحظة",
          align: "start",
          sortable: false,
          value: "notes",
        },
        {
          text: "تاريخ التقييم",
          align: "start",
          sortable: false,
          value: "created_at",
        },
      ],
      tableData: [],
    };
  },

  methods: {
    setForm(val) {
      let form = {
        name: "",
      };
      this.$store.dispatch("initForm", form);
      if (val != null) {
        this.isNew = false;
        this.$store.dispatch("setForm", val);
      } else {
        this.isNew = true;
      }
      this.dialog_form = true;
    },
    async fetchData() {
      try {
        const response = await axios.get(this.getApiUrl());
        this.tableData = response.data.data || [];
        //   console.log("Fetched Data:", this.tableData); // تحقق من البيانات
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    getApiUrl() {
      return this.api.getAll;
    },
  },
  mounted() {
    this.fetchData(); // جلب البيانات عند تحميل الصفحة
  },
};
</script>
