import axios from "axios";

const state = () => ({
  form: {
    password: "",
  },
  item: {},
  loadingForm: true,
  loadingItem: true,
});

const actions = {
  async sendForm({ dispatch, commit }, info) {
    commit("SET_LOADING", true);
    try {
      await axios.post(
        `${!info.isNew ? info.api.edit : info.api.create}`,
        info.form
      );
      dispatch("fetchTableData");
      this._vm.$toast.success("تمت العملية بنجاح");
    } catch (err) {
      this._vm.$toast.error("فشلت العملية");
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async fetchForm({ commit }, api) {
    commit("SET_LOADING", true);
    await axios
      .get(`${api}`)
      .then((res) => {
        let resultData = res.data.data;
        if (Array.isArray(resultData)) {
          commit("SET_FORM", resultData[0]);
        } else {
          commit("SET_FORM", resultData);
        }
        commit("SET_LOADING", false);
      })
      .catch((err) => {
        commit("SET_LOADING", false);
      });
  },
  async fetchItem({ commit }, api) {
    commit("SET_LOADING_ITEM", true);
    await axios
      .get(`${api}`)
      .then((res) => {
        let resultData = res.data.data;
        if (Array.isArray(resultData)) {
          commit("SET_ITEM", resultData[0]);
        } else {
          commit("SET_ITEM", resultData);
        }
        commit("SET_LOADING_ITEM", false);
      })
      .catch((err) => {
        commit("SET_LOADING_ITEM", false);
      });
  },
  setForm({ commit }, form) {
    commit("SET_FORM", form);
  },
  initForm({ commit }, init_form) {
    commit("SET_INIT_FORM", init_form);
  },
};

const getters = {
  getForm: (state) => state.form,
  getItem: (state) => state.item,
  getLoadingForm: (state) => state.loadingForm,
  getLoadingItem: (state) => state.loadingItem,
};

const mutations = {
  SET_TABLE_DATA(state, payload) {
    state.tableData = payload;
  },
  SET_FORM(state, payload) {
    Object.keys(state.form).forEach((key) => {
      if (payload.hasOwnProperty(key)) {
        state.form[key] = payload[key];
      }
    });
  },
  SET_ITEM(state, payload) {
    state.item = payload;
  },
  SET_INIT_FORM(state, payload) {
    state.form = { ...state.form, ...payload }; // تأكد من أن form يتم تهيئته بشكل صحيح
  },
  SET_LOADING(state, payload) {
    state.loadingForm = payload;
  },
  SET_LOADING_ITEM(state, payload) {
    state.loadingItem = payload;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
