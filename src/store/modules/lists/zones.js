import axios from "axios";

const state = () => ({
    zones: [],
});

const actions = {
    async fetchZones({ commit }, api_info) {
        await axios
            .get(`${api_info}`)
            .then(res => {
                let resultData = res.data.data;
                let result = resultData.map(x => {
                    return {
                        text: x.name_ar,
                        value: x.id
                    }
                })
                commit('SET_ZONES', result)
            })
            .catch(err => {})
    },
}

const getters = {
    getZones: state => {
        return state.zones
    },
}

const mutations = {
    SET_ZONES(state, payload) {
        state.zones = payload
    },
}


export default {
    state,
    getters,
    mutations,
    actions
}