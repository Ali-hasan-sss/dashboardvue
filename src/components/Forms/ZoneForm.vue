<template>
  <v-form @submit.prevent="save">

    <v-card>
      <v-card-title>
        <span>{{ newItemLabel }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>


            <v-col cols="12" sm="6" md="4">
              <Input label="اسم المنطقة" type="text" :model="form.name" :errorMessages="nameErrors" 
              @changeValue="(val) => {
                form.name = val;
                $v.form.name.$touch();
              }
                "></Input>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <Input label="الحالة" type="text" :placeholder="'0/1'" :model="form.status" :errorMessages="statusErrors"
                @changeValue="(val) => {
                  form.status = val;
                  $v.form.status.$touch();
                }
                  "></Input>
            </v-col>

            <v-col cols="12" sm="100" md="15">
                <gmap-map :center="center" :zoom="zoom" style="width: 100%; height: 400px;" @click="onMapClick">
                  <gmap-polyline :path="form.markers" :options="{
                    strokeColor:  form.color ? '#' + form.color : null, strokeWeight: 6
                  }"></gmap-polyline>
                  <gmap-marker v-for="(marker, index) in form.markers" :key="'marker-' + index"  :position="marker" :clickable="true"
                      @click="onMapClick"></gmap-marker>
                      <gmap-marker v-for="(markers, index) in form.allZonesMarkers" :key="'allZonesMarker-' + index">
      <gmap-marker v-for="(position, positionIndex) in markers" :key="'position-' + positionIndex" :position="position"></gmap-marker>
    </gmap-marker> 
     <gmap-polyline v-for="(markers, index) in form.allZonesMarkers" :key="'polyline-' + index" :path="markers" :options="{ strokeColor: form.color ? '#' + form.color : null, strokeOpacity: 0.7, strokeWeight: 1.7 }"></gmap-polyline>
                  </gmap-map>
                </v-col>

            <v-col cols="12" sm="6" md="4">
              <Input label="الإحداثيات" type="text" :placeholder="'[[33.492..,36.241...]]'" :model="form.coordinates"
                :value="form.coordinates" :errorMessages="coordinatesErrors" @changeValue="(val) => {
                  form.coordinates = val;
                  $v.form.coordinates.$touch();
                }
                  "></Input>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <Input label="اللون" type="text" :placeholder="'ff0ff'" :model="form.color"
                :errorMessages="colorErrors" @changeValue="(val) => {
                  form.color = val;
                  $v.form.color.$touch();
                }
                  "></Input>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <div>
                <v-select v-model="form.location_id" :items="locationOptions" item-text="location_full_name"
                  item-value="location_id" label="اختر المنطقة المطلوبة" :errorMessages="location_idErrors" @select="(val) => {
                    form.location_id = val.value;
                    $v.form.location_id.$touch();
                  }
                    "></v-select>
              </div>
            </v-col>

          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn
    color="blue darken-1"
    text>
    Cancel
   </v-btn> -->
        <div style="margin-left: 10px; margin-bottom:9px">
          <v-btn color="red darken-1" @click="clearCoordinates" style="color: white;">مسح الإحداثيات
          </v-btn>
        </div>
        <div>
          <Button color="blue darken-1" type="submit" label="حفظ"> </Button>
        </div>

      </v-card-actions>
    </v-card>

  </v-form>
</template>

<script>

import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";

export default {

  mixins: [validationMixin],
  props: {
    api: String,
    isNew: Boolean,
    newItemLabel: String,
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(20),
      },
      status: {
        required,
      },
      color: {
        required,
      },

      coordinates: {
        required,
      },
      location_id: {
        required,
      },
    },
  },
  data() {
    return {
      zoom: 12,
      locations: [],
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
    ...mapGetters(["getForm"]),
    nameErrors() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.maxLength &&
        errors.push(this.name_error_msgs.maxlength);
      !this.$v.form.name.required && errors.push(this.name_error_msgs.required);
      return errors;
    },
    coordinatesErrors() {
      const errors = [];
      if (!this.$v.form.coordinates.$dirty) return errors;
      !this.$v.form.coordinates.required &&
        errors.push(this.required_error_msgs.required);
      return errors;
    },
    statusErrors() {
      const errors = [];
      if (!this.$v.form.status.$dirty) return errors;
      !this.$v.form.status.required &&
        errors.push(this.required_error_msgs.required);
      return errors;
    },
    colorErrors() {
      const errors = [];
      if (!this.$v.form.color.$dirty) return errors;
      !this.$v.form.color.required &&
        errors.push(this.required_error_msgs.required);
      return errors;
    },
    location_idErrors() {
      const errors = [];
      if (!this.$v.form.location_id.$dirty) return errors;
      !this.$v.form.location_id.required &&
        errors.push(this.required_error_msgs.required);
      return errors;
    },
    form() {
      return this.getForm;
    },
    formTitle() {
      return this.isNew ? "عنصر جديد" : "تعديل العنصر";
    },
    locationOptions() {
      return this.locations.map(locations => ({
        location_id: locations.id,
        location_full_name: locations.location_full_name
      }));
    },

    center() {
      if (this.form.markers.length === 0) {
        return { lat: 33.510414, lng: 36.278336 };  // Default center when markers array is empty:Damascus
      }

      const totalMarkers = this.form.markers.length;
      let sumLat = 0;
      let sumLng = 0;

      for (let i = 0; i < totalMarkers; i++) {
        sumLat += this.form.markers[i].lat;
        sumLng += this.form.markers[i].lng;
      }

      return { lat: sumLat / totalMarkers, lng: sumLng / totalMarkers };
    },
  },
  watch: {
    model() { },
  },


  methods: {

    ...mapActions(["fetchGovernorate"]),
    save() {
      if (!this.$v.form.$invalid) {
        let formdata = new FormData();
        for (let f in this.form) {
          formdata.append(f, this.form[f]);
        }
        if (!this.isNew) {
          formdata.append("_method", "PUT");
        }
        this.$store.dispatch("sendForm", {
          api: this.api,
          form: formdata,
          isNew: this.isNew,
        });
        this.$emit("dialogForm", false);
      } else {
        this.$toast.error("أكمل الحقول المطلوبة");
      }
    },

    onMapClick(event) {
      const clickedLatLng = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      // Add the coordinates to the array
      this.form.markers.push(clickedLatLng);

      this.form.coordinates ='['+ this.form.markers.map(coord => {
        const { lat, lng } = coord;
        return `[${lat},${lng}]`;
      }).join(',')+ ']';
    },

    clearCoordinates() {
      this.form.coordinates = null;

      this.form.markers.forEach(marker => {
        this.form.allZonesMarkers.forEach((allZonesCoordinates, index) => {
          const innerArrayIndex = allZonesCoordinates.findIndex(allZonesMarker => {
            return marker.lat === allZonesMarker.lat && marker.lng === allZonesMarker.lng;
          });
          if (innerArrayIndex !== -1) {
            this.form.allZonesMarkers[index].splice(innerArrayIndex, 1);
          }
        });
      });
      this.form.markers = [];

    }
  },

  mounted() {

    axios.get('allregions').then(response => {
     const nestedObjects  = response.data.data;
     this.locations = nestedObjects.flatMap(obj => obj.locations);
    })
  },

};


</script>
