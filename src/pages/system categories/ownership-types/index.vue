<template>
  <v-container fluid class="icons-page">
    <v-row no-gutters class="d-flex justify-space-between mt-2 mb-2">
      <v-col>
        <!-- قائمة الأنواع -->
        <Table
          newItemLabel="نوع ملكية"
          :filter="filter"
          :title="title"
          :api="api"
          :edit="edit"
          :del="del"
          :headers="headers"
          @openForm="setForm"
        >
          <template v-slot:item.is_active="{ item }">
            <v-switch
              v-model="item.is_active"
              @change="toggleActivation(item)"
              :label="item.is_active ? 'مفعل' : 'معطل'"
            ></v-switch>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small @click.stop="setForm(item)">mdi-pencil</v-icon>
            <v-icon small @click.stop="deleteItem(item.id)">mdi-delete</v-icon>
          </template>
        </Table>

        <!-- نموذج التعديل والإضافة -->
        <v-dialog class="form" v-model="dialog_form" max-width="500px">
          <EstateTypeFormSingle
            newItemLabel="نوع ملكية"
            :isNew="isNew"
            :api="api"
            @dialogForm="dialog_form = false"
          ></EstateTypeFormSingle>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EstateTypeFormSingle from "@/components/Forms/System Categories/EstateTypeFormSingle.vue";
import axios from "axios";

export default {
  components: { EstateTypeFormSingle },
  data() {
    return {
      isNew: true,
      dialog_form: false,
      edit: true,
      del: true,
      api: {
        getAll: "ownershipTypes",
        create: "newOwnershipType",
        update: "updateOwnershipType",
        delete: "deleteOwnershipType",
        toggleActivation: "toggleOwnershipTypeActivation",
      },
      filter: "ownership-types",
      title: "أنواع الملكية",
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "id",
        },
        {
          text: "الأسم بالعربي",
          align: "start",
          sortable: false,
          value: "name_ar",
        },
        {
          text: "الأسم بالإنجليزي",
          align: "start",
          sortable: false,
          value: "name_en",
        },
        {
          text: "الحالة",
          align: "center",
          sortable: false,
          value: "is_active",
        },
        {
          text: "العمليات",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    async fetchEstateTypes() {
      try {
        const response = await axios.get(this.api.getAll);
        if (response.data && Array.isArray(response.data.data)) {
          this.estateTypes = response.data.data;
        } else {
          console.error("Unexpected data structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching estate types:", error);
      }
    },
    setForm(val = null) {
      let form = {
        name_ar: "",
        name_en: "",
      };
      this.$store.dispatch("initForm", form);
      if (val != null) {
        this.isNew = false;
        this.$store.dispatch("setForm", val);
      } else {
        this.isNew = true;
      }
      this.dialog_form = true;
    },
    async toggleActivation(item) {
      try {
        await axios.post(`${this.api.toggleActivation}/${item.id}`, {
          is_active: item.is_active,
        });
      } catch (error) {
        console.error("Error toggling activation:", error);
      }
    },
    async deleteItem(itemId) {
      try {
        const url = `${this.api.delete}/${itemId}`;
        //  console.log("Deleting item at URL:", url);
        await axios.delete(url);
        this.fetchEstateTypes();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
  },
  mounted() {
    this.fetchEstateTypes();
  },
};
</script>
