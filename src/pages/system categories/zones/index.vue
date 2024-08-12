<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- List -->
        <Table newItemLabel="زون" :filter="filter" :title="title" :api="api" :edit="edit" :del="del" :headers="headers"
          @openForm="setForm"></Table>
        <!-- Form -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <ZoneForm newItemLabel=" زون" :isNew="isNew" :api="api" @dialogForm="dialog_form = false"></ZoneForm>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ZoneForm from "@/components/Forms/ZoneForm.vue"

export default {
  components: { ZoneForm },
  data() {
    return {
      isNew: true,
      dialog_form: false,
      edit: true,
      del: false,
      api: {
        getAll: 'zones',
        create: "zone/newZone",
        edit: "zone/editZone",
      },

      title: " الزون",
      headers: [{
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
        text: " اللون",
        sortable: false,
        value: "color",
      },
      {
        text: "الحالة",
        sortable: false,
        value: "status",
      },
      {
        text: " العمليات",
        sortable: false,
        value: "actions",
      },

      ],

    }
  }, computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    getApiForForm() {
      return this.items.api;
    }
  },
  methods: {
    setForm(val) {
      axios.get('zones').then(response => {
        const zonesObjects = response.data.data;
        const allZonesMarkers = [];

        zonesObjects.forEach((obj) => {
          const coordinateArray = JSON.parse(obj.coordinates);
          const allZonesCoordinates = coordinateArray.map((coordinatePair) => {
            const lat = parseFloat(coordinatePair[0]);
            const lng = parseFloat(coordinatePair[1]);
            return { lat, lng };
          });

          allZonesMarkers.push(allZonesCoordinates);
        });

      let form = {
        id: null,
        name: null,
        status: null,
        color: null,
        location_id: null,
        coordinates: null,
        markers: [],
        allZonesMarkers:allZonesMarkers,
      };
      // initialize form
      this.$store.dispatch("initForm", form);

      // edit
      if (val != null) {
          const coordinateArray = JSON.parse(val.coordinates);

          const markers = coordinateArray.map((coordinatePair) => {
            const lat = coordinatePair[0];
            const lng = coordinatePair[1];
            return { lat, lng };
          });

        this.isNew = false;
        this.$store.dispatch("initForm", form);
        this.$store.dispatch("setForm", {
          id: val.id,
          name: val.name,
          status: val.status,
          location_id: val.location_id,
          color: val.color,
          coordinates: val.coordinates,
          markers: markers,
          allZonesMarkers:allZonesMarkers,
        });
        
        this.dialog_form = true;
      }
      else {
        this.isNew = true
        this.dialog_form = true;
      }
    })
   }
  },

};

</script>