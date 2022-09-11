using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.BA._21H._2022.API.Entities;
using MISA.BA._21H._2022.API.Entities.DTO;
using MySqlConnector;
namespace MISA.BA._21H._2022.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        /// <summary>
        /// API lấy danh sách tất cả phòng ban
        /// </summary>
        /// <returns>Danh sách tất cả phòng ban</returns>
        [HttpGet] /// Lấy dữ liệu

        public IActionResult GetAllDepartment()
        {
            /// Trả vể 1 list danh sách phòng ban
            /// StatusCodes.Status200OK => thành công
            /// StatusCode(trạng_thái_trả_về, dữ_liệu_trả_về)
            /// 
            try
            {
                // Kết nối đến database
                string connectString = "Server=localhost;Port=3306;Database=ba.21h.2022.ntmnguyet;Uid=root;Pwd=namba2001;";
                var mySqlConnection = new MySqlConnection(connectString);

                // Chuẩn bị câu lệnh Sql
                string getDataDepartment = "SELECT * FROM tbldepartment";

                // Thực hiện câu lệnh Sql
                var department = mySqlConnection.Query(getDataDepartment);

                if (department != null)
                {
                    /// Trả vể 1 list danh sách nhân viên
                    return StatusCode(StatusCodes.Status200OK, department);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }

            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }

        }
    }
}