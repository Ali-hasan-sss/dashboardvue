<template>
    <v-expansion-panels
        accordion
        flat
        class="primary"
        tile
        v-model="panel"
        :readonly="readonly"
    >
        <v-expansion-panel>
            <v-expansion-panel-header
                class="white--text font-weight-bold"
                color="primary"
            >
                <v-icon
                    small
                    color="white"
                    aria-hidden="false"
                    class="me-2 flex-grow-0"
                >
                    mdi-filter
                </v-icon>
                فلتر
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-card class="" color="white">
                    <v-card-text
                        class="d-flex justify-space-between align-center"
                    >
                        <v-container>
                            <v-row>
                                <!-- فلتر حسب الحالة (مقبولة، معلقة، مرفوضة، محذوفة) -->
                                <v-col cols="12" sm="6" md="4">
                                    <FormSelect
                                        :items="statusOptions"
                                        attr="status"
                                        label="حالة القائمة"
                                        @select="updateFilter"
                                    />
                                </v-col>

                                <!-- فلتر حسب المستخدمين -->
                                <v-col cols="12" sm="6" md="4">
                                    <div v-if="userOptions.length">
                                        <FormSelect
                                            :items="userOptions"
                                            attr="user"
                                            label="حسب المستخدم"
                                            @select="updateFilter"
                                        />
                                    </div>
                                    <div v-else>
                                        <v-alert type="info" class="ma-0">
                                            لا يوجد بيانات متاحة
                                        </v-alert>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-btn
                        class="ma-2"
                        outlined
                        color="indigo"
                        @click="ResetFilter"
                    >
                        إلغاء تطبيق الفلتر
                    </v-btn>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    props: {
        api: Object,
        per_page: Number,
        search: {}
    },
    data() {
        return {
            panel: [0],
            readonly: false,
            // خيارات الفلتر
            statusOptions: [
                { text: "مقبولة", value: "accepted" },
                { text: "معلقة", value: "pending" },
                { text: "مرفوضة", value: "rejected" },
                { text: "محذوفة", value: "deleted" }
            ],
            userOptions: [] // سيتم ملء هذه القائمة من Vuex
        };
    },
    watch: {
        search(val) {
            this.updateFilter(val);
        }
    },
    computed: {
        ...mapGetters({
            getFilter: 'filter/getFilter',  // افتراضًا أن موديول الفلتر يحتوي على getter باسم 'getFilter'
            getUsers: 'filter/getUsers'  // افتراضًا أن موديول الفلتر يحتوي على getter باسم 'getUsers'
        })
    },
    methods: {
        ...mapActions({
            createFilter: 'filter/createFilter',  // افتراضًا أن موديول الفلتر يحتوي على action باسم 'createFilter'
            deleteFilter: 'filter/deleteFilter',  // افتراضًا أن موديول الفلتر يحتوي على action باسم 'deleteFilter'
            initFilter: 'filter/initFilter',  // افتراضًا أن موديول الفلتر يحتوي على action باسم 'initFilter'
            fetchTableDataFilter: 'table/fetchTableDataFilter',  // افتراضًا أن موديول الجدول يحتوي على action باسم 'fetchTableDataFilter'
            fetchTableData: 'table/fetchTableData',  // افتراضًا أن موديول الجدول يحتوي على action باسم 'fetchTableData'
            fetchUsers: 'filter/fetchUsers'  // افتراضًا أن موديول الفلتر يحتوي على action باسم 'fetchUsers'
        }),
        updateFilter(val) {
            this.createFilter(val).then(() => {
                this.fetchTableDataFilter({
                    api: this.api,
                    per_page: this.per_page,
                    filter: this.getFilter
                });
            });
        },
        ResetFilter() {
            this.deleteFilter().then(() => {
                this.fetchTableData({
                    api: this.api,
                    per_page: this.per_page
                });
            });
        }
    },
    mounted() {
        this.initFilter({}); // تهيئة الفلتر بقيم فارغة
        this.fetchUsers().then(() => {
            this.userOptions = this.getUsers;
        });
    }
};
</script>
