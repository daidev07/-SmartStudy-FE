import { createStore } from 'vuex';

const store = createStore({
    state: {
        userInfo: null,
        selectedAssignment: null,
        isChatbotOpen: false,
        isLoading: false,
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setSelectedAssignment(state, assignment) {
            state.selectedAssignment = assignment;
        },
        toggleChatbot(state) {
            state.isChatbotOpen = !state.isChatbotOpen;
        },
        setLoading(state, status) {
            state.isLoading = status;
        },
    },
    actions: {
        saveUserInfo({ commit }, userInfo) {
            commit('setUserInfo', userInfo);
        },
        saveSelectedAssignment({ commit }, assignment) {
            commit('setSelectedAssignment', assignment); 
        },
        openChatbotWithLoader({ commit }) {
            commit('toggleChatbot');
            commit('setLoading', true);
        },
        startLoading({ commit }) {
            commit('setLoading', true);
        },
        stopLoading({ commit }) {
            commit('setLoading', false);
        },
    },
    getters: {
        getUserInfo: (state) => state.userInfo,
        getUserId: (state) => state.userInfo?.id,
        getSelectedAssignment: state => state.selectedAssignment 
    },
});

export default store;
