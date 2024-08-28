<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- List -->
        <Table
          :filter="filter"
          :title="title"
          :api="api"
          :edit="edit"
          :headers="headers"
          :items="tableData"
          @openForm="setForm"
          @activate="activateAccount"
          @deactivate="deactivateAccount"
          @delete="deleteAccount"
        ></Table>
        <!-- Form -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <AccountForm
            newItemLabel="حساب"
            :isNew="isNew"
            :api="api"
            @dialogForm="dialog_form = false"
          ></AccountForm>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AccountForm from "../../components/Forms/AccountForm.vue";
import axios from "axios";

export default {
  data() {
    return {
      isNew: true,
      edit: true,
      dialog_form: false,
      api: {
        getAll: "users",
        create: "admin/createAdminAccount",
        delete: "user/delete",
        activate: "user/activate",
        deactivate: "user/deactivate",
      },
      filter: "accounts",
      title: "الحسابات",
      headers: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "الاسم الأول",
          align: "start",
          sortable: true,
          value: "first_name",
        },
        {
          text: "الاسم الأخير",
          align: "start",
          sortable: true,
          value: "last_name",
        },
        {
          text: "الايميل أو الهاتف",
          value: "authentication",
          sortable: true,
        },
        {
          text: "صلاحية المستخدم",
          value: "role",
          sortable: true,
        },
        {
          text: "الحالة",
          value: "status",
          sortable: true,
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
  components: { AccountForm },
  methods: {
    setForm(val) {
      let form = {
        first_name: "",
        last_name: "",
        authentication: "",
        password: "",
        repeatPassword: "",
        role_id: null,
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
    async activateAccount(id) {
      try {
        await axios.post(`${this.api.activate}/${id}`);
        this.fetchData();
      } catch (error) {
        console.error("Error activating account:", error.message || error);
      }
    },
    async deactivateAccount(id) {
      try {
        await axios.post(`${this.api.deactivate}/${id}`);
        this.fetchData();
      } catch (error) {
        console.error("Error deactivating account:", error.message || error);
      }
    },
    async deleteAccount(id) {
      try {
        await axios.delete(`${this.api.delete}/${id}`);
        this.fetchData();
      } catch (error) {
        console.error("Error deleting account:", error.message || error);
      }
    },
    async fetchData() {
      try {
        const response = await axios.get(this.api.getAll);
        this.tableData = response.data || [];
      } catch (error) {
        console.error("Error fetching data:", error.message || error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
