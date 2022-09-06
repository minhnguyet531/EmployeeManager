using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.BA._21H._2022.API.Entities;
using MISA.BA._21H._2022.API.Entities.DTO;

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
            /// Trả vể 1 list danh sách nhân viên
            return StatusCode(StatusCodes.Status200OK, new List<Employee>
            {
                new Employee
                {
                    /// Fix cứng dữ liệu có trong database
                    EmployeeID = Guid.NewGuid(),
                        EmployeeCode = "NV00001",
                        EmployeeName = "Trần Minh Sáng",
                        DateOfBirth = DateTime.Now,
                        Gender = 1,
                        IdentityNumber = "0231654321",
                        IdentityIssuedPlace = "CA Hà Nội",
                        IdentityIssuedDate = DateTime.Now,
                        Email = "sangtran.d14ptit@gmail.com",
                        PhoneNumber = "0355557796",
                        PositionID = Guid.NewGuid(),
                        PositionName = "Lập trình viên",
                        DepartmentID = Guid.NewGuid(),
                        DepartmentName = "Khối sản xuất",
                        TaxCode = "132165131",
                        Salary = 30000000,
                        JoiningDate = DateTime.Now,
                        WorkStatus = 0,
                        CreatedDate = DateTime.Now,
                        CreatedBy = "admin",
                        ModifiedDate = DateTime.Now,
                        ModifiedBy = "admin"

                },
                new Employee
                {
                    /// Fix cứng dữ liệu có trong database
                    EmployeeID = Guid.NewGuid(),
                        EmployeeCode = "NV00002",
                        EmployeeName = "Trần Minh Sáng",
                        DateOfBirth = DateTime.Now,
                        Gender = 1,
                        IdentityNumber = "0231654321",
                        IdentityIssuedPlace = "CA Hà Nội",
                        IdentityIssuedDate = DateTime.Now,
                        Email = "sangtran.d14ptit@gmail.com",
                        PhoneNumber = "0355557796",
                        PositionID = Guid.NewGuid(),
                        PositionName = "Lập trình viên",
                        DepartmentID = Guid.NewGuid(),
                        DepartmentName = "Khối sản xuất",
                        TaxCode = "132165131",
                        Salary = 30000000,
                        JoiningDate = DateTime.Now,
                        WorkStatus = 1,
                        CreatedDate = DateTime.Now,
                        CreatedBy = "admin",
                        ModifiedDate = DateTime.Now,
                        ModifiedBy = "admin"

                },
                new Employee
                {
                    /// Fix cứng dữ liệu có trong database
                    EmployeeID = Guid.NewGuid(),
                        EmployeeCode = "NV00003",
                        EmployeeName = "Trần Minh Sáng",
                        DateOfBirth = DateTime.Now,
                        Gender = 1,
                        IdentityNumber = "0231654321",
                        IdentityIssuedPlace = "CA Hà Nội",
                        IdentityIssuedDate = DateTime.Now,
                        Email = "sangtran.d14ptit@gmail.com",
                        PhoneNumber = "0355557796",
                        PositionID = Guid.NewGuid(),
                        PositionName = "Lập trình viên",
                        DepartmentID = Guid.NewGuid(),
                        DepartmentName = "Khối sản xuất",
                        TaxCode = "132165131",
                        Salary = 30000000,
                        JoiningDate = DateTime.Now,
                        WorkStatus = 2,
                        CreatedDate = DateTime.Now,
                        CreatedBy = "admin",
                        ModifiedDate = DateTime.Now,
                        ModifiedBy = "admin"

                }
            });
        }

        /// <summary>
        /// API lấy thông tin chi tiết 1 nhân viên
        /// </summary>
        /// <param name="employeeID">ID nhân viên</param>
        /// <returns>Thông tin chi tiết 1 nhân viên</returns>
        [HttpGet]
        [Route("{employeeID}")]  /// dấu { } có ý nghĩa là muốn truyền 1 tham số vào
        public IActionResult GetEmployeeByID([FromRoute] Guid employeeID)
        {
            return StatusCode(StatusCodes.Status200OK, new Employee
            {


                /// Fix cứng dữ liệu có trong database
                EmployeeID = Guid.NewGuid(),
                EmployeeCode = "NV00001",
                EmployeeName = "Trần Minh Sáng",
                DateOfBirth = DateTime.Now,
                Gender = 1,
                IdentityNumber = "0231654321",
                IdentityIssuedPlace = "CA Hà Nội",
                IdentityIssuedDate = DateTime.Now,
                Email = "sangtran.d14ptit@gmail.com",
                PhoneNumber = "0355557796",
                PositionID = Guid.NewGuid(),
                PositionName = "Lập trình viên",
                DepartmentID = Guid.NewGuid(),
                DepartmentName = "Khối sản xuất",
                TaxCode = "132165131",
                Salary = 30000000,
                JoiningDate = DateTime.Now,
                WorkStatus = 0,
                CreatedDate = DateTime.Now,
                CreatedBy = "admin",
                ModifiedDate = DateTime.Now,
                ModifiedBy = "admin"


            });
        }

        /// <summary>
        /// API lọc danh sách nhân viên có điều kiện tìm kiếm và phân trang
        /// </summary>
        /// <param name="keyword">Từ khóa muốn tìm kiếm (Mã nhân viên, tên nhân viên, Số điện thoại)</param>
        /// <param name="posistionID">ID vị trí</param>
        /// <param name="departmentID">ID phòng ban</param>
        /// <param name="limit">Số bản ghi trong 1 trang</param>
        /// <param name="offset">Vị trí bản ghi bắt đầu lấy dữ liệu</param>
        /// <returns>Danh sách nhân viên</returns>
        [HttpGet]
        [Route("filter")]
        public IActionResult FilterEmployees(
            [FromQuery] string keyword,
            [FromQuery] Guid posistionID,
            [FromQuery] Guid departmentID,
            [FromQuery] int limit, 
            [FromQuery] int offset


            )
        {
            return StatusCode(StatusCodes.Status200OK, new PagingData
            {
                Data = new List<Employee>
                {
                    new Employee
                    {
                        /// Fix cứng dữ liệu có trong database
                        EmployeeID = Guid.NewGuid(),
                            EmployeeCode = "NV00001",
                            EmployeeName = "Trần Minh Sáng",
                            DateOfBirth = DateTime.Now,
                            Gender = 1,
                            IdentityNumber = "0231654321",
                            IdentityIssuedPlace = "CA Hà Nội",
                            IdentityIssuedDate = DateTime.Now,
                            Email = "sangtran.d14ptit@gmail.com",
                            PhoneNumber = "0355557796",
                            PositionID = Guid.NewGuid(),
                            PositionName = "Lập trình viên",
                            DepartmentID = Guid.NewGuid(),
                            DepartmentName = "Khối sản xuất",
                            TaxCode = "132165131",
                            Salary = 30000000,
                            JoiningDate = DateTime.Now,
                            WorkStatus = 0,
                            CreatedDate = DateTime.Now,
                            CreatedBy = "admin",
                            ModifiedDate = DateTime.Now,
                            ModifiedBy = "admin"

                    },
                    new Employee
                    {
                        /// Fix cứng dữ liệu có trong database
                        EmployeeID = Guid.NewGuid(),
                            EmployeeCode = "NV00002",
                            EmployeeName = "Trần Minh Sáng",
                            DateOfBirth = DateTime.Now,
                            Gender = 1,
                            IdentityNumber = "0231654321",
                            IdentityIssuedPlace = "CA Hà Nội",
                            IdentityIssuedDate = DateTime.Now,
                            Email = "sangtran.d14ptit@gmail.com",
                            PhoneNumber = "0355557796",
                            PositionID = Guid.NewGuid(),
                            PositionName = "Lập trình viên",
                            DepartmentID = Guid.NewGuid(),
                            DepartmentName = "Khối sản xuất",
                            TaxCode = "132165131",
                            Salary = 30000000,
                            JoiningDate = DateTime.Now,
                            WorkStatus = 1,
                            CreatedDate = DateTime.Now,
                            CreatedBy = "admin",
                            ModifiedDate = DateTime.Now,
                            ModifiedBy = "admin"

                    },
                },
                TotalCount = 2
            });
        }

        /// <summary>
        /// API thêm mới 1 nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng nhân viên cần thêm mới</param>
        /// <returns>ID của nhân viên thêm mới</returns>
        [HttpPost]
        public IActionResult InsertEmployee([FromBody] Employee employee)
        {
            return StatusCode(StatusCodes.Status201Created, Guid.NewGuid());
        }

        /// <summary>
        /// API sửa 1 nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng nhân viên cần sửa</param>
        /// <param name="employeeID">ID của nhân viên cần sửa</param>
        /// <returns>ID của nhân viên cần sửa</returns>
        [HttpPut]
        [Route("{employeeID}")]
        public IActionResult UpdateEmployee([FromBody] Employee employee, [FromRoute] Guid employeeID)
        {
            return StatusCode(StatusCodes.Status200OK, employeeID);
        }

        /// <summary>
        /// API xóa 1 nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng nhân viên cần xóa</param>
        /// <param name="employeeID">ID của nhân viên cần xóa</param>
        /// <returns>ID của nhân viên cần xóa</returns>
        [HttpDelete]
        [Route("{employeeID}")]
        public IActionResult deleteEmployee([FromBody] Employee employee, [FromRoute] Guid employeeID)
        {
            return StatusCode(StatusCodes.Status200OK, employeeID);
        }

    }


}
