<template>
  <v-form @submit.prevent="save">
    <v-card>
      <v-card-title>
        <span>{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              v-for="(field, i) in fields"
              :key="i"
              cols="12"
              sm="6"
              md="4"
            >
              <Input
                :label="field.name"
                type="text"
                required
                :model="form[`${field.key}`]"
                @changeValue="
                  (val) => {
                    form[`${field.key}`] = val;
                    $v.form[`${field.key}`].$touch();
                  }
                "
              ></Input>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('dialogForm', false)"
          >Cancel</v-btn
        >
        <v-btn color="blue darken-1" type="submit">حفظ</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  mixins: [validationMixin],
  props: {
    api: Object,
    isNew: Boolean,
    fields: Array,
    newItemLabel: String,
  },
  data() {
    return {
      required_error_msgs: {
        required: "هذا الحقل مطلوب.",
      },
    };
  },
  computed: {
    ...mapGetters(["getForm"]),
    form() {
      return this.getForm || {};
    },
    formTitle() {
      return this.newItemLabel;
    },
  },
  methods: {
    save() {
      // سجل البيانات قبل الحفظ
      console.log("Form data before saving:", this.form);
      console.log("Fields being used:", this.fields);

      let formdata = new FormData();
      for (let f in this.form) {
        if (this.form[f] !== undefined) {
          formdata.append(f, this.form[f]);
          console.log(`Appending ${f}:`, this.form[f]);
        }
      }
      if (!this.isNew) {
        formdata.append("_method", "PUT");
      }

      this.$store
        .dispatch("sendForm", {
          api: this.api,
          form: formdata,
          isNew: this.isNew,
        })
        .then(() => {
          this.$emit("dialogForm", false);
        })
        .catch((err) => {
          console.error("Error saving form data:", err);
        });
    },
  },
  created() {
    console.log("Form data on created:", this.form);
  },
};
</script>
