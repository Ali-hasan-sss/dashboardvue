<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- زر التصدير إلى Excel -->
        <ExportToExcelButton
          class="excel-btn"
          :tableData="exportableTableData"
        />
        <!-- التبويبات -->
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="(item, i) in items" :key="i">{{ item.country }}</v-tab>
        </v-tabs>
        <v-tabs-items class="mt-5" v-model="tab">
          <v-tab-item v-for="(item, i) in items" :key="i">
            <!-- الجدول -->
            <Table
              v-if="tab == i"
              :newItemLabel="newItemLabel"
              :filter="filter"
              :route_name="route_name"
              :title="item.country"
              :api="getApiForForm"
              :create="create"
              :showOffice="showOffice"
              :edit="edit"
              :del="del"
              :state="state"
              :show="show"
              :headers="headers"
              @openForm="setForm"
            ></Table>
          </v-tab-item>
        </v-tabs-items>
        <!-- النموذج -->
        <v-dialog v-model="dialog_form" max-width="500px">
          <LocationForm
            v-if="dialog_form"
            newItemLabel="تعديل المنطقة"
            :isNew="isNew"
            :api="getApiForForm"
            :id="item_id"
            @dialogForm="dialog_form = false"
          ></LocationForm>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LocationForm from "@/components/Forms/LocationForm.vue";
import ExportToExcelButton from "@/components/ExportToExcelButton.vue";

export default {
  components: {
    LocationForm,
    ExportToExcelButton,
  },
  data() {
    return {
      item_id: null,
      tab: 0,
      dialog_form: false,
      isNew: true,
      create: true,
      edit: true,
      del: false,
      show: false,
      state: false,
      showOffice: false,
      tableData: [],
      filter: "",
      route_name: "transactions-candidate",
      newItemLabel: "منطقة",
      title: "الأماكن",
      headers: [
        { text: "#", align: "start", sortable: true, value: "id" },
        { text: "اسم المنطقة", value: "name" },
        { text: "العمليات", value: "actions", sortable: false },
      ],
      items: [
        {
          country: "دمشق",
          tab: "0",
          api: {
            getAll: "locationsByParenId/1",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "ريف دمشق",
          tab: "1",
          api: {
            getAll: "locationsByParenId/2",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "حمص",
          tab: "2",
          api: {
            getAll: "locationsByParenId/3",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "درعا",
          tab: "3",
          api: {
            getAll: "locationsByParenId/4",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "السويداء",
          tab: "4",
          api: {
            getAll: "locationsByParenId/5",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "اللاذقية",
          tab: "5",
          api: {
            getAll: "locationsByParenId/6",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "طرطوس",
          tab: "6",
          api: {
            getAll: "locationsByParenId/7",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "حلب",
          tab: "7",
          api: {
            getAll: "locationsByParenId/8",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "حماة",
          tab: "8",
          api: {
            getAll: "locationsByParenId/9",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "دير الزور",
          tab: "9",
          api: {
            getAll: "locationsByParenId/10",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
        {
          country: "القنيطرة",
          tab: "10",
          api: {
            getAll: "locationsByParenId/11",
            edit: "location/editLocation",
            create: "location/newLocation",
          },
        },
      ],
    };
  },
  computed: {
    getApiForForm() {
      return this.items[this.tab].api;
    },
    exportableTableData() {
      return this.tableData.map((item, index) => ({
        رقم: index + 1,
        اسم_المنطقة: typeof item.name === "object" ? item.name.ar : item.name,
        خط_الطول: item.longitude,
        خط_العرض: item.latitude,
      }));
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(this.getApiForForm.getAll);
        console.log("Raw API Response:", response.data);
        if (response.data && response.data.data) {
          this.tableData = response.data.data.map((item) => ({
            id: item.id,
            name: item.name,
            longitude: item.longitude,
            latitude: item.latitude,
          }));
          console.log(this.tableData);
        } else {
          this.tableData = [];
          console.warn(
            "API response does not contain expected data structure."
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        this.tableData = [];
      }
    },
    setForm(val) {
      this.$store.dispatch("initForm", {
        location_id: null,
        name: null,
        parent_id: null,
        longitude: null,
        latitude: null,
      });

      if (val) {
        this.isNew = false;
        this.$store.dispatch("setForm", {
          location_id: val.id,
          name: val.name,
          parent_id: val.parent_id,
          longitude: val.longitude,
          latitude: val.latitude,
        });
        this.dialog_form = true;
      } else {
        this.isNew = true;
        this.dialog_form = true;
      }
    },
  },
  watch: {
    tab() {
      this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
