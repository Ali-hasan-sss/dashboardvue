import axios from "axios";

const state = () => ({
  subLocations: [], // لتخزين الأحياء
});

const actions = {
  // جلب الأحياء من الرابط المحدد
  async fetchSubLocations(
    { commit },
    api_info = "https://swess.store/api/v2/locations/sub-locations"
  ) {
    await axios
      .get(`${api_info}`)
      .then((res) => {
        let resultData = res.data.data;
        let result = resultData.map((x) => {
          return {
            text: x.name, // اسم الحي
            value: x.id, // معرف الحي
          };
        });
        commit("SET_SUB_LOCATIONS", result); // تخزين الأحياء في الميوتاشن
      })
      .catch((err) => {
        console.error("Error fetching sub-locations: ", err);
      });
  },
};

const getters = {
  getSubLocations: (state) => {
    return state.subLocations; // إرجاع قائمة الأحياء من المخزن
  },
};

const mutations = {
  SET_SUB_LOCATIONS(state, payload) {
    state.subLocations = payload; // تعيين الأحياء التي تم جلبها في المخزن
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
