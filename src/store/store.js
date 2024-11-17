import { createStore } from 'vuex';

const store = createStore({
    state: {
        userInfo: null,
        selectedAssignment: null
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setSelectedAssignment(state, assignment) {
            state.selectedAssignment = assignment;
        }
    },
    actions: {
        saveUserInfo({ commit }, userInfo) {
            commit('setUserInfo', userInfo);
        },
        saveSelectedAssignment({ commit }, assignment) {
            commit('setSelectedAssignment', assignment); 
        }
    },
    getters: {
        getUserInfo: (state) => state.userInfo,
        getUserId: (state) => state.userInfo?.id,
        getSelectedAssignment: state => state.selectedAssignment 
    },
});

export default store;
