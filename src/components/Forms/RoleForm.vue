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
                label="الأحصائيات"
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
                label=" العقارات"
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
                label="التفيمات"
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
                label="أشعارات المكتب"
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
                label="أشعارات المستخدم"
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
        <!-- <v-btn
     color="blue darken-1"
     text>
     Cancel
    </v-btn> -->
        <div>
          <Button color="blue darken-1" type="submit" label="حفظ"> </Button>
        </div>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import axios from "axios";
import Switcher from "../Form Components/Switcher";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  components: { Switcher },
  mixins: [validationMixin],
  props: {
    api: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    newItemLabel: {
      default: "عنصر",
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getForm"]),
    form() {
      return this.getForm;
    },
    formTitle() {
      return "تعديل " + this.newItemLabel;
    },
  },
  validations() {
    return {
      form: {
        statistical: { required },
        estate_offices: { required },
        estates: { required },
        estate_orders: { required },
        ratings: { required },
        office_notifications: { required },
        costumers_notifications: { required },
        system_variables: { required },
        operations: { required },
        users: { required },
        employees: { required },
      },
    };
  },
  methods: {
    save() {
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        let formdata = {
          ...this.form,
          role_id: this.id, // إضافة role_id إلى البيانات المرسلة
        };

        axios({
          method: "PUT",
          url: this.api,
          data: formdata, // إرسال البيانات كـ JSON بدلاً من FormData
          headers: {
            "Content-Type": "application/json", // تأكد من استخدام JSON
          },
        })
          .then((response) => {
            console.log("Success:", response.data);
            this.$emit("dialogForm", false);
          })
          .catch((error) => {
            console.error(
              "Error:",
              error.response ? error.response.data : error.message
            );
            this.$toast.error("حدث خطأ أثناء إرسال البيانات");
          });
      } else {
        this.$toast.error("أكمل الحقول المطلوبة");
      }
    },
  },
};
</script>
