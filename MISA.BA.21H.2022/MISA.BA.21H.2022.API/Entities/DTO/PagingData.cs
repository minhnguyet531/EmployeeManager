namespace MISA.BA._21H._2022.API.Entities.DTO
{
    /// <summary>
    /// Dữ liệu trả về từ API lọc
    /// </summary>
    public class PagingData<Employee>
    {
        /// <summary>
        /// Danh sách nhân viên
        /// </summary>

        public List<Employee> Data { get; set; } = new List<Employee>();

        /// <summary>
        /// Tổng số bản ghi
        /// </summary>
        public long TotalCount { get; set; }
    }
}
