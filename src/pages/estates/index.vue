<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- زر "تصدير إلى Excel" كمكون فرعي -->
        <ExportToExcelButton class="excel-btn" :tableData="tableData" />

        <!-- Tabs -->
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab>{{ accepted_estates }} </v-tab>
          <v-tab>{{ rejected_estates }} </v-tab>
          <v-tab>{{ pending_offices_estates }} </v-tab>
          <v-tab>{{ pending_users_estates }} </v-tab>
          <v-tab>{{ deleted_estates }} </v-tab>
          <v-tab>{{ accepted_estates_by_admin }} </v-tab>
        </v-tabs>
        <v-tabs-items class="mt-5" v-model="tab">
          <v-tab-item>
            <!-- List -->
            <Table
              v-if="tab == 0"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :route_name="route_name"
              :title="accepted_estates"
              :api="accepted_api"
              :create="create"
              :edit="edit"
              :showOffice="showOffice"
              :del="del"
              :state="state"
              :show="show"
              :headers="headers"
              @openForm="setForm"
            ></Table>
            <v-pagination
              v-if="tab == 0"
              v-model="pagination.current_page"
              :length="pagination.last_page"
              :total-visible="10"
              :pagination="pagination"
              @input="onPageChange"
            ></v-pagination>
          </v-tab-item>
          <v-tab-item>
            <!-- List -->
            <Table
              v-if="tab == 1"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :route_name="route_name"
              :title="rejected_estates"
              :api="rejected_api"
              :create="create"
              :edit="edit"
              :showOffice="showOffice"
              :del="del"
              :state="state"
              :show="show"
              :headers="headers_reject"
              @openForm="setForm"
            ></Table>
            <v-pagination
              v-if="tab == 1"
              v-model="pagination.current_page"
              :length="pagination.last_page"
              :pagination="pagination"
              :total-visible="10"
              @input="onPageChange"
            ></v-pagination>
          </v-tab-item>
          <v-tab-item>
            <!-- List -->
            <Table
              v-if="tab == 2"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :route_name="route_name"
              :title="pending_offices_estates"
              :api="pending_offices_api"
              :create="create"
              :edit="edit"
              :showOffice="showOffice"
              :del="del"
              :show="show"
              :state="state"
              :linkToAddInformation="linkToAddInformation"
              :headers="headers"
              @openForm="setForm"
            ></Table>
            <v-pagination
              v-if="tab == 2"
              v-model="pagination.current_page"
              :length="pagination.last_page"
              :pagination="pagination"
              :total-visible="10"
              @input="onPageChange"
            ></v-pagination>
          </v-tab-item>
          <v-tab-item>
            <!-- List -->
            <Table
              v-if="tab == 3"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :route_name="route_name"
              :title="pending_users_estates"
              :api="pending_users_api"
              :create="create"
              :edit="edit"
              :showOffice="showOffice"
              :del="del"
              :show="show"
              :state="state"
              :linkToAddInformation="linkToAddInformation"
              :headers="headers_user"
              :showFormSelect="showFormSelect"
              @openForm="setForm"
            ></Table>
            <v-pagination
              v-if="tab == 3"
              v-model="pagination.current_page"
              :length="pagination.last_page"
              :pagination="pagination"
              :total-visible="10"
              @input="onPageChange"
            ></v-pagination>
          </v-tab-item>
          <v-tab-item>
            <!-- List -->
            <Table
              v-if="tab == 4"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :route_name="route_name"
              :title="deleted_estates"
              :api="deleted_api"
              :create="create"
              :edit="edit"
              :showOffice="showOffice"
              :del="del"
              :show="show"
              :state="state"
              :headers="headers"
              @openForm="setForm"
            ></Table>
            <v-pagination
              v-if="tab == 4"
              v-model="pagination.current_page"
              :length="pagination.last_page"
              :pagination="pagination"
              :total-visible="10"
              @input="onPageChange"
            ></v-pagination>
          </v-tab-item>
          <v-tab-item>
            <!-- List -->
            <Table
              v-if="tab == 5"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :route_name="route_name"
              :title="accepted_estates_by_admin"
              :api="accepted_by_admin_api"
              :create="create"
              :edit="edit"
              :showOffice="showOffice"
              :del="del"
              :show="show"
              :state="state"
              :headers="headers"
              @openForm="setForm"
            ></Table>
            <v-pagination
              v-if="tab == 5"
              v-model="pagination.current_page"
              :length="pagination.last_page"
              :pagination="pagination"
              :total-visible="10"
              @input="onPageChange"
            ></v-pagination>
          </v-tab-item>
        </v-tabs-items>
        <!-- Form -->
        <v-dialog v-model="dialog_state" max-width="500px">
          <StatusForm
            v-if="dialog_state"
            :newItemLabel="newItemLabel"
            :isNew="isNew"
            :items="items"
            :value1="value1"
            attr="estate_status_id"
            :api="getApiForForm"
            :id="item_id"
            @dialogForm="dialog_state = false"
          ></StatusForm>
        </v-dialog>
        <v-dialog v-model="dialog_form" max-width="700px">
          <EstateForm
            v-if="dialog_form"
            newItemLabel="العقار"
            :isNew="isNew"
            :api="getApiForForm"
            :id="item_id"
            @dialogForm="dialog_form = false"
          ></EstateForm>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EstateForm from "@/components/Forms/EstateForm";
