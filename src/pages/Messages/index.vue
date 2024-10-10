<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
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
              :mark="mark"
              :del="del"
              :state="state"
              :show="show"
              :headers="headers_panding"
              @openForm="setForm"
            >
              <template v-slot:item.status="{ item }">
                <div :class="getStatusStyle(item.status)"></div>
                <span v-if="item.status !== 'new'"></span>
              </template>
            </Table>
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
import ExportToExcelButton from "@/components/ExportToExcelButton.vue";
import StatusForm from "@/components/Forms/StatusForm";
import axios from "@/plugins/axios";

export default {
  data() {
    return {
      item_id: null,
      tab: 0,
      isNew: true,
      create: false,
      edit: false,
      mark: true,
      del: true,
      show: false,
      state: false,
      route_name: "transactions-candidate",
      newItemLabel: "تغيير حالة عملية الشراء للترشيحات",
      filter: "",
      pending_packets: "رسائل تواصل معنا",

      dialog_form: false,
      dialog_state: false,
      pending_api_packets: {
        getAll: "message/getAll",
        delete: "message/delete?message_id",
      },

      title: "رسائل تواصل معنا",
      headers_panding: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "أسم المرسل",
          value: "name",
        },
        {
          text: "رقم الموبايل",
          value: "mobile",
        },
        {
          text: "إيميل المرسل",
          value: "sender_email",
        },
        {
          text: "الموضوع",
          value: "subject",
        },
        {
          text: "الرسالة",
          value: "message",
        },
        {
          text: "الحالة",
          value: "status",
          cellClass: (item) => this.getStatusStyle(item.status),
        },
        {
          text: "تاريخ الارسال ",
          value: "created_at",
        },
        {
          text: "العمليات",
          value: "actions",
          sortable: false,
        },
      ],
      tableData: [],
    };
  },
  components: {
    StatusForm,
    ExportToExcelButton,
  },
  computed: {
    getApiForForm() {
      return this.pending_api_packets;
    },
  },
  methods: {
    getStatusStyle(status) {
      return status === "new" ? "status-circle" : "";
    },

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
        this.tableData = response.data.data || [];
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    getApiUrl() {
      return this.pending_api_packets.getAll;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
<style scoped>
.status-circle {
  width: 10px; /* يمكن تعديل الحجم حسب الحاجة */
  height: 10px; /* يمكن تعديل الحجم حسب الحاجة */
  background-color: red; /* لون الدائرة */
  border-radius: 50%; /* لجعلها دائرة */
  display: inline-block;
}
</style>
