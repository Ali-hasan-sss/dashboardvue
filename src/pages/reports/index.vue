<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- زر "تصدير إلى Excel" كمكون فرعي -->
        <ExportToExcelButton class="excel-btn" :tableData="tableData" />

        <!-- Tabs -->
        <v-tabs-items class="mt-5" v-model="tab">
          <v-tab-item>
            <!-- List -->
            <Table
              v-if="tab == 0"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :route_name="route_name"
              :title="pending_packets"
              :api="pending_api_packets"
              :create="create"
              :edit="edit"
              :del="del"
              :state="state"
              :show="show"
              :headers="headers_panding"
              @openForm="setForm"
            ></Table>
          </v-tab-item>
        </v-tabs-items>

        <!-- Form -->
        <v-dialog v-model="dialog_state" max-width="500px">
          <StatusForm
            v-if="dialog_state"
            :newItemLabel="newItemLabel"
            :isNew="isNew"
            :attr="transaction_id"
            :api="getApiForForm"
            :id="item_id"
            @dialogForm="dialog_state = false"
          ></StatusForm>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StatusForm from "@/components/Forms/StatusForm";
import ExportToExcelButton from "@/components/ExportToExcelButton.vue";
import axios from "axios";

export default {
  components: {
    StatusForm,
    ExportToExcelButton,
  },
  data() {
    return {
      item_id: null,
      tab: 0,
      isNew: true,
      create: false,
      edit: false,
      del: false,
      show: true,
      state: false,
      route_name: "transactions-candidate",
      newItemLabel: "تغيير حالة عملية الشراء للترشيحات",
      filter: "",
      pending_packets: "تقارير المستخدمين",
      dialog_form: false,
      dialog_state: false,
      pending_api_packets: {
        getAll: "reports",
        edit_state: "admin/acceptOrRejectPendingTransactions",
      },
      title: "تقارير المستخدمين",
      headers_panding: [
        {
          text: "المكتب",
          align: "start",
          sortable: true,
          value: "estate.office.name",
        },
        {
          text: "أسم المستخدم",
          value: "user.first_name",
        },
        {
          text: "التواصل مع المستخدم",
          value: "user.authentication",
        },
        {
          text: "نوع عرض العقار",
          value: "estate.estate_offer_type.name_ar",
        },
        {
          text: "المشكلة",
          value: "report_type.name_ar",
        },
        {
          text: "العمليات",
          value: "actions",
          sortable: false,
        },
      ],
      tableData: [], // البيانات التي سيتم تصديرها إلى Excel
    };
  },

  computed: {
    getApiForForm() {
      return this.pending_api_packets;
    },
  },

  methods: {
    setForm(val) {
      let form = {
        transaction_id: "",
      };
      this.$store.dispatch("initForm", form);

      if (val != null) {
        this.isNew = false;
        if (val.hasOwnProperty("hasState")) {
          form = {
            transaction_id: null,
          };
          this.$store.dispatch("initForm", form);
          if (val.item.hasOwnProperty("id")) {
            this.item_id = val.item.id;
          }
          this.$store.dispatch("setForm", {
            transaction_id: val.item.id,
          });
          this.dialog_state = true;
        }
      }
    },

    async fetchData() {
      try {
        const response = await axios.get(this.getApiUrl());
        console.log("Fetched Data:", response.data); // تحقق من البيانات القادمة من الـ API
        this.tableData = response.data.data || []; // تحديث tableData
        console.log("Updated tableData:", this.tableData); // تحقق من أن tableData يتم تحديثه بشكل صحيح
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    getApiUrl() {
      return this.pending_api_packets.getAll; // التأكد من أن API URL يتم استرجاعه بشكل صحيح
    },
  },

  mounted() {
    this.fetchData(); // جلب البيانات عند تحميل الصفحة
  },
};
</script>
