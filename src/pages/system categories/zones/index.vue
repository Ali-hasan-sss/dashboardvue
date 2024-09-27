<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <v-text-field
          v-model="filter"
          label="بحث"
          append-icon="mdi-magnify"
          single-line
          hide-details
        ></v-text-field>

        <!-- List -->
        <Table
          newItemLabel="زون"
          :filter="filter"
          :title="title"
          :api="api"
          :edit="edit"
          :del="del"
          :headers="headers"
          @openForm="setForm"
        />
        <!-- Form -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <ZoneForm
            newItemLabel=" زون"
            :isNew="isNew"
            :api="api"
            @dialogForm="dialog_form = false"
          />
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ZoneForm from "@/components/Forms/ZoneForm.vue";

export default {
  components: { ZoneForm },
  data() {
    return {
      filter: "",
      isNew: true,
      dialog_form: false,
      edit: true,
      del: false,
      api: {
        getAll: "zones",
        create: "zone/newZone",
        edit: "zone/editZone",
      },
      title: " الزون",
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "id",
        },
        {
          text: "الاسم",
          sortable: false,
          value: "name",
        },
        {
          text: "اسم الحي",
          sortable: false,
          value: "location.location_full_name",
        },
        {
          text: "اللون",
          sortable: false,
          value: "color",
        },
        {
          text: "الحالة",
          sortable: false,
          value: "status",
        },
        {
          text: "العمليات",
          sortable: false,
          value: "actions",
        },
      ],
    };
  },
  methods: {
    setForm(val) {
      let form = {
        id: null,
        name: null,
        status: null,
        color: null,
        location_id: null,
        coordinates: null,
        markers: [],
        allZonesMarkers: [],
      };

      // Initialize form with default values
      this.$store.dispatch("initForm", form);

      // If editing (val is not null)
      if (val != null) {
        const coordinateArray = JSON.parse(val.coordinates);
        const markers = coordinateArray.map((coordinatePair) => {
          const lat = parseFloat(coordinatePair[0]);
          const lng = parseFloat(coordinatePair[1]);
          return { lat, lng };
        });

        this.isNew = false;
        this.$store.dispatch("setForm", {
          ...form,
          id: val.id,
          name: val.name,
          status: val.status,
          location_id: val.location_id,
          color: val.color,
          coordinates: val.coordinates,
          markers: markers,
        });

        this.dialog_form = true;
      } else {
        this.isNew = true;
        this.dialog_form = true;
      }
    },
  },
};
</script>
