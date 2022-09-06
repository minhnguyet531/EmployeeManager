namespace MISA.BA._21H._2022.API.Entities.DTO
{
    /// <summary>
    /// Dữ liệu trả về từ API lọc
    /// </summary>
    public class PagingData
    {
        /// <summary>
        /// Danh sách nhân viên
        /// </summary>
        
        public List<Employee> Data { get; set; }

        /// <summary>
        /// Tổng số bản ghi
        /// </summary>
        public int TotalCount { get; set; }
    }
}
