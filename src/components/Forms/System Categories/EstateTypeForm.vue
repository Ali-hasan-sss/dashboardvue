<template>
  <v-form @submit.prevent="save">
    <v-card>
      <v-card-title>
        <span>{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <!-- الحقول النصية -->
            <v-col cols="12" sm="6" md="6">
              <Input
                label="الأسم بالعربي"
                type="text"
                :errorMessages="name_ar_Errors"
                :model="field.name_ar"
                @changeValue="updateField('name_ar', $event)"
              ></Input>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <Input
                label="الأسم بالإنكليزي"
                type="text"
                :errorMessages="name_en_Errors"
                :model="field.name_en"
                @changeValue="updateField('name_en', $event)"
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
    api: Object,
    isNew: Boolean,
    newItemLabel: { default: "عنصر" },
    formData: { type: Object, default: () => ({}) },
  },

  validations: {
    field: {
      name_ar: { required },
      name_en: { required },
    },
  },

  data() {
    return {
      requried_error_msgs: { required: "هذا الحقل مطلوب." },
      field: {
        id: "",
        name_ar: "",
        name_en: "",
        is_active: "1", // يتم تعيينه افتراضيًا كـ "1"
      },
    };
  },

  computed: {
    formTitle() {
      return this.newItemLabel;
    },
    name_ar_Errors() {
      return !this.$v.field.name_ar.$dirty
        ? []
        : !this.$v.field.name_ar.required
        ? [this.requried_error_msgs.required]
        : [];
    },
    name_en_Errors() {
      return !this.$v.field.name_en.$dirty
        ? []
        : !this.$v.field.name_en.required
        ? [this.requried_error_msgs.required]
        : [];
    },
  },

  watch: {
    formData: {
      handler(newData) {
        this.field = newData
          ? {
              id: newData.id || "",
              name_ar: newData.name_ar || "",
              name_en: newData.name_en || "",
            }
          : {
              id: "",
              name_ar: "",
              name_en: "",
              is_active: "1",
            };
      },
      immediate: true,
    },
  },

  methods: {
    updateField(fieldName, value) {
      this.field[fieldName] = value;
      this.$v.field[fieldName].$touch();
    },

    save() {
      console.log("تم النقر على زر الحفظ");
      this.$v.field.$touch();
      if (!this.$v.field.$invalid) {
        const updatedForm = {
          id: this.field.id,
          name_ar: this.field.name_ar, // إرسال الاسم بالعربي كنص
          name_en: this.field.name_en, // إرسال الاسم بالإنكليزي كنص
        };
        this.$emit("save", updatedForm);
      } else {
        this.$toast.error("أكمل الحقول المطلوبة");
      }
    },
  },
};
</script>