import StatusForm from "@/components/Forms/StatusForm";
import axios from "@/plugins/axios";

import ExportToExcelButton from "@/components/ExportToExcelButton.vue";

export default {
  data() {
    return {
      tableData: [],
      pagination: {
        current_page: 1,
        next_page: "\/?page=1",
        last_page: 1,
      },
      // value1:false,
      item_id: null,
      tab: 0,
      isNew: true,
      create: false,
      edit: true,
      del: true,
      show: true,
      state: true,
      showOffice: true,
      linkToAddInformation: true,
      showFormSelect: true,
      route_name: "estate",
      newItemLabel: "تغيير حالة العقار",
      filter: "estates",
      accepted_estates: "العقارات المقبولة",
      rejected_estates: "العقارات المرفوضة",
      pending_offices_estates: "عقارات المكاتب قيد الإنتظار",
      pending_users_estates: "عقارات المستخدمين قيد الإنتظار",
      accepted_estates_by_admin: "العقارات المقبولة من الأدمن",
      deleted_estates: "العقارات المحذوفة",
      dialog_form: false,
      dialog_state: false,
      items: [
        { text: "صور غير واضحة", value: "صور غير واضحة" },
        { text: "السعر غير منطقي", value: "السعر غير منطقي" },
        { text: "لايوجد منطقة بهذا الاسم", value: "لايوجد منطقة بهذا الاسم" },
      ],
      accepted_api: {
        getAll: "admin/acceptedEstates",
        edit: "admin/editEstate",
        edit_state: "admin/changeEstateStatus",
        delete: "admin/deleteEstate?estate_id",
      },
      rejected_api: {
        getAll: "admin/rejectedEstates",
        edit: "admin/editEstate",
        edit_state: "admin/changeEstateStatus",
        delete: "admin/deleteEstate?estate_id",
      },
      pending_offices_api: {
        getAll: "admin/officesPendingEstates",
        edit: "admin/editEstate",
        edit_state: "admin/changeEstateStatus",
        delete: "admin/deleteEstate?estate_id",
      },
      pending_users_api: {
        getAll: "admin/usersPendingEstates",
        edit: "admin/editEstate",
        edit_state: "admin/changeEstateStatus",
        delete: "admin/deleteEstate?estate_id",
      },
      deleted_api: {
        getAll: "admin/deletedEstates",
        edit: "admin/editEstate",
        edit_state: "admin/changeEstateStatus",
        delete: "admin/deleteEstate?estate_id",
      },
      accepted_by_admin_api: {
        getAll: "admin/acceptedEstatesByAdmin",
        edit: "admin/editEstate",
        edit_state: "admin/changeEstateStatus",
        delete: "admin/deleteEstate?estate_id",
      },
      title: "العقارات",
      headers: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "المكتب",
          align: "start",
          sortable: true,
          value: "office.name",
        },
        {
          text: "نوع العقار",
          value: "estate_type.name_ar",
        },
        {
          text: "نوع العرض",
          value: "estate_offer_type.name_ar",
        },
        {
          text: "السعر",
          value: "price",
        },
        {
          text: "مكان العقار",
          value: "location.name",
        },
        {
          text: "تاريخ النشر",
          value: "created_at",
        },
        {
          text: "المساحة",
          value: "area",
        },
        {
          text: "عدد الغرف",
          value: "rooms_count",
        },
        {
          text: "المدة",
          value: "period_number",
        },
        // {
        //  text: "عدد الغرف",
        //  value: "rooms"
        // },
        {
          text: "العمليات",
          value: "actions",
          sortable: false,
        },
      ],
      headers_user: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "المستخدم",
          align: "start",
          sortable: true,
          value: "user.first_name",
        },
        {
          text: "رقم الهاتف",
          align: "start",
          sortable: true,
          value: "user.authentication",
        },
        {
          text: "نوع العقار",
          value: "estate_type.name_ar",
        },
        {
          text: "نوع العرض",
          value: "estate_offer_type.name_ar",
        },
        {
          text: "السعر",
          value: "price",
        },
        {
          text: "مكان العقار",
          value: "location.name",
        },
        {
          text: "تاريخ النشر",
          value: "created_at",
        },
        {
          text: "المساحة",
          value: "area",
        },
        {
          text: "عدد الغرف",
          value: "rooms_count",
        },
        {
          text: "المدة",
          value: "period_number",
        },
        // {
        //  text: "عدد الغرف",
        //  value: "rooms"
        // },
        {
          text: "العمليات",
          value: "actions",
          sortable: false,
        },
      ],
      headers_reject: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "المكتب",
          align: "start",
          sortable: true,
          value: "office.name",
        },
        {
          text: "نوع العقار",
          value: "estate_type.name_ar",
        },
        {
          text: "نوع العرض",
          value: "estate_offer_type.name_ar",
        },
        {
          text: "السعر",
          value: "price",
        },
        {
          text: "مكان العقار",
          value: "location.name",
        },
        {
          text: "تاريخ النشر",
          value: "created_at",
        },
        {
          text: "المساحة",
          value: "area",
        },
        {
          text: "سبب الرفض",
          value: "reject_reason",
        },
        // {
        //  text: "عدد الغرف",
        //  value: "rooms"
        // },
        {
          text: "العمليات",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  components: {
    StatusForm,
    EstateForm,
    ExportToExcelButton,
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    getApiForForm() {
      switch (this.tab) {
        case 0:
          return this.accepted_api;
        case 1:
          return this.rejected_api;
        case 2:
          return this.pending_offices_api;
        case 3:
          return this.pending_users_api;
        case 4:
          return this.deleted_api;
        case 5:
          return this.accepted_by_admin_api;
        default:
          break;
      }
    },
  },
  methods: {
    updateApi() {
      (this.accepted_api = {
        getAll: `admin/acceptedEstates?page=${this.pagination.current_page}`,
        edit: "admin/editEstate",
        edit_state: "admin/changeEstateStatus",
        delete: "admin/deleteEstate?estate_id",
      }),
        (this.rejected_api = {
          getAll: `admin/rejectedEstates?page=${this.pagination.current_page}`,
          edit: "admin/editEstate",
          edit_state: "admin/changeEstateStatus",
          delete: "admin/deleteEstate?estate_id",
        }),
        (this.pending_offices_api = {
          getAll: `admin/officesPendingEstates?page=${this.pagination.current_page}`,
          edit: "admin/editEstate",
          edit_state: "admin/changeEstateStatus",
          delete: "admin/deleteEstate?estate_id",
        }),
        (this.pending_users_api = {
          getAll: `admin/usersPendingEstates?page=${this.pagination.current_page}`,
          edit: "admin/editEstate",
          edit_state: "admin/changeEstateStatus",
          delete: "admin/deleteEstate?estate_id",
        }),
        (this.deleted_api = {
          getAll: `admin/deletedEstates?page=${this.pagination.current_page}`,
          edit: "admin/editEstate",
          edit_state: "admin/changeEstateStatus",
          delete: "admin/deleteEstate?estate_id",
        }),
        (this.accepted_by_admin_api = {
          getAll: `admin/acceptedEstatesByAdmin?page=${this.pagination.current_page}`,
          edit: "admin/editEstate",
          edit_state: "admin/changeEstateStatus",
          delete: "admin/deleteEstate?estate_id",
        });
    },
    getApiUrl() {
      let apiUrl = "";

      switch (this.tab) {
        case 0:
          apiUrl = "admin/acceptedEstates";
          this.$store.dispatch("fetchTableData", { api: this.accepted_api });
          break;
        case 1:
          apiUrl = "admin/rejectedEstates";
          this.$store.dispatch("fetchTableData", { api: this.rejected_api });
          break;
        case 2:
          apiUrl = "admin/officesPendingEstates";
          this.$store.dispatch("fetchTableData", {
            api: this.pending_offices_api,
          });
          break;
        case 3:
          apiUrl = "admin/usersPendingEstates";
          this.$store.dispatch("fetchTableData", {
            api: this.pending_users_api,
          });
          break;
        case 4:
          apiUrl = "admin/deletedEstates";
          this.$store.dispatch("fetchTableData", { api: this.deleted_api });
          break;
        case 5:
          apiUrl = "admin/acceptedEstatesByAdmin";
          this.$store.dispatch("fetchTableData", {
            api: this.accepted_by_admin_api,
          });
        default:
          break;
      }

      // Append pagination parameters to the API URL
      apiUrl += `?page=${this.pagination.current_page}`;

      return apiUrl;
    },

    async fetchData() {
      const response = await axios.get(this.getApiUrl());
      this.pagination = response.data.pagination;
      this.tableData = response.data.data || [];
    },
    onPageChange(page) {
      if (page === "next") {
        // Navigate to the route with the next page
        this.pagination.current_page = this.pagination.next_page;
      } else if (page === "prev") {
        // Navigate to the route with the previous page
        this.pagination.current_page = this.pagination.current_page - 1;
      } else {
        // Set the current page to the clicked page number
        this.pagination.current_page = page;
      }
      this.updateApi();
      this.fetchData();
    },
    setForm(val) {
      this.fetchData();

      //  console.log(val);
      let form = {
        estate_status_id: "",
        estate_office_id: "", //
        price: "",
        floor: "",
        ownership_type_id: "", //
        estate_offer_type_id: "", //
        interior_status_id: "", //
        period_type_id: "", //
        location_id: "", //
        area_unit_id: "", //
        estate_type_id: "", //
        longitude: "",
        latitude: "",
        period_type_id: "",
        area: "", //
        nearby_places: "", //
        rooms_count: "",
        is_furnished: false,
        floor_plan: "",
        description: "",
        swimming_pool: 0,
        on_beach: "",
        period_number: "",
        images: [],
      };
      // initialize form
      this.$store.dispatch("initForm", form);

      // edit
      if (val != null) {
        this.isNew = false;
        // edit state
        if (val.hasOwnProperty("hasState")) {
          form = {
            estate_id: null,
            estate_status_id: null,
          };
          this.$store.dispatch("initForm", form);
          if (val.item.hasOwnProperty("id")) {
            this.item_id = val.item.id;
          }
          this.$store.dispatch("setForm", {
            estate_id: val.item.id,
          });
          this.dialog_state = true;
        } // edit estate
        else {
          Object.keys(form).map((x) => {
            if (x.includes("_id")) {
              if (val[x.replace("_id", "")]) {
                if (x != "location_id") {
                  form[x] = val[x.replace("_id", "")].id;
                } else {
                  form[x] = val[x.replace("_id", "")].id;
                }
              } else {
                form["estate_office_id"] = val["office"].id;
              }
            } else {
              form[x] = val[x];
            }
          });
          if (val.hasOwnProperty("id")) {
            this.item_id = val.id;
          }
          this.$store.dispatch("setForm", form);
          this.dialog_form = true;
        }
        // create
      } else {
        this.isNew = true;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    tab(newTab) {
      this.pagination.current_page = 1;
      this.pagination.last_page = 1;
      this.pagination.next_page = "\/?page=1";
      this.fetchData();

      if (newTab === 3) {
        this.value1 = true;
      } else {
        this.value1 = false;
      }
    },
    "pagination.current_page"(newPage) {
      this.fetchData();
    },
  },
};
</script>
<style>
.v-menu__content {
  box-shadow: 0 3px 11px 0, 0 3px 3px -2px #b2b2b21a, 0 1px 8px 0 #9a9a9a1a !important;
}
.excel-btn {
  margin-bottom: 5px;
}
</style>