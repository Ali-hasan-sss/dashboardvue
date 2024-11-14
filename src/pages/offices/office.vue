<template>
  <v-container v-if="!isLoad" fluid class="icons-page">
    <exportToExcel class="excel-btn" :tableData="tableData" />
    <v-card class="mx-1">
      <v-card-text class="font-weight-bold d-flex">
        <v-chip small label
          >تاريخ الإنشاء: {{ formatDate(item.office.created_at) }}</v-chip
        >
        <v-chip small class="mx-2" color="primary" label
          >تاريخ التعديل: {{ formatDate(item.office.updated_at) }}</v-chip
        >
        <v-chip small color="blue lighten-2" class="white--text" label
          >أخر ظهور: {{ formatDate(item.office.last_seen) }}</v-chip
        >
      </v-card-text>
    </v-card>
    <v-row class="my-5">
      <v-col sm="12" md="8">
        <v-card min-height="250px" class="mx-1">
          <v-card-text class="font-weight-bold">
            <div class="d-flex justify-space-between" v-if="item.office">
              <v-list-item-avatar
                tile
                size="80"
                color="grey"
                style="border-radius: 50% !important"
              >
                <img :src="`${img_baseUrl}${item.office.logo}`" />
              </v-list-item-avatar>
              <span>
                <v-avatar class="blue lighten-2" size="30">
                  <span class="white--text">{{
                    parseFloat(Number(item.office.rating).toFixed(1))
                  }}</span>
                </v-avatar>
              </span>
            </div>
            <div class="d-flex justify-space-between" v-if="item.office">
              <span>المكتب العقاري:</span>
              <span>{{ item.office.name }}</span>
            </div>
            <div class="d-flex justify-space-between" v-if="item.office.mobile">
              <span>رقم صاحب المكتب:</span>
              <span dir="ltr">{{ item.office.mobile }}</span>
            </div>
            <div
              class="d-flex justify-space-between"
              v-if="item.office.location.name"
            >
              <span>مكان المكتب:</span>
              <span>{{ item.office.location.name }}</span>
            </div>
            <div
              class="d-flex justify-space-between"
              v-if="item.office.location.locations[0].name"
            >
              <span>منطقة المكتب:</span>
              <span>{{ item.office.location.locations[0].name }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card outlined>
          <v-list-item three-line>
            <v-list-item-content class="d-flex">
              <div class="d-flex justify-space-between">
                <div>عدد العروض العقارية:</div>
                <div
                  class="mx-5 px-3 py-2"
                  style="border: 3px solid #ddd; border-radius: 25px"
                >
                  {{ item.office.available_offers_count }}
                </div>
                <v-btn fab small dark color="indigo" @click="setForm(false)">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card class="mt-5" outlined>
          <v-list-item three-line>
            <v-list-item-content class="d-flex">
              <div class="d-flex justify-space-between">
                <div>عدد الترشيحات العقارية:</div>
                <div
                  class="mx-5 px-3 py-2"
                  style="border: 3px solid #ddd; border-radius: 25px"
                >
                  {{ item.office.available_candidates_count }}
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" v-if="item.office.location">
        <v-card>
          <v-card-subtitle>موقع العقار</v-card-subtitle>
          <v-card-text>
            <Button
              class="mx-1"
              :label="item.office.location.name"
              target="_blank"
              :href="`https://www.google.com/maps/place/${item.office.latitude},${item.office.longitude}/`"
            ></Button>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-subtitle>تعديل المكتب</v-card-subtitle>
          <v-card-text>
            <v-btn class="mx-1" depressed color="primary" @click="setForm(true)"
              >تعديل المكتب</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <v-card-subtitle>عقارات المكتب</v-card-subtitle>
      <v-btn class="ml-3" color="primary" dark @click="openAddEstateDialog"
        >إضافة عقار جديد</v-btn
      >
      <v-card-text>
        <v-row>
          <v-select
            v-model="filterOption"
            :items="filterOptions"
            label="فلتر العقارات"
            class="mb-4"
            @change="applyFilter"
          ></v-select>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="4"
            v-for="(estate, i) in filteredEstates"
            :key="i"
          >
            <v-card :loading="false" class="mx-auto my-12">
              <template slot="progress">
                <v-progress-linear
                  color="primary"
                  height="6"
                  indeterminate
                ></v-progress-linear>
              </template>
              <v-system-bar lights-out></v-system-bar>
              <v-carousel
                :continuous="false"
                :show-arrows="false"
                hide-delimiter-background
                height="250"
                delimiter-icon="mdi-minus"
              >
                <v-carousel-item
                  v-for="(image, i) in estate.images.data"
                  :key="i"
                >
                  <v-sheet height="100%" tile>
                    <v-row class="fill-height" align="center" justify="center">
                      <v-img
                        aspect-ratio="1:1"
                        lazy-src="../../assets/logo.jpeg"
                        contain
                        :src="`${img_baseUrl}${image.url}`"
                      ></v-img>
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
              <v-card-text>
                <div class="d-flex justify-space-between" v-if="estate.price">
                  <span>السعر:</span>
                  <span>{{ estate.price }} ل.س</span>
                </div>
                <div
                  class="d-flex justify-space-between"
                  v-if="estate.location"
                >
                  <span>المحافظة:</span>
                  <span>{{ estate.location.name }}</span>
                </div>
                <div
                  class="d-flex justify-space-between"
                  v-if="estate.location.locations"
                >
                  <span>العنوان:</span>
                  <span>{{ estate.location.locations[0].name }}</span>
                </div>
                <div
                  class="d-flex justify-space-between"
                  v-if="estate.estate_offer_type"
                >
                  <span>نوع العرض:</span>
                  <span>{{ estate.estate_offer_type.name_ar }}</span>
                </div>
                <div
                  class="d-flex justify-space-between"
                  v-if="estate.estate_type"
                >
                  <span>نوع العقار:</span>
                  <span>{{ estate.estate_type.name_ar.split("|")[1] }}</span>
                </div>
                <v-divider class="justify-space-between mt-5"></v-divider>
                <div v-if="estate.description" class="mt-2">
                  <span>{{ estate.description }}</span>
                </div>
              </v-card-text>
              <v-card-actions class="d-flex justify-space-between">
                <v-btn
                  color="deep-purple lighten-2"
                  text
                  :href="'/estates/' + estate.id"
                  target="_blank"
                >
                  مشاهدة العقار
                </v-btn>

                <div>
                  <!-- زر التعديل -->
                  <v-btn icon @click="editEstate(estate)">
                    <v-icon color="blue">mdi-pencil</v-icon>
                  </v-btn>

                  <!-- زر الحذف -->
                  <v-btn color="red" icon @click="deleteEstate(estate.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog_form_offer" max-width="500px">
      <GeneralForm
        v-if="dialog_form_offer"
        :fields="fields"
        newItemLabel="أضافة عروض بعدد"
        :isNew="isNew"
        :api="api"
        @dialogForm="dialog_form_offer = false"
      />
    </v-dialog>
    <v-dialog v-model="dialog_edit" max-width="500px">
      <OfficeForm
        v-if="dialog_edit"
        newItemLabel="المكتب"
        :isNew="isNew"
        :api="apiOffice"
        @dialogForm="dialog_edit = false"
      />
    </v-dialog>
    <v-dialog v-model="addEstateForm" max-width="700px">
      <addEstate
        v-if="addEstateForm"
        newItemLabel="العقار"
        :isNew="isNew"
        :api="getApiForForm"
        :id="item_id"
        @dialogForm="addEstateForm = false"
        @estate-added="handleEstateAdded"
      />
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">تأكيد الحذف</v-card-title>
        <v-card-text
          >هل أنت متأكد أنك تريد حذف هذا العقار؟ لا يمكن التراجع عن هذا
          الإجراء.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false"
            >إلغاء</v-btn
          >
          <v-btn color="red darken-1" text @click="confirmDeleteEstate"
            >حذف</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <Loading v-else />
</template>

<script>
import { img_baseUrl } from "@/plugins/axios";
import GeneralForm from "../../components/Forms/GeneralForm";
import exportToExcel from "../../components/ExportToExcelButton.vue";
import addEstate from "../../components/Forms/EstateForm.vue";
import OfficeForm from "../../components/Forms/OfficeForm.vue";
import axios from "axios";

export default {
  data() {
    return {
      tableData: [],
      img_baseUrl,
      open_img: false,
      dialog_form_offer: false,
      dialog_edit: false,
      addEstateForm: false,
      isNew: false,
      deleteDialog: false,
      estateToDelete: null,
      filteredEstates: [],
      filterOption: "all",
      filterOptions: [
        { text: "كل العقارات", value: "all" },
        { text: "العقارات المقبولة", value: "accepted" },
        { text: "العقارات المرفوضة", value: "rejected" },
        { text: "العقارات المحذوفة", value: "deleted" },
        { text: "العقارات المعلقة", value: "suspended" },
        { text: "العقارات حسب المستخدمين", value: "user_based" },
      ],
      api: {
        edit: "addOffersToOffice",
        create: "addOffersToOffice",
        equel: false,
      },
      apiOffice: {
        create: "office/update",
        edit: "office/update",
      },
      getApiForForm: {
        getAll: "admin/acceptedEstates",
        edit: "admin/editEstate",
        edit_state: "admin/changeEstateStatus",
        delete: "admin/deleteEstate?estate_id",
        create: "addEstateToOffice",
      },
      fields: [
        { name: "العدد", key: "offers" },
        { name: "اسم المكتب", key: "name" },
        { name: "الموقع", key: "location" },
        { name: "رقم الهاتف", key: "telephone" },
      ],
    };
  },
  components: { GeneralForm, exportToExcel, addEstate, OfficeForm },
  methods: {
    formatDate(val) {
      const date = new Date(val);
      return `${date.getUTCFullYear()}/${
        date.getUTCMonth() + 1
      }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
    setForm(isOffice) {
      const form = isOffice
        ? {
            office_id: null,
            name: null,
            logo: null,
            longitude: null,
            latitude: null,
            telephone: null,
            location_id: null,
          }
        : { office_id: null };

      this.$store.dispatch("initForm", form);
      this.isNew = true;

      const office = this.item.office;
      const formData = {
        office_id: office.id,
        logo_changed: office.logo_changed,
        name: office.name,
        logo: office.logo,
        longitude: office.longitude,
        latitude: office.latitude,
        telephone: office.telephone,
        location_id: office.location.locations[0].id,
      };

      if (isOffice) {
        this.$store.dispatch("setForm", formData);
        this.dialog_edit = true;
      } else {
        this.$store.dispatch("setForm", { office_id: office.id });
        this.dialog_form_offer = true;
      }
    },
    setEstateForm(val) {
      let form = {
        estate_office_id: val.office ? val.office.id : "",
        price: "",
        floor: "",
        ownership_type_id: "", //
        estate_offer_type_id: "", //
        interior_status_id: "", //
        period_type_id: "", //
        location_id: "", //
        area_unit_id: "", //
        estate_type_id: "", //
        longitude: "",
        latitude: "",
        period_type_id: "",
        area: "", //
        nearby_places: "", //
        rooms_count: "",
        is_furnished: false,
        floor_plan: "",
        description: "",
        swimming_pool: 0,
        on_beach: "",
        period_number: "",
        images: [],
      };

      this.$store.dispatch("initForm", form);
      this.isNew = !val.hasOwnProperty("id");

      Object.keys(form).forEach((key) => {
        if (key.includes("_id") && val[key.replace("_id", "")]) {
          form[key] = val[key.replace("_id", "")].id;
        } else if (!key.includes("_id")) {
          form[key] = val[key];
        }
      });

      if (val.hasOwnProperty("id")) {
        this.item_id = val.id;
      }
      this.$store.dispatch("setForm", form);
      this.dialog_form = true;
      // create
    },
    editEstate(estate) {
      this.setEstateForm(estate);
      this.isNew = false;
      this.addEstateForm = true;
    },
    deleteEstate(estateId) {
      this.estateToDelete = estateId;
      this.deleteDialog = true;
    },
    async confirmDeleteEstate() {
      if (this.estateToDelete) {
        try {
          await axios.delete(`/estates/${this.estateToDelete}`);
          this.filteredEstates = this.filteredEstates.filter(
            (estate) => estate.id !== this.estateToDelete
          );
          this.$toast.success("تم حذف العقار بنجاح");
          this.estateToDelete = null;
        } catch (error) {
          console.error("Error deleting estate:", error);
        }
      }
      this.deleteDialog = false;
    },
    openAddEstateDialog() {
      this.setEstateForm({ office: { id: this.item.office.id } });
      this.isNew = true;
      this.addEstateForm = true;
    },
    applyFilter() {
      if (!this.item || !this.item.estates || !this.item.estates.data) {
        this.filteredEstates = [];
        return;
      }
      const statusMapping = {
        accepted: 1,
        rejected: 2,
        deleted: 3,
        suspended: 4,
      };
      this.filteredEstates = this.item.estates.data.filter(
        (estate) =>
          this.filterOption === "all" ||
          estate.system_estate_status.id === statusMapping[this.filterOption] ||
          (this.filterOption === "user_based" && estate.user_based)
      );
    },
    populateTableData() {
      if (this.item && this.item.office) {
        const { office } = this.item;
        this.tableData = [
          {
            name: "عدد العروض العقارية",
            offers: office.available_offers_count,
          },
          {
            name: "عدد الترشيحات العقارية",
            offers: office.available_candidates_count,
          },
          { name: "اسم المكتب", offers: office.name },
          { name: "الموقع", offers: office.location.locations[0].name },
          { name: "رقم الهاتف", offers: office.telephone },
        ];
      }
    },
    async confirmAddEstate() {
      try {
        const method = this.isNew ? "post" : "put";
        const url = this.isNew ? "/api/addEstate" : `/api/updateEstate`;

        const response = await axios[method](url, this.$store.state.form);

        if (this.isNew) {
          this.filteredEstates.push(response.data);
          this.handleEstateAdded(response.data);
        } else {
          this.handleEstateUpdated(response.data);
        }

        this.$emit("dialogForm", false);
        this.fetchEstates();
      } catch (error) {
        console.error("Error saving estate:", error);
      }
    },

    async fetchEstates() {
      const officeId = this.$route.params.id;
      try {
        await this.$store.dispatch(
          "fetchItem",
          `admin/officeEstates?office_id=${officeId}`
        );
        this.applyFilter();
      } catch (error) {
        console.error("Error fetching estates:", error);
      }
    },
  },
  computed: {
    item() {
      return this.$store.getters.getItem;
    },
    isLoad() {
      return this.$store.getters.getLoadingItem;
    },
  },
  watch: {
    item: {
      handler(newVal) {
        this.populateTableData();
      },
      immediate: true,
    },
    filterOption() {
      this.applyFilter();
    },
  },
  mounted() {
    const officeId = this.$route.params.id;
    this.$store
      .dispatch("fetchItem", `admin/officeEstates?office_id=${officeId}`)
      .then(() => {
        this.applyFilter();
      });
  },
};
</script>

<style>
.excel-btn {
  margin-bottom: 5px;
}
</style>
