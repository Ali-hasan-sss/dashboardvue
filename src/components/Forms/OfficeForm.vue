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
                  :src="
                    form.newLogo ? form.newLogo : `${img_baseUrl}${form.logo}`
                  "
                  style="
                    height: 80px;
                    min-width: 80px;
                    width: 80px;
                    border-radius: 50%;
                  "
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
              />
            </v-col>
            <!-- حقل الاسم بالعربية -->
            <v-col cols="12">
              <v-text-field
                label="اسم المكتب بالعربي"
                type="text"
                v-model="form.name_ar"
                :error-messages="nameErrors"
                @input="updateField('name_ar', $event)"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="اسم المكتب بالإنكليزي"
                type="text"
                v-model="form.name_en"
                :error-messages="nameErrors"
                @input="updateField('name_en', $event)"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="الهاتف"
                type="text"
                v-model="form.telephone"
                @input="updateField('telephone', $event)"
              />
              <v-col cols="12">
                <v-text-field
                  label="رقم الموبايل"
                  type="text"
                  v-model="form.mobile"
                  :error-messages="mobileErrors"
                  @input="updateField('mobile', $event)"
                />
              </v-col>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="longitude"
                type="number"
                v-model="form.longitude"
                :error-messages="longitudeErrors"
                @input="updateField('longitude', $event)"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="latitude"
                type="text"
                v-model="form.latitude"
                :error-messages="latitudeErrors"
                @input="updateField('latitude', $event)"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                :items="Locations"
                v-model="form.location_id"
                :error-messages="location_idErrors"
                label="ضمن المنطقة"
                @change="updateField('location_id', $event)"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" type="submit">حفظ</v-btn>
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
  validations() {
    return {
      form: {
        name_ar: { required },
        name_en: { required },
        longitude: { required },
        latitude: { required },
        location_id: { required },
        mobile: { required },
        password: {},
      },
    };
  },
  data() {
    return {
      img_baseUrl,
      nameArErrors: [],
      nameEnErrors: [],
      longitudeErrors: [],
      latitudeErrors: [],
      location_idErrors: [],
      mobileErrors: [],
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
          if (this.form.hasOwnProperty(f) && f !== "name") {
            formdata.append(f, this.form[f]);
          }
        }

        // إضافة الحقلين name_ar و name_en
        formdata.append("name_ar", this.form.name_ar || "");
        formdata.append("name_en", this.form.name_en || "");

        formdata.append("logo_changed", this.form.newLogo ? 1 : 0);

        // إذا لم يكن النموذج جديداً، أضف _method لتحديث البيانات
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
          .catch(() => {
            this.$toast.error("حدث خطأ أثناء حفظ المكتب العقاري.");
          });
      } else {
        this.$toast.error("أكمل الحقول المطلوبة");
      }
    },
    updateField(field, value) {
      this.form[field] = value;
      if (this.$v.form[field]) {
        this.$v.form[field].$touch();
      }
    },
  },
  mounted() {
    this.fetchLocations("locations");
  },
};
</script>
