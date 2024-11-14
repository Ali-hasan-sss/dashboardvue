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
                label="اختيار الحد الأدنى"
                :model="minCheck"
                @switcher="ChangeMin"
              ></Switcher>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <Switcher
                label="اختيار الحد الأعلى"
                :model="maxCheck"
                @switcher="ChangeMax"
              ></Switcher>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <Input
                :disabled="minCheck"
                label="الحد الأدنى"
                type="number"
                :value="form.min"
                :errorMessages="minErrors"
                @changeValue="
                  (val) => {
                    form.min = val;
                    $v.form.min.$touch();
                  }
                "
              ></Input>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <Input
                :disabled="maxCheck"
                label="الحد الأعلى "
                type="number"
                :value="form.max"
                :errorMessages="maxErrors"
                @changeValue="
                  (val) => {
                    form.max = val;
                    $v.form.max.$touch();
                  }
                "
              ></Input>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div>
          <Button color="blue darken-1" type="submit" label="حفظ"> </Button>
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
    api: Object,
    isNew: Boolean,
    newItemLabel: {
      default: "عنصر",
    },
    edit: Object,
  },
  validations: {
    form: {
      min: { required },
      max: { required },
    },
  },
  data() {
    return {
      form: this.isNew ? { min: "", max: "" } : { ...this.edit },
      formTitle: this.isNew ? "إضافة مجال سعر جديد" : "تعديل مجال السعر",
      minCheck: false,
      maxCheck: false,
    };
  },
  methods: {
    save() {
      this.$emit("save", this.form);
    },
    ChangeMin() {
      this.form.min = "";
      this.minCheck = !this.minCheck;
    },
    ChangeMax() {
      this.form.max = "";
      this.maxCheck = !this.maxCheck;
    },
  },
};
</script>
