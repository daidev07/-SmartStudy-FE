import { createStore } from 'vuex';

const store = createStore({
    state: {
        userInfo: null,
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
    },
    actions: {
        saveUserInfo({ commit }, userInfo) {
            commit('setUserInfo', userInfo);
        },
    },
    getters: {
        getUserInfo: (state) => state.userInfo,
        getUserId: (state) => state.userInfo?.id,
    },
});

export default store;
