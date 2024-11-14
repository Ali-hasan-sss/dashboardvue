<template>
  <v-form @submit.prevent="submitForm">
    <v-card>
      <v-card-title>
        <span>{{
          isNew ? `إضافة ${newItemLabel}` : `تعديل ${newItemLabel}`
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <Input
                label="الأسم بالعربي "
                type="text"
                :errorMessages="name_ar_single_Errors"
                :model="field.name_ar_single"
                @changeValue="updateField('name_ar_single', $event)"
              ></Input>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <Input
                label="الأسم بالإنجليزي "
                type="text"
                :errorMessages="name_en_single_Errors"
                :model="field.name_en_single"
                @changeValue="updateField('name_en_single', $event)"
              ></Input>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button color="blue darken-1" type="submit" label="حفظ"></Button>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  props: {
    isNew: Boolean,
    initialData: {
      type: Object,
      default: () => ({ name_ar: "", name_en: "", id: null }), // إضافة id في البيانات الأولية
    },
    newItemLabel: {
      type: String,
      default: "عنصر",
    },
  },
  validations: {
    field: {
      name_ar_single: { required },
      name_en_single: { required },
    },
  },
  data() {
    return {
      requried_error_msgs: {
        required: "هذا الحقل مطلوب.",
      },
      field: {
        name_ar_single: "",
        name_en_single: "",
        id: null, // إضافة الحقل id في البيانات
      },
    };
  },
  computed: {
    name_ar_single_Errors() {
      const errors = [];
      if (!this.$v.field.name_ar_single.$dirty) return errors;
      if (!this.$v.field.name_ar_single.required) {
        errors.push(this.requried_error_msgs.required);
      }
      return errors;
    },
    name_en_single_Errors() {
      const errors = [];
      if (!this.$v.field.name_en_single.$dirty) return errors;
      if (!this.$v.field.name_en_single.required) {
        errors.push(this.requried_error_msgs.required);
      }
      return errors;
    },
  },
  methods: {
    updateField(fieldName, value) {
      this.field[fieldName] = value;
      this.$v.field[fieldName].$touch();
    },
    submitForm() {
      this.$v.field.$touch();
      if (!this.$v.field.$invalid) {
        // تمرير الـ ID مع البيانات
        this.$emit("submitForm", {
          id: this.field.id, // تمرير الـ id إذا كان موجودًا
          name_ar: this.field.name_ar_single,
          name_en: this.field.name_en_single,
        });
      } else {
        this.$toast.error("أكمل الحقول المطلوبة");
      }
    },
  },
  mounted() {
    // تحديث البيانات فقط إذا كانت الحالة ليست جديدة
    if (!this.isNew) {
      this.field.name_ar_single = this.initialData.name_ar || "";
      this.field.name_en_single = this.initialData.name_en || "";
      this.field.id = this.initialData.id || null; // إضافة ID عند التعديل
    }
  },
};
</script>
