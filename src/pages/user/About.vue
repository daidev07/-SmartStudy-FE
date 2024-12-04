<template>
    <div>
        <h1>Thêm học viên mới</h1>
        <form @submit.prevent="addStudent">
            <div>
                <label for="studentName">Tên học viên thay đổi:</label>
                <input type="text" id="studentName" v-model="studentName" placeholder="Nhập tên học viên" required />
            </div>
            <div>
                <label for="phoneNumber">Số điện thoại thay đổi:</label>
                <input type="tel" id="phoneNumber" v-model="phoneNumber" placeholder="Nhập số điện thoại"
                    pattern="[0-9]{10,11}" required />
            </div>
            <div>
                <label for="email">Gmail thay đổi:</label>
                <input type="email" id="email" v-model="email" placeholder="Nhập địa chỉ Gmail" required />
            </div>
            <div>
                <label for="level">Nâng level:</label>
                <select id="level" v-model="selectedLevel" required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>
            <div>
                <label for="class">Chọn lớp khác:</label>
                <select id="class" v-model="selectedClass" required>
                    <option value="A">Lớp A</option>
                    <option value="B">Lớp B</option>
                    <option value="C">Lớp C</option>
                </select>
            </div>
            <div>
                <button type="submit">Cập nhật học viên</button>
            </div>
        </form>
        <div v-if="submitted">
            <h3>Thông tin học viên đã thêm:</h3>
            <p><strong>Tên:</strong> {{ studentName }}</p>
            <p><strong>Số điện thoại:</strong> {{ phoneNumber }}</p>
            <p><strong>Gmail:</strong> {{ email }}</p>
            <p><strong>Level:</strong> {{ selectedLevel }}</p>
            <p><strong>Lớp học:</strong> {{ selectedClass }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddStudentComponent',
    data() {
        return {
            studentName: '', // Tên học viên
            phoneNumber: '', // Số điện thoại
            email: '', // Gmail
            selectedLevel: '1', // Level mặc định
            selectedClass: 'A', // Lớp mặc định
            submitted: false, // Trạng thái đã thêm học viên
        };
    },
    methods: {
        addStudent() {
            // Kiểm tra dữ liệu trước khi thêm (nếu cần)
            this.submitted = true;
            alert('Học viên đã được thêm thành công!');
            // Logic gửi thông tin lên server hoặc xử lý tại đây
        },
    },
};
</script>

<style scoped>
form {
    margin-bottom: 1rem;
}

div {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
}

input,
select,
button {
    padding: 0.5rem;
    font-size: 1rem;
    width: 100%;
}

button {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #218838;
}

h3 {
    margin-top: 2rem;
}
</style>
