export function formatDate(dateString) {
    if (!dateString) return null;

    const date = new Date(dateString);

    // Lấy ngày, tháng, năm
    const day = String(date.getDate()).padStart(2, '0'); // Đảm bảo có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Trả về định dạng dd-MM-yyyy
    return `${day} - ${month} - ${year}`;
}
