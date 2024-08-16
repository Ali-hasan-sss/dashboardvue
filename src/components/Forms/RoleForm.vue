<template>
  <v-form @submit.prevent="save">
    <v-card>
      <v-card-title>
        <span>{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="الإحصائيات"
                attr="statistical"
                :model="form.statistical"
                @switcher="
                  (val) => {
                    form.statistical = val.value;
                    $v.form.statistical.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="المكاتب"
                attr="estate_offices"
                :model="form.estate_offices"
                @switcher="
                  (val) => {
                    form.estate_offices = val.value;
                    $v.form.estate_offices.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="العقارات"
                attr="estates"
                :model="form.estates"
                @switcher="
                  (val) => {
                    form.estates = val.value;
                    $v.form.estates.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="الطلبات العقارية"
                attr="estate_orders"
                :model="form.estate_orders"
                @switcher="
                  (val) => {
                    form.estate_orders = val.value;
                    $v.form.estate_orders.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="التقييمات"
                attr="ratings"
                :model="form.ratings"
                @switcher="
                  (val) => {
                    form.ratings = val.value;
                    $v.form.ratings.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="إشعارات المكتب"
                attr="office_notifications"
                :model="form.office_notifications"
                @switcher="
                  (val) => {
                    form.office_notifications = val.value;
                    $v.form.office_notifications.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="إشعارات المستخدم"
                attr="costumers_notifications"
                :model="form.costumers_notifications"
                @switcher="
                  (val) => {
                    form.costumers_notifications = val.value;
                    $v.form.costumers_notifications.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="ثوابت النظام"
                attr="system_variables"
                :model="form.system_variables"
                @switcher="
                  (val) => {
                    form.system_variables = val.value;
                    $v.form.system_variables.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="العمليات"
                attr="operations"
                :model="form.operations"
                @switcher="
                  (val) => {
                    form.operations = val.value;
                    $v.form.operations.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="المستخدمين"
                attr="users"
                :model="form.users"
                @switcher="
                  (val) => {
                    form.users = val.value;
                    $v.form.users.$touch();
                  }
                "
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="الموظفين"
                attr="employees"
                :model="form.employees"
                @switcher="
                  (val) => {
                    form.employees = val.value;
                    $v.form.employees.$touch();
                  }
                "
              ></Switcher>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div>
          <v-btn color="blue darken-1" @click="toggleStatus" :disabled="!id">
            {{ form.active ? "تعطيل" : "تفعيل" }}
          </v-btn>
          <v-btn color="red darken-1" @click="deleteRole" :disabled="!id">
            حذف
          </v-btn>
          <v-btn color="blue darken-1" type="submit"> حفظ </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import Switcher from "../Form Components/Switcher";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  components: { Switcher },
  props: {
    api: Object,
    isNew: Boolean,
    id: {
      type: [String, Number],
      default: null,
    },
    newItemLabel: {
      type: String,
      default: "عنصر",
    },
  },
  computed: {
    ...mapGetters(["getForm"]),
    form() {
      return this.getForm;
    },
    formTitle() {
      return (this.isNew ? "إنشاء" : "تعديل") + " " + this.newItemLabel;
    },
  },
  methods: {
    async save() {
      let formData = new FormData();
      for (let f in this.form) {
        formData.append(f, this.form[f]);
      }
      try {
        if (this.isNew) {
          await axios.post(this.api.create, formData);
        } else {
          formData.append("_method", "PUT");
          formData.append("role_id", this.id);
          await axios.post(this.api.edit, formData);
        }
        this.$emit("dialogForm", false);
        this.$emit("refreshData");
      } catch (error) {
        console.error("Error saving role:", error);
      }
    },
    async toggleStatus() {
      const status = this.form.active ? "deactivate" : "activate";
      try {
        await axios.post(`${this.api[status]}/${this.id}`);
        this.form.active = !this.form.active;
      } catch (error) {
        console.error(`Error ${status} role:`, error);
      }
    },
    async deleteRole() {
      try {
        await axios.delete(`${this.api.delete}/${this.id}`);
        this.$emit("dialogForm", false);
        this.$emit("refreshData");
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    },
  },
  async mounted() {
    if (!this.isNew) {
      try {
        const response = await axios.get(`${this.api.edit}/${this.id}`);
        this.$store.dispatch("setForm", response.data);
      } catch (error) {
        console.error("Error fetching role details:", error);
      }
    }
  },
};
</script>
