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
              <v-text-field
                label="الأسم بالعربي مفرد"
                type="text"
                :error-messages="name_ar_single_Errors"
                v-model="field.name_ar_single"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="الأسم بالعربي جمع"
                type="text"
                :error-messages="name_ar_plural_Errors"
                v-model="field.name_ar_plural"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="الأسم بالإنجليزي مفرد"
                type="text"
                :error-messages="name_en_single_Errors"
                v-model="field.name_en_single"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="الأسم بالإنجليزي جمع"
                type="text"
                :error-messages="name_en_plural_Errors"
                v-model="field.name_en_plural"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div>
          <v-btn color="blue darken-1" type="submit">حفظ</v-btn>
        </div>
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
    formData: {
      type: Object,
      required: true,
    },
    api: Object,
    isNew: Boolean,
    newItemLabel: {
      default: "عنصر",
    },
  },
  validations: {
    field: {
      name_ar_plural: { required },
      name_en_plural: { required },
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
        name_ar_plural: "",
        name_en_plural: "",
        name_ar_single: "",
        name_en_single: "",
      },
    };
  },
  computed: {
    name_ar_plural_Errors() {
      const errors = [];
      if (!this.$v.field.name_ar_plural.$dirty) return errors;
      !this.$v.field.name_ar_plural.required &&
        errors.push(this.requried_error_msgs.required);
      return errors;
    },
    name_ar_single_Errors() {
      const errors = [];
      if (!this.$v.field.name_ar_single.$dirty) return errors;
      !this.$v.field.name_ar_single.required &&
        errors.push(this.requried_error_msgs.required);
      return errors;
    },
    name_en_plural_Errors() {
      const errors = [];
      if (!this.$v.field.name_en_plural.$dirty) return errors;
      !this.$v.field.name_en_plural.required &&
        errors.push(this.requried_error_msgs.required);
      return errors;
    },
    name_en_single_Errors() {
      const errors = [];
      if (!this.$v.field.name_en_single.$dirty) return errors;
      !this.$v.field.name_en_single.required &&
        errors.push(this.requried_error_msgs.required);
      return errors;
    },
    formTitle() {
      return this.isNew
        ? `إضافة ${this.newItemLabel}`
        : `تعديل ${this.newItemLabel}`;
    },
  },
  watch: {
    formData: {
      handler(newData) {
        this.$nextTick(() => {
          // تحديث الحقول هنا
          Object.assign(this.field, newData); // تحديث الحقول مباشرة
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    save() {
      this.$v.field.$touch();
      if (!this.$v.field.$invalid) {
        this.$emit("save", { ...this.field });
      } else {
        this.$toast.error("أكمل الحقول المطلوبة");
      }
    },
  },
};
</script>
