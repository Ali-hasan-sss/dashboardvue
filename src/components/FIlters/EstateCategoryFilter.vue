<template>
    <v-card class="pa-3">
        <v-row>
            <v-col cols="12" sm="6" md="4">
                <v-select
                    v-model="selectedSection"
                    :items="sections"
                    label="تصفية حسب القسم"
                    @change="filterEstates"
                ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="searchQuery"
                    label="بحث عن عقار"
                    @input="filterEstates"
                ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-select
                    v-model="selectedUser"
                    :items="users"
                    label="تصفية حسب المستخدم"
                    @change="filterEstates"
                ></v-select>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
export default {
    props: {
        estates: Array,
        users: Array
    },
    data() {
        return {
            selectedSection: null,
            searchQuery: "",
            selectedUser: null,
            sections: [
                { text: "القوائم المقبولة", value: "accepted" },
                { text: "القوائم المعلقة", value: "pending" },
                { text: "القوائم المرفوضة", value: "rejected" },
                { text: "القوائم المحذوفة", value: "deleted" }
            ]
        };
    },
    methods: {
        filterEstates() {
            let filteredEstates = this.estates;

            // تصفية حسب القسم
            if (this.selectedSection) {
                filteredEstates = filteredEstates.filter(
                    estate => estate.status === this.selectedSection
                );
            }

            // تصفية حسب المستخدم
            if (this.selectedUser) {
                filteredEstates = filteredEstates.filter(
                    estate => estate.userId === this.selectedUser.id
                );
            }

            // البحث عن العقار
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filteredEstates = filteredEstates.filter(estate =>
                    estate.name.toLowerCase().includes(query)
                );
            }

            // بث الحدث مع العقارات المفلترة
            this.$emit("filtered", filteredEstates);
        }
    }
};
</script>
