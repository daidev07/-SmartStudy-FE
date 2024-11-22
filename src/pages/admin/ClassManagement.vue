<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border-bottom border-end border-black title">
            CLASS MANAGEMENT
        </div>
        <hr class="fw-bold">
    </div>
    <div class="class-card-container">
        <div v-for="classItem in classList" :key="classItem.id" class="class-card"
            @click="goToClassDetail(classItem.id)" title=" More information...">
            <div class="card-header">
                <h3 class="class-name">{{ classItem.name }}</h3>
                <span class="icon" title="Assignment">
                    <i class="fas fa-tasks"></i> <!-- Icon giao bài tập -->
                </span>
            </div>
            <div class="card-body mt-4">
                <p class="status"
                    :class="{ 'in_progress': classItem.status === 'IN PROGRESS', 'completed': classItem.status === 'COMPLETED' }">
                    {{ classItem.status }}
                </p>
                <p class="level" :class="{
                    'level-1': classItem.level.name == 1,
                    'level-2': classItem.level.name == 2,
                    'level-3': classItem.level.name == 3
                }">
                    Level {{ classItem.level.name }}</p>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            apirUrl: process.env.VUE_APP_API_URL,
            classList: [],
            classListLoading: false,
            classListError: null,
        };
    },
    created() {
        this.fetchClassList();
    },
    methods: {
        async fetchClassList() {
            this.classListLoading = true;
            this.classListError = null;
            try {
                const response = await axios.get(this.apirUrl + '/class');
                this.classList = response.data.data;
                console.log("LIST CLASS:: ", this.classList);

            } catch (error) {
                this.classListError = error;
            } finally {
                this.classListLoading = false;
            }
        },
        goToClassDetail(classId) {
            this.$router.push({ name: 'ClassroomDetail', params: { id: classId } });
        }
    },

};
</script>
<style scoped>
.class-card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.class-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    width: 300px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.class-card:hover {
    cursor: pointer;
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.class-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
}

.icon {
    font-size: 1.2rem;
    color: #666;
}

.card-body {
    display: flex;
}

.level-1 {
    background-color: #2196f3;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
}

.level-2 {
    background-color: #4caf50;
    /* Màu xanh nước biển sáng */
    color: #fff;
    /* Màu chữ trắng để dễ đọc */
    padding: 4px 8px;
    border-radius: 4px;
}

.level-3 {
    background-color: #ff9800;
    /* Màu cam */
    color: #fff;
    /* Màu chữ trắng để dễ đọc */
    padding: 4px 8px;
    border-radius: 4px;
}

.status {
    font-weight: bold;
    text-transform: uppercase;
}

.status.in-progress {
    color: #2196f3;
    /* Màu cam cho trạng thái "IN PROGRESS" */
}

.status.completed {
    color: #4caf50;
    /* Màu xanh lá cho trạng thái "COMPLETED" */
}
</style>