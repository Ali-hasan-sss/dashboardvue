<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <ExportToExcelButton class="excel-btn" :tableData="tableData" />
        <!-- Tabs -->
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab>{{ accepted_estates }}</v-tab>
          <v-tab>{{ pending_estates }}</v-tab>
          <v-tab>{{ rejected_estates }}</v-tab>
        </v-tabs>
        <v-tabs-items class="mt-5" v-model="tab">
          <v-tab-item>
            <!-- List -->
            <Table
              v-if="tab === 0"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :showOffice="showOffice"
              :route_name="route_name"
              :title="accepted_estates"
              :api="accepted_api"
              :create="create"
              :show="show"
              :order="order"
              :edit="edit"
              :del="del"
              :state="state_after"
              :headers="headers"
              @openForm="setForm"
            />
            <v-pagination
              v-if="tab === 0"
              v-model="pagination.current_page"
              :length="pagination.last_page"
              :total-visible="10"
              :pagination="pagination"
              @input="onPageChange"
            />
          </v-tab-item>
          <v-tab-item>
            <!-- List -->
            <Table
              v-if="tab === 1"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :showOffice="showOffice"
              :route_name="route_name"
              :title="pending_estates"
              :api="pending_api"
              :create="create"
              :show="show"
              :order="order"
              :edit="edit"
              :del="del"
              :state="state"
              :headers="headers"
              @openForm="setForm"
            />
            <v-pagination
              v-if="tab === 1"
              v-model="pagination.current_page"
              :length="pagination.last_page"
              :total-visible="10"
              :pagination="pagination"
              @input="onPageChange"
            />
          </v-tab-item>

          <v-tab-item>
            <Table
              v-if="tab === 2"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :showOffice="showOffice"
              :route_name="route_name"
              :title="rejected_estates"
              :api="rejected_api"
              :create="create"
              :order="order"
              :edit="edit"
              :del="del"
              :state="state_after"
              :show="show"
              :headers="headers"
              @openForm="setForm"
            />
            <v-pagination
              v-if="tab === 2"
              v-model="pagination.current_page"
              :length="pagination.last_page"
              :total-visible="10"
              :pagination="pagination"
              @input="onPageChange"
            />
          </v-tab-item>
        </v-tabs-items>
        <!-- Form -->
        <v-dialog v-model="dialog_form" max-width="500px">
          <StatusForm
            v-if="dialog_form"
            newItemLabel="تغيير حالة العقار"
            :id="item_id"
            :items="items"
            attr="order_status_id"
            :isNew="isNew"
            :api="pending_api"
            @dialogForm="dialog_state = false"
          />
        </v-dialog>
        <v-dialog v-model="dialog_order" max-width="500px">
          <orderDailog
            v-if="dialog_order"
            newItemLabel="تفاصيل الطلب"
            :item="item"
            @dialogForm="dialog_order = false"
          />
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import orderDailog from "@/components/orderDailog";
import StatusForm from "@/components/Forms/StatusForm";
import axios from "@/plugins/axios";

import ExportToExcelButton from "@/components/ExportToExcelButton.vue";

export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        next_page: 2,
        last_page: 1,
      },
      item_id: null,
      item: "",
      tab: 0,
      isNew: true,
      create: false,
      edit: false,
      state: true,
      order: true,
      state_after: false,
      del: true,
      show: false,
      showOffice: false,
      newItemLabel: "طلب",
      filter: "estate_orders",
      route_name: "order",
      accepted_estates: "الطلبات العقارية المقبولة",
      pending_estates: "الطلبات العقارية قيد الإنتظار",
      rejected_estates: "الطلبات العقارية المرفوضة",
      dialog_form: false,
      dialog_order: false,
      dialog_state: false,
      items: [
        { text: "صور غير واضحة", value: "صور غير واضحة" },
        { text: "السعر غير منطقي", value: "السعر غير منطقي" },
        { text: "لايوجد منطقة بهذا الاسم", value: "لايوجد منطقة بهذا الاسم" },
      ],
      accepted_api: {
        getAll: "estateOrder/showAll",
        edit: "admin/acceptOrRejectUsersPendingEstateOrders",
        delete: "admin/deleteEstateOrder?estate_order_id",
      },
      pending_api: {
        getAll: "admin/pendingEstateOrders",
        edit: "admin/acceptOrRejectUsersPendingEstateOrders",
        delete: "admin/deleteEstateOrder?estate_order_id",
      },
      rejected_api: {
        getAll: "admin/getRejectedEstateOrders",
        delete: "admin/deleteEstateOrder?estate_order_id",
      },
      title: "الطلبات العقارية",
      headers: [
        { text: "#", value: "id" },
        { text: "اسم المستخدم", value: "user.first_name" },
        { text: "رقم الهاتف", value: "user.authentication" },
        { text: "نوع العقار", value: "estate_type.name_ar" },
        { text: "نوع العرض", value: "estate_offer_type.name_ar" },
        { text: "المنطقة", value: "location.locations[0].name" },
        { text: "السعر الأصغري", value: "min_price" },
        { text: "السعر الأقصى", value: "max_price" },
        { text: "ملاحظات", value: "notes" },
        { text: "العمليات", value: "actions", sortable: false },
      ],
    };
  },
  components: {
    StatusForm,
    orderDailog,
    ExportToExcelButton,
  },
  methods: {
    updateApi() {
      const apiUrl = this.getApiUrl();
      axios
        .get(apiUrl)
        .then((response) => {
          this.tableData = response.data.data || [];
          this.pagination = response.data.pagination;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },

    getApiUrl() {
      switch (this.tab) {
        case 0:
          return `estateOrder/showAll?page=${this.pagination.current_page}`;
        case 1:
          return `admin/pendingEstateOrders?page=${this.pagination.current_page}`;
        case 2:
          return `admin/getRejectedEstateOrders?page=${this.pagination.current_page}`;
        default:
          return "";
      }
    },
    async fetchData() {
      try {
        const apiUrl = this.getApiUrl();
        const response = await axios.get(apiUrl);
        this.tableData = response.data.data || [];
        this.pagination = response.data.pagination;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    onPageChange(page) {
      this.pagination.current_page = page;
      this.updateApi();
      this.fetchData();
    },
    setForm(val) {
      if (val.hasOwnProperty("order")) {
        this.item = val.order;
        this.dialog_order = true;
      } else {
        if (val.hasOwnProperty("hasState")) {
          val = val.item;
        }
        if (val.hasOwnProperty("id")) {
          this.item_id = val.id;
        }

        this.$store.dispatch("initForm", {
          order_status_id: val?.order_status?.id || "",
          estate_order_id: val?.id || "",
        });

        this.isNew = !val;
        this.dialog_form = true;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    tab() {
      this.pagination.current_page = 1;
      this.fetchData();
    },
    "pagination.current_page"() {
      this.updateApi();
    },
  },
};
</script>
<style scoped>
.excel-btn {
  margin-bottom: 5px;
}
</style>
