<template>
  <v-form @submit.prevent="save">
    <v-card>
      <v-card-title>
        <span>{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row align="center" justify="space-around">
            <v-col cols="6">
              <div color="grey">
                <img
                  width="150"
                  :src="form.newLogo ? form.newLogo : `${img_baseUrl}${form.logo}`"
                  style="height: 80px; min-width: 80px; width: 80px; border-radius: 50%;"
                />
              </div>
            </v-col>
            <v-col cols="6">
              <v-file-input
                dense
                accept="images/*"
                prepend-icon="mdi-camera"
                label="شعار العقار"
                @change="selectImage"
              >
              </v-file-input>
            </v-col>
            <v-col cols="12">
              <Input
                label="الاسم"
                type="text"
                :model="form.name"
                :errorMessages="nameErrors"
                @changeValue="(val) => { form.name = val; $v.form.name.$touch(); }"
              ></Input>
            </v-col>
            <v-col cols="12">
              <Input
                label="الهاتف"
                type="text"
                :model="form.telephone"
                @changeValue="(val) => { form.telephone = val; }"
              ></Input>
            </v-col>
            <v-col cols="12">
              <Input
                label="longitude"
                type="number"
                :model="form.longitude"
                :errorMessages="longitudeErrors"
                @changeValue="(val) => { form.longitude = val; $v.form.longitude.$touch(); }"
              ></Input>
            </v-col>
            <v-col cols="12">
              <Input
                label="latitude"
                type="text"
                :model="form.latitude"
                :errorMessages="latitudeErrors"
                @changeValue="(val) => { form.latitude = val; $v.form.latitude.$touch(); }"
              ></Input>
            </v-col>
            <v-col cols="12">
              <FormSelect
                :items="Locations"
                :model="form.location_id"
                attr="location_id"
                :errorMessages="location_idErrors"
                label="ضمن المنطقة"
                @select="(val) => { form.location_id = val.value; $v.form.location_id.$touch(); }"
              >
              </FormSelect>
            </v-col>
            <!-- Add password field here -->
            <v-col cols="12">
              <Input
                label="كلمة المرور الجديدة"
                type="password"
                :model="form.password"
                @changeValue="(val) => { form.password = val; }"
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
import { img_baseUrl } from "@/plugins/axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [validationMixin],
  props: {
    api: Object,
    isNew: Boolean,
  },
  validations: {
    form: {
      name: { required },
      longitude: { required },
      latitude: { required },
      location_id: { required },
      password: {}, // Add validation for password if necessary
    },
  },
  data() {
    return {
      img_baseUrl,
      name_error_msgs: {
        maxlength: "يجب أن يتألف الأسم من 20 أحرف كحد أقصى.",
        required: "هذا الحقل مطلوب.",
      },
      required_error_msgs: {
        required: "هذا الحقل مطلوب.",
      },
    };
  },
  computed: {
    ...mapGetters(["getForm", "getLocations"]),
    form() {
      return this.getForm;
    },
    formTitle() {
      return this.isNew ? "مكتب جديد" : "تعديل المكتب";
    },
    Locations() {
      return this.getLocations;
    },
  },
  methods: {
    ...mapActions(["fetchLocations"]),
    selectImage(val) {
      this.form.logo = val;
      this.form.newLogo = URL.createObjectURL(val);
    },
    save() {
      if (!this.$v.form.$invalid) {
        let formdata = new FormData();
        for (let f in this.form) {
          if (this.form.hasOwnProperty(f)) {
            formdata.append(f, this.form[f]);
          }
        }
        formdata.append("logo_changed", this.form.newLogo ? 1 : 0);
        if (!this.isNew) {
          formdata.append("_method", "PUT");
        }
        this.$store
          .dispatch("sendForm", {
            api: this.api,
            form: formdata,
            isNew: this.isNew,
          })
          .then((response) => {
            this.$emit("dialogForm", false);
          })
          .catch((error) => {
            this.$toast.error("حدث خطأ أثناء حفظ المكتب العقاري.");
          });
      } else {
        this.$toast.error("أكمل الحقول المطلوبة");
      }
    },
  },
  mounted() {
    this.fetchLocations("locations");
  },
};
</script>
