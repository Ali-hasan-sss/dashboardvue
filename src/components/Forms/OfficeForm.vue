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
            <v-col cols="12">
              <v-text-field
                label="الاسم بالعربي"
                type="text"
                v-model="form.name_ar"
                :error-messages="nameErrors"
                @input="updateField('name_ar', $event)"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="الاسم بالانجليزي"
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
                :items="Sublocations"
                v-model="form.location_id"
                :error-messages="location_idErrors"
                label="ضمن الحي"
                @change="updateField('location_id', $event)"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="كلمة المرور الجديدة"
                type="password"
                v-model="form.password"
                :error-messages="passwordErrors"
                @input="updateField('password', $event)"
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
      nameErrors: [],
      nameEnErrors: [],
      longitudeErrors: [],
      latitudeErrors: [],
      location_idErrors: [],
      mobileErrors: [],
      passwordErrors: [],
    };
  },
  computed: {
    ...mapGetters(["getForm", "getSubLocations"]),
    form() {
      return this.getForm;
    },
    formTitle() {
      return this.isNew ? "مكتب جديد" : "تعديل المكتب";
    },
    Sublocations() {
      return this.getSubLocations;
    },
  },
  methods: {
    ...mapActions(["fetchSubLocations"]),
    selectImage(val) {
      this.form.logo = val;
      this.form.newLogo = URL.createObjectURL(val);
    },
    save() {
      if (!this.$v.form.$invalid) {
        // إضافة الحقل الذي يحدد ما إذا تم تغيير الشعار
        const logoChanged = this.form.newLogo ? 1 : 0;

        // إعداد الطلب الأول (عربي)
        let formdataAr = new FormData();
        for (let field in this.form) {
          if (this.form.hasOwnProperty(field)) {
            // استبعاد الحقول الخاصة بالاسم
            if (
              field !== "name_ar" &&
              field !== "name_en" &&
              field !== "name"
            ) {
              formdataAr.append(field, this.form[field]);
            }
          }
        }
        formdataAr.append("logo_changed", logoChanged);
        formdataAr.append("name", this.form.name_ar); // الاسم بالعربية
        if (!this.isNew) {
          formdataAr.append("_method", "PUT");
        }

        // إرسال الطلب باللغة العربية
        this.$store
          .dispatch("sendForm", {
            api: this.api,
            form: formdataAr,
            headers: { lang: "ar" }, // هيدر عربي
            isNew: this.isNew,
          })
          .then(() => {
            // إعداد الطلب الثاني (إنجليزي)
            let formdataEn = new FormData();
            for (let field in this.form) {
              if (this.form.hasOwnProperty(field)) {
                // استبعاد الحقول الخاصة بالاسم والاسم الفارغ
                if (
                  field !== "name_ar" &&
                  field !== "name_en" &&
                  field !== "name"
                ) {
                  formdataEn.append(field, this.form[field]);
                }
              }
            }
            formdataEn.append("logo_changed", logoChanged);
            formdataEn.append("name", this.form.name_en); // استخدم الاسم بالإنجليزية فقط

            if (!this.isNew) {
              formdataEn.append("_method", "PUT");
            }

            // طباعة محتوى الطلب والهيدر
            console.log(
              "Request Body (English):",
              Array.from(formdataEn.entries())
            );
            console.log("Request Headers (English):", {
              lang: "en", // هيدر إنجليزي
              "Accept-Language": "en", // هيدر Accept-Language
            });

            // إرسال الطلب الثاني
            return this.$store.dispatch("sendForm", {
              api: this.api,
              form: formdataEn,
              headers: {
                lang: "en", // هيدر إنجليزي
                "Accept-Language": "en", // هيدر Accept-Language
              },
              isNew: this.isNew,
            });
          })
          .then(() => {
            this.$emit("dialogForm", false); // إغلاق الفورم بعد النجاح
          })
          .catch(() => {
            this.$toast.error("حدث خطأ أثناء حفظ المكتب.");
          });
      } else {
        // عرض رسالة توضح الحقول المطلوبة
        const errors = this.$v.form.$error;
        if (errors) {
          const requiredFields = Object.keys(errors).filter(
            (field) => errors[field].$invalid
          );
          this.$toast.error(`الحقول المطلوبة: ${requiredFields.join(", ")}`);
        } else {
          this.$toast.error("أكمل الحقول المطلوبة.");
        }
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
    this.fetchSubLocations();
  },
};
</script>
