<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- زر "تصدير إلى Excel" كمكون فرعي -->
        <ExportToExcelButton class="excel-btn" :tableData="tableData" />

        <!-- Tabs -->
        <v-tabs v-model="tab" align-with-title @change="fetchData">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="(item, i) in items" :key="i">{{ item.country }}</v-tab>
        </v-tabs>
        <v-tabs-items class="mt-5" v-model="tab">
          <v-tab-item v-for="(item, i) in items" :key="i">
            <!-- List -->
            <Table
              v-if="tab == item.tab"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :route_name="route_name"
              :title="item.country"
              :api="item.api"
              :create="create"
              :showOffice="showOffice"
              :edit="edit"
              :del="del"
              :state="state"
              :show="show"
              :headers="headers"
              @openForm="setForm"
              @update:tableData="tableData = $event"
              @deleteItem="deleteItem"
              @toggleActive="toggleActive"
            ></Table>
          </v-tab-item>
        </v-tabs-items>
        <!-- Form -->
        <v-dialog v-model="dialog_form" max-width="500px">
          <LocationForm
            v-if="dialog_form"
            newItemLabel="تعديل المنطقة"
            :isNew="isNew"
            :api="getApiForForm"
            :id="item_id"
            @dialogForm="dialog_form = false"
          />
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LocationForm from "@/components/Forms/LocationForm.vue";
import ExportToExcelButton from "@/components/ExportToExcelButton.vue";
import axios from "axios";

export default {
  components: {
    LocationForm,
    ExportToExcelButton,
  },
  data() {
    return {
      item_id: null,
      tab: 0,
      showOffice: false,
      isNew: true,
      create: true,
      edit: true,
      del: true, // تفعيل خاصية الحذف
      show: false,
      state: true, // تفعيل خاصية التفعيل/إلغاء التفعيل
      items: [
        {
          country: "دمشق",
          tab: "0",
          api: {
            getAll: "locationsByParenId/1",
            edit: "location/editLocation",
            create: "location/newLocation",
            delete: "location/deleteLocation", // نقطة النهاية لحذف المنطقة
            toggle: "location/toggleActive", // نقطة النهاية لتفعيل/إلغاء تفعيل المنطقة
          },
        },
        {
          country: "ريف دمشق",
          tab: "1",
          api: {
            getAll: "locationsByParenId/2",
            edit: "location/editLocation",
            create: "location/newLocation",
            delete: "location/deleteLocation", // نقطة النهاية لحذف المنطقة
            toggle: "location/toggleActive", // نقطة النهاية لتفعيل/إلغاء تفعيل المنطقة
          },
        },
      ],
      route_name: "transactions-candidate",
      newItemLabel: "منطقة",
      filter: "",
      dialog_form: false,
      title: "الاماكن",
      headers: [
        {
          text: "#",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "اسم المنطقة",
          value: "name",
        },
        {
          text: "الحالة",
          value: "active", // عمود لسويتش التفعيل
          sortable: false,
        },
        {
          text: "العمليات",
          value: "actions",
          sortable: false,
        },
      ],
      tableData: [], // البيانات التي سيتم تصديرها إلى Excel
    };
  },
  computed: {
    getApiForForm() {
      // تحديد API بناءً على حالة النموذج
      return this.isNew
        ? this.items[this.tab].api.create
        : this.items[this.tab].api.edit;
    },
  },
  watch: {
    tab() {
      this.fetchData();
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(this.items[this.tab].api.getAll);
        this.pagination = response.data.pagination;
        this.tableData = response.data.data || [];
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    setForm(val) {
      // تهيئة النموذج بالقيم الافتراضية
      let form = {
        location_id: null,
        name: null,
        parent_id: null,
        longitude: null,
        latitude: null,
      };
      this.$store.dispatch("initForm", form);

      if (val != null) {
        this.isNew = false;
        this.$store.dispatch("setForm", {
          location_id: val.id,
          name: val.name,
          parent_id: val.parent_id,
          longitude: val.longitude,
          latitude: val.latitude,
        });
      } else {
        this.isNew = true;
      }
      this.dialog_form = true;
    },
    async deleteItem(id) {
      try {
        await axios.delete(`${this.items[this.tab].api.delete}/${id}`);
        this.fetchData(); // تحديث البيانات بعد الحذف
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    async toggleActive(item) {
      try {
        await axios.post(this.items[this.tab].api.toggle, {
          id: item.id,
          active: !item.active,
        });
        this.fetchData(); // تحديث البيانات بعد تغيير الحالة
      } catch (error) {
        console.error("Error toggling item active state:", error);
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
