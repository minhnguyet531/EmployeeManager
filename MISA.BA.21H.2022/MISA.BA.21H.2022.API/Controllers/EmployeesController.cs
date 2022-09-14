using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.BA._21H._2022.API.Entities;
using MISA.BA._21H._2022.API.Entities.DTO;
using Dapper;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;


namespace MISA.BA._21H._2022.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        /// <summary>
        /// API lấy danh sách tất cả nhân viên
        /// </summary>
        /// <returns>Danh sách tất cả nhân viên</returns>
        [HttpGet] /// Lấy dữ liệu
        public IActionResult GetAllEmployees()
        {
            try
            {
                // Kết nối đến database
                string connectString = "Server=localhost;Port=3306;Database=ba.21h.2022.ntmnguyet;Uid=root;Pwd=namba2001;";
                var mySqlConnection = new MySqlConnection(connectString);

                // Chuẩn bị câu lệnh Sql
                string getDataEmployees = "SELECT * FROM tblemployee";

                // Thực hiện câu lệnh Sql
                var employees = mySqlConnection.Query(getDataEmployees);  

                if (employees != null)
                {
                    /// Trả vể 1 list danh sách nhân viên
                    return StatusCode(StatusCodes.Status200OK, employees);
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

        /// <summary>
        /// API lấy thông tin chi tiết 1 nhân viên
        /// </summary>
        /// <param name="EmployeeId">ID nhân viên</param>
        /// <returns>Thông tin chi tiết 1 nhân viên</returns>
        [HttpGet]
        [Route("{EmployeeId}")]  /// dấu { } có ý nghĩa là muốn truyền 1 tham số vào (tên tham số này phải giống cái tên sau [FromRoute])
        public IActionResult GetEmployeeByID([FromRoute] Guid EmployeeId)  // FromRoute kiểu như sài để phân tách nhau bởi / -.-
        {
            try
            {
                // Kết nối đến database
                string connectString = "Server=localhost;Port=3306;Database=ba.21h.2022.ntmnguyet;Uid=root;Pwd=namba2001;";
                var mySqlConnection = new MySqlConnection(connectString);

                // Chuẩn bị câu lệnh Sql
                string storedProcedureGetEmployeeByID = "Proc_employee_GetEmployeeByID";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@v_EmployeeId", EmployeeId);

                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                var employee = mySqlConnection.QueryFirstOrDefault(storedProcedureGetEmployeeByID, parameters, commandType: System.Data.CommandType.StoredProcedure);

                if (employee != null)
                {
                    /// Trả vể 1 list danh sách nhân viên
                    return StatusCode(StatusCodes.Status200OK, employee);
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound);
                }

            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
           
        }

        /// <summary>
        /// API tìm kiếm danh sách nhân viên có điều kiện tìm kiếm (lọc danh sách nhân viên theo phòng ban hoặc vị trí hoặc lọc theo cả 2 điều kiện là phòng ban và vị trí) và phân trang
        /// </summary>
        /// <param name="keyword">Từ khóa muốn tìm kiếm (Mã nhân viên, tên nhân viên)</param>
        /// <param name="limit">Số bản ghi trong 1 trang</param>
        /// <param name="offset">Vị trí bản ghi bắt đầu lấy dữ liệu</param>
        /// <returns>Danh sách nhân viên tìm kiếm theo Mã nhân viên hoặc tên nhân viên</returns>
        [HttpGet]
        [Route("filter")]  //k có { } thì API sẽ sinh ra /filter luôn
        public IActionResult filter(
            [FromQuery] string keyword,
            [FromQuery] string PositionId,
            [FromQuery] string DepartmentId,
            [FromQuery] int pageSize = 10,
            [FromQuery] int pageNumber = 1)

        {
            try
            {
                // Kết nối đến database
                string connectString = "Server=localhost;Port=3306;Database=ba.21h.2022.ntmnguyet;Uid=root;Pwd=namba2001;";
                var mySqlConnection = new MySqlConnection(connectString);

                // Chuẩn bị câu lệnh Sql
                string storedProcedureSearchEmployees = "Proc_employee_filter";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@v_Offset", (pageNumber - 1) * pageSize);
                parameters.Add("@v_Limit", pageSize);
                parameters.Add("@v_Sort", "ModifiedDate DESC");

                var orConditions = new List<string>();
                var andConditions = new List<string>();
                string whereClause = "";


                // Tìm kiếm tên nhân viên/ mã nhân viên
                if (keyword != null)
                {
                    whereClause = ($"EmployeeCode LIKE '%{keyword}%' OR EmployeeName LIKE '%{keyword}%'");
                }


                ///lọc danh sách nhân viên theo phòng ban hoặc vị trí hoặc lọc theo cả 2 điều kiện là phòng ban và vị trí

                if ((PositionId != null && DepartmentId == null) || ((PositionId == null && DepartmentId != null)))
                {
                    whereClause = ($"PositionId LIKE '%{PositionId}%' OR DepartmentId LIKE '%{DepartmentId}%'");
                }

                if (PositionId != null && DepartmentId != null)
                {
                    whereClause = ($"PositionId LIKE '%{PositionId}%' AND DepartmentId LIKE '%{DepartmentId}%'");
                }
                parameters.Add("@v_Where", whereClause);

                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                var multipleResults = mySqlConnection.QueryMultiple(storedProcedureSearchEmployees, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý kết quả trả về từ DB
                if (multipleResults != null)
                {
                    var employees = multipleResults.Read<Employee>().ToList();
                    var totalCount = multipleResults.Read<long>().Single();
                    return StatusCode(StatusCodes.Status200OK, new PagingData<Employee>()
                    {
                        Data = employees,
                        TotalCount = totalCount
                    });
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


        /// <summary>
        /// API thêm mới 1 nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng nhân viên cần thêm mới</param>
        /// <returns>ID của nhân viên thêm mới</returns>
        [HttpPost]
        public IActionResult InsertEmployee([FromBody] Employee employee)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectString = "Server=localhost;Port=3306;Database=ba.21h.2022.ntmnguyet;Uid=root;Pwd=namba2001;";
                var mySqlConnection = new MySqlConnection(connectString);

                // Chuẩn bị câu lệnh INSERT INTO
                string insertEmployeeCommand = "INSERT INTO tblemployee(EmployeeId, EmployeeName, EmployeeCode, DateOfBirth, Gender, IdentityNumber, PositionId, PositionName, DepartmentId, DepartmentName, WorkStatus, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate, PhoneNumber, Email, Address, IdentityDate, IdentityPlace, JoinDate, PersonalTaxCode, Salary, GenderName) VALUES(@EmployeeId, @EmployeeName, @EmployeeCode, @DateOfBirth, @Gender, @IdentityNumber, @PositionId, @PositionName, @DepartmentId , @DepartmentName, @WorkStatus, @CreatedBy, @CreatedDate, @ModifiedBy, @ModifiedDate, @PhoneNumber, @Email, @Address, @IdentityDate, @IdentityPlace, @JoinDate, @PersonalTaxCode, @Salary, @GenderName)";

                // Chuẩn bị tham số đầu vào cho câu lệnh INSERT INTO
                var EmployeeId = Guid.NewGuid();
                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeId", EmployeeId);
                parameters.Add("@EmployeeCode", employee.EmployeeCode);
                parameters.Add("@EmployeeName", employee.EmployeeName);
                parameters.Add("@DateOfBirth", employee.DateOfBirth);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@GenderName", employee.GenderName);
                parameters.Add("@IdentityNumber", employee.IdentityNumber);
                parameters.Add("@IdentityPlace", employee.IdentityPlace);
                parameters.Add("@IdentityDate", employee.IdentityDate);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@Address", employee.Address);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);
                parameters.Add("@PositionId", employee.PositionId);
                parameters.Add("@PositionName", employee.PositionName);
                parameters.Add("@DepartmentId", employee.DepartmentId);
                parameters.Add("@DepartmentName", employee.DepartmentName);
                parameters.Add("@PersonalTaxCode", employee.PersonalTaxCode);
                parameters.Add("@Salary", employee.Salary);
                parameters.Add("@JoinDate", employee.JoinDate);
                parameters.Add("@WorkStatus", employee.WorkStatus);
                parameters.Add("@CreatedDate", employee.CreatedDate);
                parameters.Add("@CreatedBy", employee.CreatedBy);
                parameters.Add("@ModifiedDate", employee.ModifiedDate);
                parameters.Add("@ModifiedBy", employee.ModifiedBy);

                // Thực hiện gọi vào DB để chạy câu lệnh INSERT INTO với tham số đầu vào ở trên
                int numberOfAffectedRows = mySqlConnection.Execute(insertEmployeeCommand, parameters);

                // Xử lý kết quả trả về từ DB
                if (numberOfAffectedRows > 0)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status201Created, EmployeeId);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (MySqlException mySqlException)
            {
                if (mySqlException.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e003");
                }
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
          
        }

        /// <summary>
        /// API sửa 1 nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng nhân viên cần sửa</param>
        /// <param name="EmployeeId">ID của nhân viên cần sửa</param>
        /// <returns>ID của nhân viên cần sửa</returns>
        [HttpPut]
        [Route("{EmployeeId}")]
        public IActionResult UpdateEmployee([FromRoute] Guid EmployeeId, [FromBody] Employee employee)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectString = "Server=localhost;Port=3306;Database=ba.21h.2022.ntmnguyet;Uid=root;Pwd=namba2001;";
                var mySqlConnection = new MySqlConnection(connectString);

                // Chuẩn bị câu lệnh Update
                string updateEmployeeCommand = "Proc_employee_UpdateEmployee";
                // Chuẩn bị tham số đầu vào cho câu lệnh update
                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeId", EmployeeId);
                parameters.Add("@EmployeeCode", employee.EmployeeCode);
                parameters.Add("@EmployeeName", employee.EmployeeName);
                parameters.Add("@DateOfBirth", employee.DateOfBirth);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@GenderName", employee.GenderName);
                parameters.Add("@IdentityNumber", employee.IdentityNumber);
                parameters.Add("@IdentityPlace", employee.IdentityPlace);
                parameters.Add("@IdentityDate", employee.IdentityDate);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@Address", employee.Address);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);
                parameters.Add("@PositionId", employee.PositionId);
                parameters.Add("@PositionName", employee.PositionName);
                parameters.Add("@DepartmentId", employee.DepartmentId);
                parameters.Add("@DepartmentName", employee.DepartmentName);
                parameters.Add("@PersonalTaxCode", employee.PersonalTaxCode);
                parameters.Add("@Salary", employee.Salary);
                parameters.Add("@JoinDate", employee.JoinDate);
                parameters.Add("@WorkStatus", employee.WorkStatus);
                parameters.Add("@CreatedDate", employee.CreatedDate);
                parameters.Add("@CreatedBy", employee.CreatedBy);
                parameters.Add("@ModifiedDate", employee.ModifiedDate);
                parameters.Add("@ModifiedBy", employee.ModifiedBy);

                // Thực hiện gọi vào DB để chạy câu lệnh UPDATE với tham số đầu vào ở trên
                int numberOfAffectedRows = mySqlConnection.Execute(updateEmployeeCommand, parameters);

                // Xử lý kết quả trả về từ DB
                if (numberOfAffectedRows > 0)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, EmployeeId);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }

            }
            catch (MySqlException mySqlException)
            {
                if (mySqlException.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e003");
                }

                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }

        
           
        }

        /// <summary>
        /// API xóa 1 nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng nhân viên cần xóa</param>
        /// <param name="EmployeeId">ID của nhân viên cần xóa</param>
        /// <returns>ID của nhân viên vừa xóa</returns>
        [HttpDelete]
        [Route("{EmployeeId}")]
        public IActionResult deleteEmployee([FromBody] Employee employee, [FromRoute] Guid EmployeeId)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectString = "Server=localhost;Port=3306;Database=ba.21h.2022.ntmnguyet;Uid=root;Pwd=namba2001;";
                var mySqlConnection = new MySqlConnection(connectString);

                // Chuẩn bị câu lệnh DELETE
                string deleteEmployeeCommand = "DELETE FROM tblemployee WHERE EmployeeId = @EmployeeId";

                // Chuẩn bị tham số đầu vào cho câu lệnh DELETE
                var parameters = new DynamicParameters();
                parameters.Add("@EmployeeId", EmployeeId);

                // Thực hiện gọi vào DB để chạy câu lệnh DELETE với tham số đầu vào ở trên
                int numberOfAffectedRows = mySqlConnection.Execute(deleteEmployeeCommand, parameters);

                // Xử lý kết quả trả về từ DB
                if (numberOfAffectedRows > 0)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, EmployeeId);
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


/// Note - Status code:
/// 1. StatusCodes.Status200OK => request thành công
/// 2. StatusCodes.Status201CREATED => Tạo dữ liệu thành công, sd riêng cho phương thức POST
/// 3. StatusCodes.Status400BADREQUEST => server xử lý request gặp lỗi, kể cả exception
/// 4. StatusCodes.Status401UNAUTHORIZED => hệ thống chưa đc ủy quyền vd chưa có usename/password
/// 5. StatusCodes.Status403FORBIDDEN => client k có quyền truy cập tài nguyên này
/// 6. StatusCodes.Status404NOTFOUND => server k tìm thấy bất kỳ tài nguyên nào liên quan tới request url này 
/// 7. StatusCodes.Status500INTERNALSERVERERROR => có lỗi xảy ra phía máy chủ vd server quá tải CPU, RAM

/// Note: StatusCode(trạng_thái_trả_về, dữ_liệu_trả_về)

/// Note: Các hàm quan trọng trong Dapper
/// 1. Hàm khởi tạo DynamicParameter() : Lưu các tham số đầu vào của câu lệnh SQL
/// 2. Execute(): Muốn kết quả trả về số bản ghi bị ảnh hưởng
/// 3. QueryMultiple(): Muốn kết quả trả về bao gồm multiple result sets
/// 4. QueryFirstOrDefault() : Muốn lấy kết quả trả về là bản ghi đầu tiên, nếu k có bản ghi nào phù hợp thì sẽ lấy giá trị mặc định của kiểu dữ liệu mong muốn
/// 5. Query(): Muốn kết quả trả về 1 danh sách