<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <AddRealEstateOfficeButton @openForm="setForm" class="btn" />

        <v-dialog v-model="dialog_form" max-width="500px">
          <OfficeForm
            v-if="dialog_form"
            :isNew="isNew"
            :api="api"
            :id="item_id"
            @dialogForm="closeForm"
            @fetchData="afterFormSubmit"
          ></OfficeForm>
        </v-dialog>
        <ExportToExcelButton class="btn" :tableData="data" />

        <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>
        <Table
          v-else
          newItemLabel="مكتب"
          :filter="filter"
          :title="title"
          :contract_del="contract_del"
          :api="api"
          :create="create"
          :showOffice="showOffice"
          :edit="edit"
          :subscribe="subscribe"
          :del="del"
          :headers="headers"
          :items="data"
          @openForm="setForm"
        ></Table>

        <v-pagination
          v-model="pagination.current_page"
          :length="pagination.last_page"
          :pagination="pagination"
          :total-visible="10"
          @input="onPageChange"
        ></v-pagination>

        <!-- نموذج إدارة العقود -->
        <v-dialog v-model="dialog_agreement" max-width="500px">
          <OfficeAgreementForm
            v-if="dialog_agreement"
            :isNew="isNew"
            :api="api.contract"
            :id="item_id"
            @dialogForm="dialog_agreement = false"
          ></OfficeAgreementForm>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OfficeForm from "../../components/Forms/OfficeForm.vue";
import OfficeAgreementForm from "../../components/Forms/OfficeAgreementForm.vue";
import AddRealEstateOfficeButton from "../../components/AddRealEstateOfficeButton.vue";
import ExportToExcelButton from "../../components/ExportToExcelButton.vue";
import { mapActions } from "vuex";
import axios from "../../plugins/axios.js";

export default {
  components: {
    OfficeForm,
    OfficeAgreementForm,
    AddRealEstateOfficeButton,
    ExportToExcelButton,
  },
  data() {
    return {
      dialog_form: false,
      isNew: true,
      item_id: null,
      pagination: {
        current_page: 1,
        next_page: "/?page=1",
        last_page: 1,
      },
      dialog_agreement: false,
      contract_del: true,
      create: false,
      edit: false,
      del: false,
      showOffice: true,
      subscribe: true,
      api: {
        getAll: "admin/allOffices",
        create: "admin/createOffice",
        delete: "office/delete?office_id",
        edit: "admin/editEstate",
        contract: "office/newContract",
      },
      filter: "alloffices",
      title: "المكاتب العقارية",
      headers: [
        { text: "#", align: "start", sortable: false, value: "id" },
        {
          text: "الاسم",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "الهاتف", value: "mobile" },
        { text: "المحافظة", value: "location.name" },
        { text: "المنطقة", value: "location.locations[0].name" },
        { text: "التقيم", value: "rating" },
        { text: "نوع العقد", value: "contract.name_ar" },
        { text: "تاريخ العقد", value: "contract_created_at" },
        { text: "عدد الاتصالات الكلية", value: "calls" },
        { text: "تاريخ الاشتراك", value: "created_at" },
        { text: "آخر ظهور", value: "last_seen" },
        { text: "حالة العقد ", value: "is_activated" },
        { text: "العمليات", value: "actions", sortable: false },
      ],
      data: [],
      loading: false,
    };
  },
  methods: {
    updateApi() {
      this.api = {
        getAll: `admin/allOffices?page=${this.pagination.current_page}`,
        create: "admin/createOffice",
        delete: "office/delete?office_id",
        edit: "admin/editEstate",
        contract: "office/newContract",
      };
    },
    async fetchData() {
      try {
        this.loading = true;
        const response = await axios.get(this.api.getAll);
        this.pagination = response.data.pagination;
        this.data = response.data.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    async afterFormSubmit() {
      this.dialog_form = false;
      this.pagination.current_page = 1;
      await this.fetchData();
    },
    closeForm() {
      this.dialog_form = false;
    },
    onPageChange(page) {
      if (page === "next") {
        this.pagination.current_page = this.pagination.next_page;
      } else if (page === "prev") {
        this.pagination.current_page = this.pagination.current_page - 1;
      } else {
        this.pagination.current_page = page;
      }
      this.updateApi();
      this.fetchData();
    },
    ...mapActions(["fetchContractTypes"]),
    setForm(val) {
      let form = {
        name: "",
        mobile: "",
        rating: "",
        location: [],
        last_seen: "",
      };
      this.$store.dispatch("initForm", form);
      if (val && val.hasOwnProperty("agreement")) {
        form = { estate_office_id: null };
        this.$store.dispatch("initForm", form);
        if (val.item && val.item.hasOwnProperty("id")) {
          this.item_id = val.item.id;
        }
        this.$store.dispatch("setForm", {
          estate_office_id: val.item.id,
        });
        this.dialog_agreement = true;
      } else {
        if (val != null) {
          this.isNew = false;
          this.$store.dispatch("setForm", val);
        } else {
          this.isNew = true;
        }
        this.dialog_form = true;
      }
    },
  },
  mounted() {
    this.fetchContractTypes("contract/all");
    this.fetchData();
  },
  watch: {
    "pagination.current_page"(newPage) {
      this.updateApi();
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  margin: 10px;
}
</style>
